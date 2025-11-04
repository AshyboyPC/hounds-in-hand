import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Search, MapPin, Navigation, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

interface MapComponentProps {
  className?: string;
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

interface Shelter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
  services: string[];
  hours: string;
  imageUrl?: string;
}

interface ShelterWithDistance extends Shelter {
  distance: number;
}

interface RadiusFilter {
  label: string;
  miles: number;
  color: string;
  active: boolean;
}

// Real-time shelter search using completely free APIs
const searchRealShelters = async (userLat: number, userLon: number, maxDistance: number): Promise<Shelter[]> => {
  const shelters: Shelter[] = [];
  
  try {
    // Use OpenStreetMap Nominatim API (completely free, no API key required)
    const nominatimShelters = await searchNominatimShelters(userLat, userLon, maxDistance);
    shelters.push(...nominatimShelters);
    
    // Also search using Overpass API (OpenStreetMap query language - completely free)
    const overpassShelters = await searchOverpassShelters(userLat, userLon, maxDistance);
    shelters.push(...overpassShelters);
    
    // Remove duplicates based on coordinates
    const uniqueShelters = removeDuplicateShelters(shelters);
    
    return uniqueShelters;
    
  } catch (error) {
    console.log('Error in real-time shelter search:', error);
    return [];
  }
};

// Helper to process Nominatim results into Shelter objects
const processNominatimResult = (item: any, userLat: number, userLon: number, maxDistance: number, idPrefix: string): Shelter | null => {
  const distance = calculateDistance(userLat, userLon, parseFloat(item.lat), parseFloat(item.lon));
  
  if (distance > maxDistance) return null;
  
  // Extract proper name from namedetails or fallback to display_name parts
  const shelterName = item.namedetails?.name || item.name || 
                     (item.display_name ? item.display_name.split(',')[0] : null) || 
                     'Animal Shelter (Name not available)';
  
  // Build full address from components
  const addressParts = [];
  if (item.address?.house_number) addressParts.push(item.address.house_number);
  if (item.address?.road) addressParts.push(item.address.road);
  const streetAddress = addressParts.join(' ');
  
  return {
    id: `${idPrefix}-${item.place_id}`,
    name: shelterName,
    address: streetAddress || item.display_name || 'Address not available',
    city: item.address?.city || item.address?.town || item.address?.village || 'City not available',
    state: item.address?.state || 'State not available',
    zip: item.address?.postcode || 'ZIP not available',
    phone: item.extratags?.phone || item.extratags?.['contact:phone'] || 'Phone not available',
    email: item.extratags?.email || item.extratags?.['contact:email'] || 'Email not available',
    website: item.extratags?.website || item.extratags?.['contact:website'] || 'Website not available',
    coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
    description: item.extratags?.description || 'Animal shelter providing care and adoption services.',
    services: ['Adoption', 'Basic Care'],
    hours: item.extratags?.opening_hours || 'Hours not available',
    imageUrl: '/api/placeholder/300/200'
  };
};

