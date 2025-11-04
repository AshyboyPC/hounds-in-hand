import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Search, MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface EmbeddableMapProps {
  className?: string;
  height?: string;
  width?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  showSearch?: boolean;
  showCurrentLocation?: boolean;
  showControls?: boolean;
}

const EmbeddableMap: React.FC<EmbeddableMapProps> = ({
  className = '',
  height = '400px',
  width = '100%',
  initialCenter = [-98.5795, 39.8283], // Center of USA
  initialZoom = 4,
  showSearch = true,
  showCurrentLocation = true,
  showControls = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new maplibregl.Map({
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
        attributionControl: showControls
      });

      // Add navigation controls if enabled
      if (showControls) {
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.current.addControl(new maplibregl.ScaleControl({
          maxWidth: 100,
          unit: 'imperial'
        }), 'bottom-left');
      }

      // Get user's current location if enabled
      if (showCurrentLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            const userCoords: [number, number] = [longitude, latitude];
            setUserLocation(userCoords);
            
            // Add user location marker
            new maplibregl.Marker({
              color: '#3B82F6', // Campbell blue
              scale: 1.2
            })
              .setLngLat(userCoords)
              .addTo(map.current!);
          },
          (error) => {
            console.log('Geolocation error:', error);
          }
        );
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialCenter, initialZoom, showControls, showCurrentLocation]);

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

  const handleCurrentLocation = () => {
    if (userLocation && map.current) {
      map.current.flyTo({
        center: userLocation,
        zoom: 15,
        essential: true
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const coords: [number, number] = [longitude, latitude];
          setUserLocation(coords);
          
          if (map.current) {
            map.current.flyTo({
              center: coords,
              zoom: 15,
              essential: true
            });
          }
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div 
      className={`relative ${className}`} 
      style={{ height, width }}
    >
      {/* Search Bar */}
      {showSearch && (
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
      )}

      {/* Current Location Button */}
      {showCurrentLocation && (
        <div className={`absolute ${showSearch ? 'top-20' : 'top-4'} right-4 z-10`}>
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

export default EmbeddableMap;
