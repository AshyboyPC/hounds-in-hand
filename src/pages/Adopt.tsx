import { useState, useMemo, useEffect } from "react";
import { Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useNavigate } from "react-router-dom";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: string;
  ageCategory: 'puppy' | 'young' | 'adult' | 'senior';
  size: 'small' | 'medium' | 'large';
  gender: 'male' | 'female';
  location: string;
  shelter: string;
  temperament: string[];
  description: string;
  imageUrl: string;
  isUrgent?: boolean;
  isAvailable: boolean;
}

const DOGS_PER_PAGE = 20;

const Adopt = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isShelter = profile?.role === 'shelter' || profile?.role === 'admin';
  const [allDogs, setAllDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [breedFilter, setBreedFilter] = useState('all');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch dogs from database
  useEffect(() => {
    const fetchDogs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('dogs')
          .select(`
            id,
            name,
            breed,
            age,
            age_category,
            size,
            gender,
            temperament,
            description,
            status,
            is_urgent,
            photo_urls,
            created_at,
            shelters (
              name,
              city,
              state
            )
          `)
          .in('status', ['available', 'foster'])
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (data) {
          const formattedDogs: Dog[] = data.map((dog: any) => ({
            id: dog.id,
            name: dog.name || '[Dog Name]',
            breed: dog.breed || '[Breed]',
            age: dog.age || '[Age]',
            ageCategory: dog.age_category || 'adult',
            size: dog.size || 'medium',
            gender: dog.gender || 'male',
            location: (Array.isArray(dog.shelters) ? dog.shelters[0]?.city : dog.shelters?.city) || '[Location]',
            shelter: (Array.isArray(dog.shelters) ? dog.shelters[0]?.name : dog.shelters?.name) || '[Shelter Name]',
            temperament: Array.isArray(dog.temperament) ? dog.temperament : (dog.temperament ? [dog.temperament] : ['[Trait]']),
            description: dog.description || '[Dog description will appear here]',
            imageUrl: (Array.isArray(dog.photo_urls) && dog.photo_urls.length > 0) ? dog.photo_urls[0] : '/api/placeholder/400/300',
            isUrgent: dog.is_urgent || false,
            isAvailable: dog.status === 'available' || dog.status === 'foster'
          }));
          setAllDogs(formattedDogs);
        }
      } catch (error: any) {
        console.error('Error fetching dogs:', error);
        toast.error('Failed to load dogs');
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  // Filter dogs based on all criteria
  const filteredDogs = useMemo(() => {
    return allDogs.filter(dog => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dog.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dog.temperament.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Location filter
      const matchesLocation = locationFilter === 'all' || dog.location.toLowerCase() === locationFilter.toLowerCase();

      // Age filter
      const matchesAge = ageFilter === 'all' || dog.ageCategory === ageFilter;

      // Size filter
      const matchesSize = sizeFilter === 'all' || dog.size === sizeFilter;

      // Breed filter
      const matchesBreed = breedFilter === 'all' || dog.breed.toLowerCase().includes(breedFilter.toLowerCase());

      // Availability filter
      const matchesAvailability = !showOnlyAvailable || dog.isAvailable;

      return matchesSearch && matchesLocation && matchesAge && matchesSize && matchesBreed && matchesAvailability;
    });
  }, [allDogs, searchQuery, locationFilter, ageFilter, sizeFilter, breedFilter, showOnlyAvailable]);

  // Get urgent dogs
  const urgentDogs = useMemo(() => {
    return allDogs.filter(dog => dog.isUrgent && dog.isAvailable).slice(0, 3);
  }, [allDogs]);

  // Pagination
  const totalPages = Math.ceil(filteredDogs.length / DOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * DOGS_PER_PAGE;
  const paginatedDogs = filteredDogs.slice(startIndex, startIndex + DOGS_PER_PAGE);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, locationFilter, ageFilter, sizeFilter, breedFilter, showOnlyAvailable]);

  const handleDogClick = (dogId: string) => {
    navigate(`/dog/${dogId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <PageTransition className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading adoptable dogs...</p>
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Responsive */}
        <div className="h-[300px] sm:h-[400px] lg:h-[450px] bg-gradient-to-br from-blue-50 to-orange-50 relative overflow-hidden">
          {/* Subtle paw print patterns */}
          <div className="absolute inset-0 opacity-10 bg-repeat" style={{backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"><path d=\"M20 8c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm-8 8c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm16 0c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm-12 8c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm8 0c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z\" fill=\"%231E4D8C\"/></svg>')"}}></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="w-full max-w-4xl mx-auto text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl display-font mb-2 leading-tight">
                <span className="text-destructive">Find Your</span>
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl display-font text-primary mb-4 lg:mb-5 leading-tight">
                Forever Friend
              </h2>
              <p className="text-lg sm:text-xl body-font text-gray-700 max-w-2xl mx-auto lg:mx-0">
                Browse adoptable dogs and connect with shelters near you
              </p>
            </div>
          </div>
        </div>

        {/* Shelter Info Banner */}
        {isShelter ? (
          <div className="bg-primary/10 border-b border-primary/20 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <p className="text-sm text-primary flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Dogs on this page are posted by shelters from the <strong>Shelter Dashboard</strong></span>
              </p>
              <Button size="sm" variant="outline" className="text-primary border-primary" onClick={() => navigate("/dashboard/shelter")}>
                Post a Dog
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border-b border-blue-200 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Are you a shelter? Post your adoptable dogs from the Shelter Dashboard</span>
              </p>
              <Button size="sm" variant="outline" className="text-blue-700 border-blue-300" onClick={() => navigate("/login")}>
                Shelter Login
              </Button>
            </div>
          </div>
        )}

        {/* Filters & Search Bar Section - Responsive */}
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-orange-50/40 border-t border-b border-slate-200/60 px-4 sm:px-6 lg:px-16 py-6 lg:py-10 shadow-lg">
          <div className="max-w-7xl mx-auto">
            
            {/* Search Bar */}
            <div className="flex justify-center mb-6 lg:mb-8">
              <div className="w-full max-w-md lg:max-w-lg relative">
                <Input
                  placeholder="Search by dog name, breed, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 lg:h-14 border-2 border-primary/20 rounded-2xl bg-white/95 backdrop-blur-md text-sm lg:text-base pr-12 lg:pr-16 pl-4 lg:pl-6 shadow-lg hover:shadow-xl hover:border-primary/40 focus:border-primary transition-all duration-300 focus:bg-white"
                />
                <Search className="absolute right-4 lg:right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 lg:h-6 lg:w-6 text-primary/70" />
              </div>
            </div>

            {/* Filters - Responsive Layout */}
            <div className="space-y-6 lg:space-y-0">
              
              {/* Main Filters - Stack on mobile, grid on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                <div className="space-y-2">
                  <label className="text-xs lg:text-sm text-slate-600 font-semibold tracking-wide uppercase">Location</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-full h-10 lg:h-12 border-2 border-slate-200 rounded-xl bg-white/95 backdrop-blur-sm text-sm lg:text-base shadow-md hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="campbell">Campbell</SelectItem>
                      <SelectItem value="harrisburg">Harrisburg</SelectItem>
                      <SelectItem value="york">York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs lg:text-sm text-slate-600 font-semibold tracking-wide uppercase">Age</label>
                  <Select value={ageFilter} onValueChange={setAgeFilter}>
                    <SelectTrigger className="w-full h-10 lg:h-12 border-2 border-slate-200 rounded-xl bg-white/95 backdrop-blur-sm text-sm lg:text-base shadow-md hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                      <SelectValue placeholder="Any Age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Age</SelectItem>
                      <SelectItem value="puppy">Puppy</SelectItem>
                      <SelectItem value="young">Young</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs lg:text-sm text-slate-600 font-semibold tracking-wide uppercase">Size</label>
                  <Select value={sizeFilter} onValueChange={setSizeFilter}>
                    <SelectTrigger className="w-full h-10 lg:h-12 border-2 border-slate-200 rounded-xl bg-white/95 backdrop-blur-sm text-sm lg:text-base shadow-md hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                      <SelectValue placeholder="Any Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Size</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs lg:text-sm text-slate-600 font-semibold tracking-wide uppercase">Breed</label>
                  <Select value={breedFilter} onValueChange={setBreedFilter}>
                    <SelectTrigger className="w-full h-10 lg:h-12 border-2 border-slate-200 rounded-xl bg-white/95 backdrop-blur-sm text-sm lg:text-base shadow-md hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                      <SelectValue placeholder="Any Breed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Breed</SelectItem>
                      <SelectItem value="labrador">Labrador</SelectItem>
                      <SelectItem value="golden">Golden Retriever</SelectItem>
                      <SelectItem value="german">German Shepherd</SelectItem>
                      <SelectItem value="mixed">Mixed Breed</SelectItem>
                      <SelectItem value="beagle">Beagle</SelectItem>
                      <SelectItem value="poodle">Poodle</SelectItem>
                      <SelectItem value="border">Border Collie</SelectItem>
                      <SelectItem value="corgi">Corgi</SelectItem>
                      <SelectItem value="boxer">Boxer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Availability Toggle - Centered on mobile */}
              <div className="flex justify-center lg:justify-end pt-4 lg:pt-0">
                <div className="flex flex-col items-center lg:items-end space-y-3">
                  <label className="text-xs lg:text-sm text-slate-600 font-semibold tracking-wide uppercase">Availability</label>
                  <div className="flex items-center space-x-2 lg:space-x-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 lg:px-6 py-2 lg:py-3 shadow-lg">
                    <span className={`text-sm lg:text-base font-medium transition-colors ${showOnlyAvailable ? 'text-primary' : 'text-slate-700'}`}>Available Now</span>
                    <div 
                      onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                      className={`w-12 lg:w-14 h-6 lg:h-7 rounded-full relative cursor-pointer shadow-inner hover:shadow-lg transition-all duration-300 ${showOnlyAvailable ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-gray-300'}`}
                    >
                      <div className={`w-5 lg:w-6 h-5 lg:h-6 bg-white rounded-full absolute top-0.5 transition-transform shadow-md ${showOnlyAvailable ? 'left-0.5' : 'right-0.5'}`}></div>
                    </div>
                    <span className={`text-sm lg:text-base font-medium transition-colors ${!showOnlyAvailable ? 'text-primary' : 'text-slate-700'}`}>Foster Needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dog Spotlight / Urgent Needs Section - Fully Responsive */}
        <FadeIn direction="up">
          <div className="bg-[#FFF5E6] mx-2 sm:mx-4 lg:mx-6 xl:mx-8 my-4 sm:my-6 rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 relative overflow-hidden">
            {/* Paw print patterns */}
            <div className="absolute inset-0 opacity-10 bg-repeat" style={{backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"><path d=\"M20 8c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm-8 8c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm16 0c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm-12 8c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm8 0c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z\" fill=\"%23F5A623\"/></svg>')"}}></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl display-font text-destructive mb-1 sm:mb-2">Dogs With Urgent Needs</h2>
              <p className="text-xs sm:text-sm md:text-base body-font text-gray-700 mb-3 sm:mb-4 lg:mb-6">These dogs need immediate help</p>
            
            <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {urgentDogs.map((dog) => (
                <StaggerItem key={dog.id}>
                  <div className="bg-white rounded-lg p-2 sm:p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => handleDogClick(dog.id)}>
                    <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 sm:space-x-3">
                      {/* Image - Responsive sizing */}
                      <div className="w-full xs:w-20 sm:w-24 md:w-28 lg:w-[100px] h-40 xs:h-20 sm:h-24 md:h-28 lg:h-[100px] bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        <img src={dog.imageUrl} alt={dog.name} className="w-full h-full object-cover" />
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                          <h3 className="text-sm sm:text-base md:text-lg display-font text-primary truncate">{dog.name}</h3>
                          <span className="bg-gray-300 text-gray-600 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap flex-shrink-0">[Status]</span>
                        </div>
                        <p className="text-xs sm:text-sm body-font text-gray-700 mb-2 sm:mb-3 line-clamp-2">
                          {dog.description}
                        </p>
                        <Button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/sponsor/${dog.id}`); }} 
                          className="bg-destructive hover:bg-destructive/90 text-white text-xs sm:text-sm font-bold rounded-full h-7 sm:h-8 md:h-9 px-3 sm:px-4 md:px-6 w-full xs:w-auto transition-all"
                        >
                          Sponsor Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            </div>
          </div>
        </FadeIn>

        {/* Dog Listing Grid Section - Responsive */}
        <div className="bg-white px-3 sm:px-4 md:px-6 lg:px-12 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            <FadeIn direction="up">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl display-font text-primary mb-2">Adoptable Dogs</h2>
              <p className="text-sm sm:text-base md:text-lg body-font text-gray-700 mb-4 sm:mb-6 lg:mb-8">Find your perfect match</p>
            </FadeIn>
            
            <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              {paginatedDogs.length > 0 ? (
                paginatedDogs.map((dog) => (
                  <StaggerItem key={dog.id}>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => handleDogClick(dog.id)}>
                      <div className="relative mb-4">
                        <div className="w-full h-48 sm:h-56 lg:h-48 bg-gray-200 rounded-lg overflow-hidden">
                          <img src={dog.imageUrl} alt={dog.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute top-2 right-2 text-gray-600 text-xs px-2 py-1 rounded bg-gray-200">
                          [Status]
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl display-font text-primary mb-2">{dog.name}</h3>
                      <p className="text-sm body-font text-gray-700 mb-2">{dog.age} • {dog.breed} • {dog.size.charAt(0).toUpperCase() + dog.size.slice(1)}</p>
                      <p className="text-sm body-font text-gray-600 mb-4 line-clamp-3">
                        {dog.description}
                      </p>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button onClick={(e) => { e.stopPropagation(); navigate(`/dog/${dog.id}`); }} className="flex-1 bg-destructive hover:bg-destructive/90 text-white text-sm sm:text-base font-bold rounded-full h-10 sm:h-11">
                          Adopt Me
                        </Button>
                        <Button onClick={(e) => { e.stopPropagation(); navigate(`/sponsor/${dog.id}`); }} className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm sm:text-base font-bold rounded-full h-10 sm:h-11">
                          Sponsor
                        </Button>
                      </div>
                    </div>
                  </StaggerItem>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg text-gray-500">No dogs match your search criteria. Try adjusting your filters.</p>
                </div>
              )}
            </StaggerContainer>

            {/* Pagination - Responsive */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                {/* Previous Button */}
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm sm:text-base transition-colors ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ←
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm sm:text-base transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                {/* Next Button */}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm sm:text-base transition-colors ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Adopt;