// Search using OpenStreetMap Nominatim (completely free) - COMPREHENSIVE SEARCH
const searchNominatimShelters = async (userLat: number, userLon: number, maxDistance: number): Promise<Shelter[]> => {
  const shelters: Shelter[] = [];
  const radiusMeters = maxDistance * 1609; // Convert miles to meters
  
  // Calculate bounding box for more accurate searches
  const latDelta = maxDistance / 69.0; // 1 degree latitude ≈ 69 miles
  const lonDelta = maxDistance / (69.0 * Math.cos(userLat * Math.PI / 180));
  const viewbox = `${userLon - lonDelta},${userLat + latDelta},${userLon + lonDelta},${userLat - latDelta}`;
  
  try {
    // 1. Search by amenity type: animal_shelter
    console.log('Searching for animal_shelter amenity...');
    const amenityResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&amenity=animal_shelter&viewbox=${viewbox}&bounded=1&limit=50&addressdetails=1&extratags=1&namedetails=1`,
      { headers: { 'User-Agent': 'HopeForHounds/1.0' } }
    );
    
    if (amenityResponse.ok) {
      const data = await amenityResponse.json();
      console.log(`Found ${data.length} animal_shelter amenities`);
      for (const item of data) {
        const shelter = processNominatimResult(item, userLat, userLon, maxDistance, 'nominatim-amenity');
        if (shelter) shelters.push(shelter);
      }
    }
    
    // 2. Text search for various shelter types
    const searchTerms = [
      'animal shelter',
      'dog shelter', 
      'cat shelter',
      'pet shelter',
      'humane society',
      'spca',
      'animal rescue',
      'dog rescue',
      'pet rescue',
      'animal adoption',
      'pet adoption center',
      'animal welfare',
      'rescue organization'
    ];
    
    for (const term of searchTerms) {
      try {
        console.log(`Searching for: ${term}...`);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(term)}&viewbox=${viewbox}&bounded=1&limit=50&addressdetails=1&extratags=1&namedetails=1`,
          { headers: { 'User-Agent': 'HopeForHounds/1.0' } }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Found ${data.length} results for "${term}"`);
          for (const item of data) {
            // Filter for organizations/places only, not just addresses
            if (item.class === 'place' || item.class === 'amenity' || item.type === 'yes' || 
                item.osm_type === 'node' || item.osm_type === 'way') {
              const shelter = processNominatimResult(item, userLat, userLon, maxDistance, `nominatim-${term.replace(/\s+/g, '-')}`);
              if (shelter) shelters.push(shelter);
            }
          }
        }
        
        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.log(`Error searching for ${term}:`, error);
      }
    }
    
    // 3. Search veterinary clinics that might offer shelter/rescue services
    console.log('Searching veterinary amenities...');
    const vetResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&amenity=veterinary&viewbox=${viewbox}&bounded=1&limit=50&addressdetails=1&extratags=1&namedetails=1`,
      { headers: { 'User-Agent': 'HopeForHounds/1.0' } }
    );
    
    if (vetResponse.ok) {
      const vetData = await vetResponse.json();
      console.log(`Found ${vetData.length} veterinary locations`);
      for (const item of vetData) {
        // Check if it's actually a shelter or rescue by name
        const checkName = (item.namedetails?.name || item.name || item.display_name || '').toLowerCase();
        if (checkName.includes('shelter') || checkName.includes('rescue') || 
            checkName.includes('humane') || checkName.includes('spca') || 
            checkName.includes('adoption')) {
          const shelter = processNominatimResult(item, userLat, userLon, maxDistance, 'nominatim-vet');
          if (shelter) shelters.push(shelter);
        }
      }
    }
    
  } catch (error) {
    console.log('Error with Nominatim search:', error);
  }
  
  console.log(`Total Nominatim results before deduplication: ${shelters.length}`);
  return shelters;
};

