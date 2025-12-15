import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Package, Bell, Users, Building2, Clock, BookOpen, ArrowLeftRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { useNavigate } from "react-router-dom";
import ShelterAccessDialog from "@/components/ShelterAccessDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VolunteerSignup {
  id: string;
  title: string;
  shelter_name: string;
  date: string | null;
  time_commitment: string;
  status: string;
  hours_logged: number;
  opportunity: {
    title: string;
    time_commitment: string;
    date: string | null;
    shelter: {
      name: string;
    };
  };
}

const CommunityDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");
  const [showShelterDialog, setShowShelterDialog] = useState(false);
  const { user, profile } = useAuth();
  const [myVolunteerSignups, setMyVolunteerSignups] = useState<VolunteerSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Get user name from profile (Supabase) or fallback to user email
  const userName = profile?.full_name || profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Friend';

  // Sample saved dogs (in production, fetch from Supabase)
  const [savedDogs] = useState([
    // This would be populated from user's saved dogs
  ]);

  // State for community feed content
  const [communityContent, setCommunityContent] = useState({
    recentDogs: [],
    recentStories: [],
    recentEvents: [],
    recentOpportunities: [],
    recentSupplies: []
  });
  const [feedLoading, setFeedLoading] = useState(false);

  useEffect(() => {
    const fetchVolunteerSignups = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('volunteer_signups')
          .select(`
            id,
            status,
            hours_logged,
            volunteer_opportunities (
              id,
              title,
              time_commitment,
              date,
              shelters (
                name
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedSignups = data?.map(signup => {
          const opportunity = Array.isArray(signup.volunteer_opportunities) 
            ? signup.volunteer_opportunities[0] 
            : signup.volunteer_opportunities;
          const shelter = Array.isArray(opportunity?.shelters) 
            ? opportunity.shelters[0] 
            : opportunity?.shelters;
          
          return {
            id: signup.id,
            title: opportunity?.title || 'Unknown Opportunity',
            shelter_name: shelter?.name || 'Unknown Shelter',
            date: opportunity?.date || null,
            time_commitment: opportunity?.time_commitment || 'Flexible',
            status: signup.status,
            hours_logged: signup.hours_logged || 0,
            opportunity: {
              title: opportunity?.title || '',
              time_commitment: opportunity?.time_commitment || '',
              date: opportunity?.date || null,
              shelter: {
                name: shelter?.name || ''
              }
            }
          };
        }) || [];

        setMyVolunteerSignups(transformedSignups);
      } catch (error) {
        console.error('Error fetching volunteer signups:', error);
        toast.error('Failed to load volunteer activities');
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerSignups();
  }, [user]);

  // Fetch events for the Events tab
  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          shelters (
            name
          )
        `)
        .eq('status', 'active')
        .gte('date', new Date().toISOString().split('T')[0]) // Only future events
        .order('date', { ascending: true })
        .limit(10);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setEventsLoading(false);
    }
  };

  // Fetch events when Events tab is accessed
  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents();
    }
  }, [activeTab]);

  // Fetch community content for the feed
  const fetchCommunityContent = async () => {
    setFeedLoading(true);
    try {
      // Fetch recent dogs
      const { data: dogs } = await supabase
        .from('dogs')
        .select('*, shelters(name)')
        .in('status', ['available', 'foster'])
        .order('created_at', { ascending: false })
        .limit(6);

      // Fetch recent stories
      const { data: stories } = await supabase
        .from('shelter_stories')
        .select('*, shelters(name)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4);

      // Fetch recent events (both upcoming and recent past events)
      const { data: events } = await supabase
        .from('events')
        .select('*, shelters(name)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(4);

      // Fetch recent volunteer opportunities
      const { data: opportunities } = await supabase
        .from('volunteer_opportunities')
        .select('*, shelters(name)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(4);

      // Fetch recent supply needs
      const { data: supplies } = await supabase
        .from('supply_needs')
        .select('*, shelters(name)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(4);

      // Debug logging
      console.log('Community content fetched:', {
        dogs: dogs?.length || 0,
        stories: stories?.length || 0,
        events: events?.length || 0,
        opportunities: opportunities?.length || 0,
        supplies: supplies?.length || 0
      });

      setCommunityContent({
        recentDogs: dogs || [],
        recentStories: stories || [],
        recentEvents: events || [],
        recentOpportunities: opportunities || [],
        recentSupplies: supplies || []
      });
    } catch (error) {
      console.error('Error fetching community content:', error);
      toast.error('Failed to load community content');
    } finally {
      setFeedLoading(false);
    }
  };

  // Fetch community content when feed tab is accessed or component mounts
  useEffect(() => {
    if (activeTab === 'feed') {
      fetchCommunityContent();
    }
  }, [activeTab]);

  // Also fetch content when component first mounts if on feed tab
  useEffect(() => {
    if (activeTab === 'feed') {
      fetchCommunityContent();
    }
  }, []);

  // Auto-refresh community content every 30 seconds when on feed tab
  useEffect(() => {
    if (activeTab === 'feed') {
      const interval = setInterval(() => {
        fetchCommunityContent();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Calculate stats from actual data
  const userData = {
    savedDogs: savedDogs.length,
    volunteerHours: myVolunteerSignups.reduce((acc, v) => acc + v.hours_logged, 0),
    donations: 0,
    upcomingEvents: myVolunteerSignups.filter(v => v.date && new Date(v.date) > new Date()).length
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ShelterAccessDialog
        open={showShelterDialog}
        onContinueToCommunity={() => {
          setShowShelterDialog(false);
        }}
        onShelterAccess={() => {
          setShowShelterDialog(false);
          navigate('/dashboard/shelter');
        }}
      />
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeIn direction="down">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  👤 Community Dashboard
                </div>
                <h1 className="text-4xl display-font text-primary mb-2">Welcome, {userName}!</h1>
                <p className="text-lg text-muted-foreground">
                  Start your journey by exploring dogs, volunteering, or attending events
                </p>
              </div>
              {(profile?.role === 'shelter' || profile?.role === 'admin') ? (
                <Button 
                  onClick={() => navigate("/dashboard/shelter")}
                  variant="outline"
                  className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Switch to Shelter Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowShelterDialog(true)}
                  variant="outline"
                  className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Building2 className="w-4 h-4" />
                  Shelter Access
                </Button>
              )}
            </div>
          </FadeIn>

          {/* Stats Overview */}
          <FadeIn direction="up" delay={0.1}>
            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StaggerItem>
                <Card className="border-t-4 border-t-primary cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("saved")}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Saved Dogs</p>
                        <p className="text-3xl font-bold text-primary">{userData.savedDogs}</p>
                      </div>
                      <Heart className="w-10 h-10 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="border-t-4 border-t-warning cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("volunteer")}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Volunteer Hours</p>
                        <p className="text-3xl font-bold text-warning">{userData.volunteerHours}</p>
                      </div>
                      <Users className="w-10 h-10 text-warning/20" />
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="border-t-4 border-t-green-500 cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Donations</p>
                        <p className="text-3xl font-bold text-green-600">{userData.donations}</p>
                      </div>
                      <Package className="w-10 h-10 text-green-500/20" />
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="border-t-4 border-t-destructive cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("events")}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Upcoming Events</p>
                        <p className="text-3xl font-bold text-destructive">{userData.upcomingEvents}</p>
                      </div>
                      <Calendar className="w-10 h-10 text-destructive/20" />
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerContainer>
          </FadeIn>

          {/* Main Content Tabs */}
          <FadeIn direction="up" delay={0.2}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                <TabsTrigger value="feed" className="text-sm">Community Feed</TabsTrigger>
                <TabsTrigger value="saved" className="text-sm">Saved Dogs</TabsTrigger>
                <TabsTrigger value="volunteer" className="text-sm">My Volunteering</TabsTrigger>
                <TabsTrigger value="events" className="text-sm">Events</TabsTrigger>
              </TabsList>

              {/* Community Feed Tab */}
              <TabsContent value="feed" className="space-y-6">
                {/* Refresh Button */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Community Feed</h2>
                  <Button 
                    onClick={fetchCommunityContent}
                    variant="outline"
                    size="sm"
                    disabled={feedLoading}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeftRight className={`w-4 h-4 ${feedLoading ? 'animate-spin' : ''}`} />
                    {feedLoading ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary" onClick={() => navigate("/adopt")}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Heart className="w-8 h-8 text-primary" />
                      <div>
                        <h4 className="font-semibold">Find a Dog</h4>
                        <p className="text-xs text-muted-foreground">Browse adoptable dogs</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-purple-500" onClick={() => navigate("/volunteer-board")}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Users className="w-8 h-8 text-purple-500" />
                      <div>
                        <h4 className="font-semibold">Volunteer</h4>
                        <p className="text-xs text-muted-foreground">Find opportunities</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-orange-500" onClick={() => navigate("/supply-wishlist")}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Package className="w-8 h-8 text-orange-500" />
                      <div>
                        <h4 className="font-semibold">Donate Supplies</h4>
                        <p className="text-xs text-muted-foreground">View shelter wishlists</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-rose-500" onClick={() => navigate("/stories")}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <BookOpen className="w-8 h-8 text-rose-500" />
                      <div>
                        <h4 className="font-semibold">Read Stories</h4>
                        <p className="text-xs text-muted-foreground">Success stories & updates</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {feedLoading ? (
                  <Card>
                    <CardContent className="p-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading community updates...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-8">
                    {/* Recent Dogs */}
                    {communityContent.recentDogs.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Heart className="w-5 h-5" />
                              Recently Posted Dogs
                            </span>
                            <Button size="sm" variant="outline" onClick={() => navigate("/adopt")}>
                              View All
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {communityContent.recentDogs.slice(0, 3).map((dog: any) => (
                              <Card key={dog.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/adopt")}>
                                <CardContent className="p-4">
                                  <h4 className="font-semibold">{dog.name}</h4>
                                  <p className="text-sm text-muted-foreground">{dog.breed} • {dog.age}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {Array.isArray(dog.shelters) ? dog.shelters[0]?.name : dog.shelters?.name}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Recent Stories */}
                    {communityContent.recentStories.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <BookOpen className="w-5 h-5" />
                              Latest Shelter Stories
                            </span>
                            <Button size="sm" variant="outline" onClick={() => navigate("/stories")}>
                              View All
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {communityContent.recentStories.slice(0, 2).map((story: any) => (
                              <Card key={story.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/stories")}>
                                <CardContent className="p-4">
                                  <h4 className="font-semibold line-clamp-2">{story.title}</h4>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{story.content}</p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {Array.isArray(story.shelters) ? story.shelters[0]?.name : story.shelters?.name}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Upcoming Events */}
                    {communityContent.recentEvents.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-5 h-5" />
                              Upcoming Events
                            </span>
                            <Button size="sm" variant="outline" onClick={() => navigate("/events")}>
                              View All
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {communityContent.recentEvents.slice(0, 2).map((event: any) => (
                              <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/events")}>
                                <CardContent className="p-4">
                                  <h4 className="font-semibold line-clamp-2">{event.title}</h4>
                                  <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {Array.isArray(event.shelters) ? event.shelters[0]?.name : event.shelters?.name}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Recent Volunteer Opportunities */}
                    {communityContent.recentOpportunities.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Users className="w-5 h-5" />
                              New Volunteer Opportunities
                            </span>
                            <Button size="sm" variant="outline" onClick={() => navigate("/volunteer-board")}>
                              View All
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {communityContent.recentOpportunities.slice(0, 2).map((opp: any) => (
                              <Card key={opp.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/volunteer-board")}>
                                <CardContent className="p-4">
                                  <h4 className="font-semibold line-clamp-2">{opp.title}</h4>
                                  <p className="text-sm text-muted-foreground">{opp.time_commitment}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {Array.isArray(opp.shelters) ? opp.shelters[0]?.name : opp.shelters?.name}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Recent Supply Needs */}
                    {communityContent.recentSupplies.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Package className="w-5 h-5" />
                              Recent Supply Needs
                            </span>
                            <Button size="sm" variant="outline" onClick={() => navigate("/supply-wishlist")}>
                              View All
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {communityContent.recentSupplies.slice(0, 3).map((supply: any) => (
                              <Card key={supply.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/supply-wishlist")}>
                                <CardContent className="p-4">
                                  <h4 className="font-semibold line-clamp-2">{supply.item_name}</h4>
                                  <p className="text-sm text-muted-foreground">{supply.category} • Priority: {supply.priority}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {Array.isArray(supply.shelters) ? supply.shelters[0]?.name : supply.shelters?.name}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Empty State */}
                    {!communityContent.recentDogs.length && 
                     !communityContent.recentStories.length && 
                     !communityContent.recentEvents.length && 
                     !communityContent.recentOpportunities.length && 
                     !communityContent.recentSupplies.length && (
                      <Card>
                        <CardContent className="p-8">
                          <div className="text-center">
                            <Bell className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Updates Yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Check back later for updates from local shelters
                            </p>
                            <Button onClick={() => navigate("/stories")} className="bg-primary">
                              Explore Shelter Content
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Saved Dogs Tab */}
              <TabsContent value="saved">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Your Saved Dogs
                      </span>
                      <Button size="sm" className="bg-primary" onClick={() => navigate("/adopt")}>
                        Browse More Dogs
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Save dogs you're interested in to keep track of them. Click the heart icon on any dog's profile to save them here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedDogs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedDogs.map((dog: any) => (
                          <Card key={dog.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/dog/${dog.id}`)}>
                            <div className="h-40 bg-gray-200">
                              <img src={dog.imageUrl || "/api/placeholder/400/300"} alt={dog.name} className="w-full h-full object-cover" />
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-primary">{dog.name}</h4>
                              <p className="text-sm text-muted-foreground">{dog.breed} • {dog.age}</p>
                              <p className="text-xs text-muted-foreground mt-1">{dog.shelter_name}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Saved Dogs Yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Browse adoptable dogs and click the heart icon to save your favorites
                        </p>
                        <Button onClick={() => navigate("/adopt")} className="bg-primary">
                          Find Dogs to Adopt
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Volunteer Tab */}
              <TabsContent value="volunteer" className="space-y-6">
                {/* Hours Summary Card */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <p className="text-3xl font-bold text-purple-600">{userData.volunteerHours}</p>
                        <p className="text-sm text-muted-foreground">Total Hours</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <p className="text-3xl font-bold text-blue-600">0</p>
                        <p className="text-sm text-muted-foreground">This Month</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <p className="text-3xl font-bold text-green-600">{myVolunteerSignups.filter(v => v.status === 'completed').length}</p>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <p className="text-3xl font-bold text-orange-600">{userData.upcomingEvents}</p>
                        <p className="text-sm text-muted-foreground">Upcoming</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <Button size="sm" variant="outline" className="text-purple-600 border-purple-300">
                        📄 Download Hours Report
                      </Button>
                      <Button size="sm" variant="outline" className="text-purple-600 border-purple-300">
                        🏆 Get Certificate
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        My Volunteer Activities
                      </span>
                      <Button size="sm" className="bg-primary" onClick={() => navigate("/volunteer-board")}>
                        Find Opportunities
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Track your volunteer hours and upcoming commitments. Perfect for students needing service hours!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-12">
                        <p className="text-sm text-muted-foreground">Loading your volunteer activities...</p>
                      </div>
                    ) : myVolunteerSignups.length > 0 ? (
                      <div className="space-y-4">
                        {myVolunteerSignups.map((signup) => (
                          <div key={signup.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex-1">
                              <h4 className="font-semibold">{signup.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {signup.shelter_name}
                                </span>
                                {signup.date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(signup.date).toLocaleDateString()}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {signup.time_commitment}
                                </span>
                              </div>
                            </div>
                            <Badge className={signup.status === 'completed' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                              {signup.status === 'completed' ? "Completed" : signup.status === 'confirmed' ? "Confirmed" : "Signed Up"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Volunteer Activities Yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Sign up for volunteer opportunities to help local shelters and track your hours
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button onClick={() => navigate("/volunteer-board")} className="bg-primary">
                            Browse Opportunities
                          </Button>
                          <Button onClick={() => navigate("/partnerships")} variant="outline">
                            Student Program Info
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Upcoming Events ({events.length})
                    </CardTitle>
                    <CardDescription>
                      RSVP to adoption events, fundraisers, and community gatherings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {eventsLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading events...</p>
                      </div>
                    ) : events.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {events.map((event: any) => (
                          <Card key={event.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold line-clamp-2">{event.title}</h4>
                                <Badge variant="outline" className="ml-2 shrink-0">
                                  {event.event_type?.replace('_', ' ')}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  {event.date && new Date(event.date).toLocaleDateString()}
                                  {event.start_time && ` • ${event.start_time}`}
                                </div>
                                
                                {event.shelters?.name && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building2 className="w-4 h-4" />
                                    {event.shelters.name}
                                  </div>
                                )}
                                
                                {event.location && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-xs text-muted-foreground mb-3" title={event.description}>
                                {event.description && event.description.length > 100 
                                  ? `${event.description.substring(0, 100)}...` 
                                  : event.description}
                              </p>
                              
                              <div className="flex gap-2">
                                <Button size="sm" className="flex-1 bg-primary">
                                  <Heart className="w-3 h-3 mr-1" />
                                  RSVP
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => navigate("/events")}>
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Events Scheduled</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Check back later for upcoming shelter events
                        </p>
                        <Button onClick={() => navigate("/events")} className="bg-primary">
                          Explore All Events
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityDashboard;
