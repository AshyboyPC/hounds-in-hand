import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Star, AlertCircle, Calendar, Building2, Dog, Users, Package, Info } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn, SlideInLeft, FloatIn, RotateIn } from "@/components/animations";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShelterStory {
  id: string;
  shelter_id: string;
  shelter_name: string;
  title: string;
  content: string;
  story_type: string;
  dog_name?: string;
  photo_url?: string;
  is_featured: boolean;
  created_at: string;
}

const ShelterStories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<ShelterStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [shelterFilter, setShelterFilter] = useState("all");

  // Fetch stories from database
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('shelter_stories')
          .select(`
            *,
            shelters (
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedStories: ShelterStory[] = data.map((story: any) => ({
            id: story.id,
            shelter_id: story.shelter_id,
            shelter_name: story.shelters?.name || '[Shelter Name]',
            title: story.title || '[Story Title]',
            content: story.content || '[Story content]',
            story_type: story.story_type || 'update',
            dog_name: story.dog_name,
            photo_url: story.photo_url,
            is_featured: story.is_featured || false,
            created_at: story.created_at || ''
          }));
          setStories(formattedStories);
        }
      } catch (error: any) {
        console.error('Error fetching stories:', error);
        toast.error('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const shelters = [...new Set(stories.map(s => s.shelter_name))];

  const filteredStories = stories.filter(story => {
    const matchesSearch = searchQuery === "" ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.shelter_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || story.story_type === typeFilter;
    const matchesShelter = shelterFilter === "all" || story.shelter_name === shelterFilter;
    return matchesSearch && matchesType && matchesShelter;
  });

  // Sort by date (newest first), featured stories at top
  const sortedStories = [...filteredStories].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const getTypeIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      success_story: <Heart className="w-4 h-4" />,
      urgent_need: <AlertCircle className="w-4 h-4" />,
      event: <Calendar className="w-4 h-4" />,
      update: <Dog className="w-4 h-4" />,
      thank_you: <Star className="w-4 h-4" />
    };
    return icons[type] || <Dog className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      success_story: "bg-green-100 text-green-700",
      urgent_need: "bg-destructive/10 text-destructive",
      event: "bg-purple-100 text-purple-700",
      update: "bg-primary/10 text-primary",
      thank_you: "bg-warning/10 text-warning"
    };
    return colors[type] || colors.update;
  };

  const formatType = (type: string) => {
    return type.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "[Date]";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-neutral-900 dark:to-neutral-800 py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <RotateIn delay={0.1}>
              <div className="inline-flex items-center justify-center p-3 bg-white/50 backdrop-blur-sm rounded-full mb-4">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 mr-2" />
                <span className="text-sm font-medium">Shelter Stories & Updates</span>
              </div>
            </RotateIn>
            <FloatIn delay={0.2}>
              <h1 className="text-4xl sm:text-5xl display-font text-primary mb-4">
                Stories That Inspire
              </h1>
            </FloatIn>
            <FadeIn direction="up" delay={0.4}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Read heartwarming success stories, urgent needs, and updates from shelters making a difference
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Shelter Info Banner */}
        <div className="bg-rose-50 border-b border-rose-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <p className="text-sm text-rose-700 flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Stories on this page are posted by shelters from the <strong>Shelter Dashboard</strong></span>
            </p>
            <Button size="sm" variant="outline" className="text-rose-700 border-rose-300" onClick={() => navigate("/login")}>
              Shelter Login
            </Button>
          </div>
        </div>

        {/* Filters */}
        <SlideInLeft delay={0.3}>
          <div className="bg-white border-b py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search stories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={shelterFilter} onValueChange={setShelterFilter}>
                  <SelectTrigger className="w-full md:w-56">
                    <SelectValue placeholder="Shelter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shelters</SelectItem>
                    {shelters.map(shelter => (
                      <SelectItem key={shelter} value={shelter}>{shelter}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Story Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="success_story">Success Stories</SelectItem>
                    <SelectItem value="urgent_need">Urgent Needs</SelectItem>
                    <SelectItem value="event">Events</SelectItem>
                    <SelectItem value="update">Updates</SelectItem>
                    <SelectItem value="thank_you">Thank You</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </SlideInLeft>

        {/* Stories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FadeIn direction="up">
            <p className="text-muted-foreground mb-6">
              Showing {sortedStories.length} stories
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedStories.map((story) => (
              <StaggerItem key={story.id}>
                <Card className={`h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden ${
                  story.is_featured ? "ring-2 ring-primary/20" : ""
                } ${story.story_type === "urgent_need" ? "border-destructive/50 border-2" : ""}`}>
                  {story.photo_url && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={story.photo_url} 
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge className="bg-gray-100 text-gray-600">
                        <Dog className="w-4 h-4" />
                        <span className="ml-1">[Story Type]</span>
                      </Badge>
                      {story.is_featured && (
                        <Badge variant="outline" className="text-xs">
                          <Star className="w-3 h-3 mr-1 fill-warning text-warning" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{story.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {story.shelter_name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(story.created_at)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground leading-relaxed">
                      {story.content}
                    </p>
                    {story.dog_name && (
                      <div className="mt-4 flex items-center text-sm text-primary">
                        <Dog className="w-4 h-4 mr-1" />
                        Featuring: {story.dog_name}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {sortedStories.length === 0 && (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No stories found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}

          {/* Get Involved CTA Section */}
          <FadeIn delay={0.3}>
            <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Inspired by These Stories?</h3>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    You can be part of the next success story! There are many ways to help shelters and dogs in need.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/adopt")}>
                    <CardContent className="p-6 text-center">
                      <Heart className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                      <h4 className="font-semibold mb-1">Adopt a Dog</h4>
                      <p className="text-sm text-muted-foreground">Give a dog their forever home</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/volunteer-board")}>
                    <CardContent className="p-6 text-center">
                      <Users className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                      <h4 className="font-semibold mb-1">Volunteer</h4>
                      <p className="text-sm text-muted-foreground">Help at a local shelter</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/supply-wishlist")}>
                    <CardContent className="p-6 text-center">
                      <Package className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                      <h4 className="font-semibold mb-1">Donate Supplies</h4>
                      <p className="text-sm text-muted-foreground">Fulfill shelter wishlists</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default ShelterStories;