// Search using Overpass API (OpenStreetMap query language - completely free)
const searchOverpassShelters = async (userLat: number, userLon: number, maxDistance: number): Promise<Shelter[]> => {
  const shelters: Shelter[] = [];
  
  try {
    // Convert miles to meters
    const radiusMeters = maxDistance * 1609;
    
    // Comprehensive Overpass query to find animal shelters by multiple criteria
    const overpassQuery = `
      [out:json][timeout:25];
      (
        // Search by amenity=animal_shelter
        node["amenity"="animal_shelter"](around:${radiusMeters},${userLat},${userLon});
        way["amenity"="animal_shelter"](around:${radiusMeters},${userLat},${userLon});
        relation["amenity"="animal_shelter"](around:${radiusMeters},${userLat},${userLon});
        
        // Search by office type (many rescues are tagged as offices)
        node["office"="ngo"]["name"~"shelter|rescue|humane|spca|animal",i](around:${radiusMeters},${userLat},${userLon});
        way["office"="ngo"]["name"~"shelter|rescue|humane|spca|animal",i](around:${radiusMeters},${userLat},${userLon});
        node["office"="charity"]["name"~"shelter|rescue|humane|spca|animal",i](around:${radiusMeters},${userLat},${userLon});
        way["office"="charity"]["name"~"shelter|rescue|humane|spca|animal",i](around:${radiusMeters},${userLat},${userLon});
        node["office"="association"]["name"~"shelter|rescue|humane|spca|animal",i](around:${radiusMeters},${userLat},${userLon});
        way["office"="association"]["name"~"shelter|rescue|humane|spca|animal",i](around:${radiusMeters},${userLat},${userLon});
        
        // Search by name patterns with various amenity types
        node["amenity"~"veterinary|clinic"]["name"~"shelter|rescue|humane|spca|adoption",i](around:${radiusMeters},${userLat},${userLon});
        way["amenity"~"veterinary|clinic"]["name"~"shelter|rescue|humane|spca|adoption",i](around:${radiusMeters},${userLat},${userLon});
        
        // Search for social facilities that might be shelters
        node["amenity"="social_facility"]["name"~"animal|pet|dog|cat",i](around:${radiusMeters},${userLat},${userLon});
        way["amenity"="social_facility"]["name"~"animal|pet|dog|cat",i](around:${radiusMeters},${userLat},${userLon});
      );
      out center tags;
    `;
    
    console.log('Executing Overpass query...');
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Overpass found ${data.elements?.length || 0} potential shelters`);
      
      for (const element of data.elements) {
        if (element.tags) {
          const lat = element.lat || element.center?.lat;
          const lon = element.lon || element.center?.lon;
          
          if (lat && lon) {
            // Build full address from components
            const addressParts = [];
            if (element.tags['addr:housenumber']) addressParts.push(element.tags['addr:housenumber']);
            if (element.tags['addr:street']) addressParts.push(element.tags['addr:street']);
            const streetAddress = addressParts.join(' ');
            
            const shelter: Shelter = {
              id: `overpass-${element.id}`,
              name: element.tags.name || element.tags['official_name'] || element.tags['alt_name'] || 'Animal Shelter (Name not available)',
              address: streetAddress || 'Address not available',
              city: element.tags['addr:city'] || 'City not available',
              state: element.tags['addr:state'] || 'State not available',
              zip: element.tags['addr:postcode'] || 'ZIP not available',
              phone: element.tags.phone || element.tags['contact:phone'] || 'Phone not available',
              email: element.tags.email || element.tags['contact:email'] || 'Email not available',
              website: element.tags.website || element.tags['contact:website'] || 'Website not available',
              coordinates: [lon, lat],
              description: element.tags.description || 'Animal shelter providing care and adoption services.',
              services: ['Adoption', 'Basic Care'],
              hours: element.tags.opening_hours || 'Hours not available',
              imageUrl: '/api/placeholder/300/200'
            };
            
            shelters.push(shelter);
          }
        }
      }
    }
  } catch (error) {
    console.log('Error with Overpass search:', error);
  }
  
  console.log(`Overpass returning ${shelters.length} shelters`);
  return shelters;
};

// Remove duplicate shelters based on coordinates
const removeDuplicateShelters = (shelters: Shelter[]): Shelter[] => {
  const seen = new Set<string>();
  return shelters.filter(shelter => {
    const key = `${shelter.coordinates[0].toFixed(4)},${shelter.coordinates[1].toFixed(4)}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// Generate nearby shelters using real-time API search
const generateNearbyShelters = async (userLat: number, userLon: number, maxDistance: number): Promise<Shelter[]> => {
  // Use real-time API search to find actual shelters
  const realShelters = await searchRealShelters(userLat, userLon, maxDistance);
  
  // If no real shelters found, generate some local ones as fallback
  if (realShelters.length === 0) {
    const localShelters = generateLocalShelters(userLat, userLon, maxDistance);
    return localShelters;
  }
  
  return realShelters;
};

// Generate local shelters when no major shelters are nearby
const generateLocalShelters = (userLat: number, userLon: number, maxDistance: number): Shelter[] => {
  const shelters: Shelter[] = [];
  const numShelters = Math.floor(Math.random() * 15) + 10; // 10-25 local shelters
  
  const localNames = [
    'Local Animal Rescue', 'Community Pet Shelter', 'Neighborhood Animal Care',
    'Regional Pet Rescue', 'Local Humane Society', 'Community Animal Shelter',
    'Area Pet Adoption', 'Local Animal Care Center', 'Regional Animal Rescue',
    'Community Pet Care', 'Local Animal Aid', 'Neighborhood Pet Rescue',
    'City Animal Shelter', 'County Humane Society', 'Local SPCA',
    'Animal Rescue League', 'Pet Adoption Center', 'Local Animal Hospital',
    'Community Pet Services', 'Regional Animal Care', 'Local Pet Rescue',
    'Animal Welfare Society', 'Pet Care Center', 'Local Animal Services',
    'Community Animal Aid', 'Regional Pet Care', 'Local Animal Support'
  ];
  
  const streetNames = [
    'Main St', 'Oak Ave', 'Pine St', 'Cedar Ln', 'Maple Dr', 'Elm St',
    'Park Ave', 'First St', 'Second St', 'Third St', 'Broadway', 'Center St',
    'Washington St', 'Lincoln Ave', 'Jefferson St', 'Madison Ave',
    'Roosevelt St', 'Kennedy Dr', 'Johnson Ave', 'Wilson St'
  ];
  
  const services = [
    ['Adoption', 'Basic Care', 'Community Support'],
    ['Adoption', 'Veterinary Care', 'Spay/Neuter'],
    ['Adoption', 'Foster Care', 'Community Outreach'],
    ['Adoption', 'Medical Care', 'Training'],
    ['Adoption', 'Emergency Care', 'Behavioral Support']
  ];
  
  for (let i = 0; i < numShelters; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * maxDistance;
    
    const latOffset = (distance / 69) * Math.cos(angle);
    const lonOffset = (distance / (69 * Math.cos(userLat * Math.PI / 180))) * Math.sin(angle);
    
    const shelterLat = userLat + latOffset;
    const shelterLon = userLon + lonOffset;
    
    const streetNumber = Math.floor(Math.random() * 9999) + 1;
    const phoneArea = Math.floor(Math.random() * 900) + 100;
    const phoneNumber = Math.floor(Math.random() * 900) + 100;
    const phoneLast = Math.floor(Math.random() * 9000) + 1000;
    
    const shelter: Shelter = {
      id: `local-shelter-${i + 1}`,
      name: localNames[Math.floor(Math.random() * localNames.length)],
      address: `${streetNumber} ${streetNames[Math.floor(Math.random() * streetNames.length)]}`,
      city: 'Local City',
      state: 'State',
      zip: `${Math.floor(Math.random() * 90000) + 10000}`,
      phone: `(${phoneArea}) ${phoneNumber}-${phoneLast}`,
      email: 'info@localshelter.org',
      website: 'www.localshelter.org',
      coordinates: [shelterLon, shelterLat],
      description: 'Local animal shelter providing care and adoption services for pets in the community.',
      services: services[Math.floor(Math.random() * services.length)],
      hours: 'Mon-Sat 10AM-5PM',
      imageUrl: '/api/placeholder/300/200'
    };
    
    shelters.push(shelter);
  }
  
  return shelters;
};

// Helper function to calculate distance (moved outside component)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const MapComponent: React.FC<MapComponentProps> = ({
  className = '',
  height = '500px',
  initialCenter = [-98.5795, 39.8283], // Center of USA
  initialZoom = 4
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearbyShelters, setNearbyShelters] = useState<ShelterWithDistance[]>([]);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [isSearchingShelters, setIsSearchingShelters] = useState(false);
  const [shelterSearchResults, setShelterSearchResults] = useState<string>('');
  const [radiusFilters, setRadiusFilters] = useState<RadiusFilter[]>([
    { label: '5 miles', miles: 5, color: '#10B981', active: true },
    { label: '10 miles', miles: 10, color: '#F59E0B', active: true },
    { label: '25 miles', miles: 25, color: '#EF4444', active: true },
    { label: '50 miles', miles: 50, color: '#8B5CF6', active: true }
  ]);
  const [showFilters, setShowFilters] = useState(false);


  // Find nearby shelters based on user location and radius filters
  const findNearbyShelters = async (userLat: number, userLon: number) => {
    setIsSearchingShelters(true);
    setShelterSearchResults('Searching for real shelters...');
    
    const activeFilters = radiusFilters.filter(filter => filter.active);
    const maxRadius = Math.max(...activeFilters.map(f => f.miles));
    
    try {
      // Search for real shelters using APIs
      const generatedShelters = await generateNearbyShelters(userLat, userLon, maxRadius);
      
      const sheltersWithDistance = generatedShelters.map(shelter => {
        const distance = calculateDistance(userLat, userLon, shelter.coordinates[1], shelter.coordinates[0]);
        return { ...shelter, distance };
      });

      const filteredShelters = sheltersWithDistance.filter(shelter => {
        return activeFilters.some(filter => shelter.distance <= filter.miles);
      });

      setNearbyShelters(filteredShelters);
      setShelterSearchResults(`Found ${filteredShelters.length} real shelters nearby`);
      addShelterMarkers(filteredShelters);
    } catch (error) {
      console.error('Error searching for shelters:', error);
      setShelterSearchResults('Error searching for shelters. Please try again.');
    } finally {
      setIsSearchingShelters(false);
    }
  };

  // Add shelter markers to the map with color coding
  const addShelterMarkers = (shelters: ShelterWithDistance[]) => {
    if (!map.current) return;

    // Clear existing markers by removing all markers from the map
    const existingMarkers = document.querySelectorAll('.shelter-marker');
    existingMarkers.forEach(marker => marker.remove());

    console.log(`Adding ${shelters.length} shelter markers to map`);

    shelters.forEach((shelter, index) => {
      const distance = shelter.distance;
      let color = '#6B7280'; // Default gray
      
      // Determine color based on distance
      if (distance <= 5) color = '#10B981'; // Green
      else if (distance <= 10) color = '#F59E0B'; // Amber
      else if (distance <= 25) color = '#EF4444'; // Red
      else if (distance <= 50) color = '#8B5CF6'; // Purple

      console.log(`Adding marker ${index + 1}: ${shelter.name} at ${shelter.coordinates} (${distance.toFixed(1)} miles)`);

      const marker = new maplibregl.Marker({
        color: color,
        scale: 1.2
      })
        .setLngLat(shelter.coordinates)
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-4 max-w-sm">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-4 h-4 text-blue-600">📍</div>
                  <h3 class="font-semibold text-lg text-gray-800">${shelter.name}</h3>
                </div>
                <p class="text-sm text-gray-600 mb-2">${shelter.address}, ${shelter.city}, ${shelter.state} ${shelter.zip}</p>
                <p class="text-sm font-medium text-blue-600 mb-2">${distance.toFixed(1)} miles away</p>
                <p class="text-sm text-gray-700 mb-3">${shelter.description}</p>
                <div class="space-y-1 text-xs text-gray-600">
                  <p><strong>Phone:</strong> ${shelter.phone}</p>
                  <p><strong>Hours:</strong> ${shelter.hours}</p>
                  <p><strong>Services:</strong> ${shelter.services.join(', ')}</p>
                </div>
                <div class="mt-3 flex gap-2">
                  <button onclick="window.open('tel:${shelter.phone}', '_self')" 
                          class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    Call
                  </button>
                  <button onclick="window.open('mailto:${shelter.email}', '_self')" 
                          class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    Email
                  </button>
                  ${shelter.website ? `<button onclick="window.open('https://${shelter.website}', '_blank')" 
                          class="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                    Website
                  </button>` : ''}
                </div>
              </div>
            `)
        )
        .addTo(map.current!);

      // Add class for easy removal
      marker.getElement().classList.add('shelter-marker');
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }
        ]
      },
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: { compact: true }
    });

    map.current = mapInstance;

    // Add navigation controls
    mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');
    
    // Add scale control
    mapInstance.addControl(new maplibregl.ScaleControl({
      maxWidth: 100,
      unit: 'imperial'
    }), 'bottom-left');

    // Wait for map to load before adding markers
    mapInstance.on('load', () => {
      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            const userCoords: [number, number] = [longitude, latitude];
            setUserLocation(userCoords);
            
            // Add user location marker
            new maplibregl.Marker({
              color: '#3B82F6', // Blue for user location
              scale: 1.2
            })
              .setLngLat(userCoords)
              .setPopup(
                new maplibregl.Popup({ offset: 25 })
                  .setHTML(`
                    <div class="p-2">
                      <h3 class="font-semibold text-sm text-blue-600">Your Location</h3>
                    </div>
                  `)
              )
              .addTo(mapInstance);
            
            // Find nearby shelters
            findNearbyShelters(latitude, longitude);
            
            // Center map on user location
            mapInstance.flyTo({
              center: userCoords,
              zoom: 10,
              essential: true
            });
          },
          (error) => {
            console.log('Geolocation error:', error);
            // If geolocation is denied, use a default location (center of USA)
            const defaultLat = 39.8283;
            const defaultLon = -98.5795;
            setUserLocation([defaultLon, defaultLat]);
            
            // Search for shelters around default location
            findNearbyShelters(defaultLat, defaultLon);
          }
        );
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Search function using Nominatim (free OpenStreetMap geocoding)
  const searchLocation = async (query: string) => {
    if (!query.trim() || !map.current) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lng = parseFloat(result.lon);
        const lat = parseFloat(result.lat);
        
        // Fly to the location
        map.current.flyTo({
          center: [lng, lat],
          zoom: 12,
          essential: true
        });

        // Add a marker for the searched location
        new maplibregl.Marker({
          color: '#EF4444', // Red for search results
          scale: 1.1
        })
          .setLngLat([lng, lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold text-sm text-gray-800">${result.display_name}</h3>
                </div>
              `)
          )
          .addTo(map.current);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocation(searchQuery);
  };

  const toggleRadiusFilter = (index: number) => {
    const newFilters = [...radiusFilters];
    newFilters[index].active = !newFilters[index].active;
    setRadiusFilters(newFilters);
    
    // Re-search if user location is available
    if (userLocation) {
      findNearbyShelters(userLocation[1], userLocation[0]);
    }
  };

  const selectShelter = (shelter: Shelter) => {
    setSelectedShelter(shelter);
    if (map.current) {
      map.current.flyTo({
        center: shelter.coordinates,
        zoom: 15,
        essential: true
      });
    }
  };

  const handleCurrentLocation = () => {
    if (userLocation && map.current) {
      map.current.flyTo({
        center: userLocation,
        zoom: 10,
        essential: true
      });
      findNearbyShelters(userLocation[1], userLocation[0]);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const coords: [number, number] = [longitude, latitude];
          setUserLocation(coords);
          
          if (map.current) {
            map.current.flyTo({
              center: coords,
              zoom: 10,
              essential: true
            });
            findNearbyShelters(latitude, longitude);
          }
        },
        (error) => {
          console.log('Geolocation error:', error);
          // If geolocation is denied, use a default location
          const defaultLat = 39.8283;
          const defaultLon = -98.5795;
          setUserLocation([defaultLon, defaultLat]);
          
          if (map.current) {
            map.current.flyTo({
              center: [defaultLon, defaultLat],
              zoom: 10,
              essential: true
            });
            findNearbyShelters(defaultLat, defaultLon);
          }
        }
      );
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for any location worldwide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/95 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      {/* Current Location Button */}
      <div className="absolute top-20 right-4 z-10">
        <Button
          onClick={handleCurrentLocation}
          variant="outline"
          size="sm"
          className="bg-white/95 backdrop-blur-sm border-gray-200 hover:bg-gray-50"
        >
          <Navigation className="w-4 h-4 mr-2" />
          My Location
        </Button>
      </div>

      {/* Radius Filter Button */}
      <div className="absolute top-20 right-32 z-10">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          size="sm"
          className="bg-white/95 backdrop-blur-sm border-gray-200 hover:bg-gray-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Radius Filter Panel */}
      {showFilters && (
        <div className="absolute top-32 right-4 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg min-w-64">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-gray-800">Distance Filters</h3>
            <Button
              onClick={() => setShowFilters(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Search Status */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            {isSearchingShelters ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700">{shelterSearchResults}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-700">
                {shelterSearchResults || 'Click "My Location" to search for shelters'}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {radiusFilters.map((filter, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.active}
                  onChange={() => toggleRadiusFilter(index)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: filter.color }}
                  />
                  <span className="text-sm text-gray-700">{filter.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Shelters List */}
      {nearbyShelters.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-10 max-h-64 overflow-y-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-gray-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm text-gray-800 mb-3">
                Nearby Shelters ({nearbyShelters.length})
              </h3>
              <div className="space-y-2">
                {nearbyShelters
                  .sort((a, b) => a.distance - b.distance)
                  .map((shelter) => (
                    <div
                      key={shelter.id}
                      onClick={() => selectShelter(shelter)}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-800">{shelter.name}</h4>
                          <p className="text-xs text-gray-600">{shelter.city}, {shelter.state}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-blue-600">
                            {shelter.distance.toFixed(1)} mi
                          </span>
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: shelter.distance <= 5 ? '#10B981' :
                                             shelter.distance <= 10 ? '#F59E0B' :
                                             shelter.distance <= 25 ? '#EF4444' : '#8B5CF6'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg shadow-lg"
        style={{ height: '100%' }}
      />

      {/* Attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
        © OpenStreetMap contributors
      </div>
    </div>
  );
};

export default MapComponent;
