import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Dog, Calendar, Package, Users, Heart, AlertCircle, BookOpen, ArrowLeftRight, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import PostDogForm from "@/components/shelter/PostDogForm";
import PostEventForm from "@/components/shelter/PostEventForm";
import PostSupplyNeedForm from "@/components/shelter/PostSupplyNeedForm";
import PostStoryForm from "@/components/shelter/PostStoryForm";
import PostVolunteerForm from "@/components/shelter/PostVolunteerForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ShelterDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostDogForm, setShowPostDogForm] = useState(false);
  const [showPostEventForm, setShowPostEventForm] = useState(false);
  const [showPostSupplyForm, setShowPostSupplyForm] = useState(false);
  const [showPostStoryForm, setShowPostStoryForm] = useState(false);
  const [showPostVolunteerForm, setShowPostVolunteerForm] = useState(false);
  const [shelterName, setShelterName] = useState("Your Shelter");
  const { user, profile } = useAuth();

  // State for managing content
  const [managedDogs, setManagedDogs] = useState([]);
  const [managedStories, setManagedStories] = useState([]);
  const [managedOpportunities, setManagedOpportunities] = useState([]);
  const [managedSupplies, setManagedSupplies] = useState([]);
  const [managementLoading, setManagementLoading] = useState(false);

  // Get user's name from profile
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Staff Member';

  // Fetch shelter's content for management
  const fetchShelterContent = async () => {
    if (!profile?.shelter_id) return;
    
    setManagementLoading(true);
    try {
      // Fetch dogs
      const { data: dogs } = await supabase
        .from('dogs')
        .select('*')
        .eq('shelter_id', profile.shelter_id)
        .order('created_at', { ascending: false });
      
      // Fetch stories
      const { data: stories } = await supabase
        .from('shelter_stories')
        .select('*')
        .eq('shelter_id', profile.shelter_id)
        .order('created_at', { ascending: false });
      
      // Fetch volunteer opportunities
      const { data: opportunities } = await supabase
        .from('volunteer_opportunities')
        .select('*')
        .eq('shelter_id', profile.shelter_id)
        .order('created_at', { ascending: false });
      
      // Fetch supply needs
      const { data: supplies } = await supabase
        .from('supply_needs')
        .select('*')
        .eq('shelter_id', profile.shelter_id)
        .order('created_at', { ascending: false });

      setManagedDogs(dogs || []);
      setManagedStories(stories || []);
      setManagedOpportunities(opportunities || []);
      setManagedSupplies(supplies || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setManagementLoading(false);
    }
  };

  // Delete functions
  const deleteDog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dog?')) return;
    
    try {
      const { error } = await supabase.from('dogs').delete().eq('id', id);
      if (error) throw error;
      
      toast.success('Dog deleted successfully');
      fetchShelterContent();
    } catch (error) {
      console.error('Error deleting dog:', error);
      toast.error('Failed to delete dog');
    }
  };

  const deleteStory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    
    try {
      const { error } = await supabase.from('shelter_stories').delete().eq('id', id);
      if (error) throw error;
      
      toast.success('Story deleted successfully');
      fetchShelterContent();
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story');
    }
  };

  const deleteOpportunity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this volunteer opportunity?')) return;
    
    try {
      const { error } = await supabase.from('volunteer_opportunities').delete().eq('id', id);
      if (error) throw error;
      
      toast.success('Volunteer opportunity deleted successfully');
      fetchShelterContent();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast.error('Failed to delete opportunity');
    }
  };

  const deleteSupplyNeed = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supply need?')) return;
    
    try {
      const { error } = await supabase.from('supply_needs').delete().eq('id', id);
      if (error) throw error;
      
      toast.success('Supply need deleted successfully');
      fetchShelterContent();
    } catch (error) {
      console.error('Error deleting supply need:', error);
      toast.error('Failed to delete supply need');
    }
  };

  useEffect(() => {
    // Fetch shelter name if user has a shelter_id
    const fetchShelterName = async () => {
      if (profile?.shelter_id) {
        const { data } = await supabase
          .from('shelters')
          .select('name')
          .eq('id', profile.shelter_id)
          .single();
        
        if (data) {
          setShelterName(data.name);
        }
      }
    };
    
    fetchShelterName();
  }, [profile?.shelter_id]);

  // Fetch content when manage tab is accessed
  useEffect(() => {
    if (activeTab === 'manage') {
      fetchShelterContent();
    }
  }, [activeTab, profile?.shelter_id]);

  // Empty state - no fake data
  const shelterInfo = {
    dogsCount: 0,
    volunteersCount: 0,
    adoptionsThisMonth: 0,
    urgentNeeds: 0
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeIn direction="down">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                  🏠 Shelter Dashboard
                </div>
                <h1 className="text-4xl display-font text-primary mb-2">Welcome, {userName}!</h1>
                <p className="text-lg text-muted-foreground">{shelterName}</p>
              </div>
              <Button 
                onClick={() => navigate("/dashboard/community")}
                variant="outline"
                className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeftRight className="w-4 h-4" />
                Switch to Community
              </Button>
            </div>
          </FadeIn>

          {/* Stats Overview */}
          <FadeIn direction="up" delay={0.1}>
            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StaggerItem>
                <Card className="border-t-4 border-t-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Dogs in Care</p>
                        <p className="text-3xl font-bold text-primary">{shelterInfo.dogsCount}</p>
                      </div>
                      <Dog className="w-12 h-12 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="border-t-4 border-t-warning">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Volunteers</p>
                        <p className="text-3xl font-bold text-warning">{shelterInfo.volunteersCount}</p>
                      </div>
                      <Users className="w-12 h-12 text-warning/20" />
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="border-t-4 border-t-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Adoptions This Month</p>
                        <p className="text-3xl font-bold text-green-600">{shelterInfo.adoptionsThisMonth}</p>
                      </div>
                      <Heart className="w-12 h-12 text-green-500/20" />
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="border-t-4 border-t-destructive">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Urgent Needs</p>
                        <p className="text-3xl font-bold text-destructive">{shelterInfo.urgentNeeds}</p>
                      </div>
                      <AlertCircle className="w-12 h-12 text-destructive/20" />
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerContainer>
          </FadeIn>

          {/* Main Content Tabs */}
          <FadeIn direction="up" delay={0.2}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 h-auto">
                <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                <TabsTrigger value="dogs" className="text-sm">Post Dogs</TabsTrigger>
                <TabsTrigger value="manage" className="text-sm">Manage Content</TabsTrigger>
                <TabsTrigger value="supplies" className="text-sm">Supplies</TabsTrigger>
                <TabsTrigger value="stories" className="text-sm">Stories</TabsTrigger>
                <TabsTrigger value="volunteers" className="text-sm">Volunteers</TabsTrigger>
                <TabsTrigger value="events" className="text-sm">Events</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Getting Started</CardTitle>
                    <CardDescription>
                      Start managing your shelter by posting dogs, creating events, and requesting supplies
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-6 border-2 border-dashed border-primary/30 rounded-lg text-center hover:border-primary transition-colors cursor-pointer" onClick={() => setActiveTab("dogs")}>
                        <Dog className="w-12 h-12 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-primary mb-2">Post a Dog</h3>
                        <p className="text-sm text-muted-foreground">Add dogs available for adoption</p>
                      </div>
                      <div className="p-6 border-2 border-dashed border-purple-500/30 rounded-lg text-center hover:border-purple-500 transition-colors cursor-pointer" onClick={() => setActiveTab("manage")}>
                        <Eye className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-purple-500 mb-2">Manage Content</h3>
                        <p className="text-sm text-muted-foreground">View, edit, and delete your posts</p>
                      </div>
                      <div className="p-6 border-2 border-dashed border-warning/30 rounded-lg text-center hover:border-warning transition-colors cursor-pointer" onClick={() => setActiveTab("events")}>
                        <Calendar className="w-12 h-12 text-warning mx-auto mb-3" />
                        <h3 className="font-semibold text-warning mb-2">Create Event</h3>
                        <p className="text-sm text-muted-foreground">Schedule adoption days and fundraisers</p>
                      </div>
                      <div className="p-6 border-2 border-dashed border-destructive/30 rounded-lg text-center hover:border-destructive transition-colors cursor-pointer" onClick={() => setActiveTab("supplies")}>
                        <Package className="w-12 h-12 text-destructive mx-auto mb-3" />
                        <h3 className="font-semibold text-destructive mb-2">Request Supplies</h3>
                        <p className="text-sm text-muted-foreground">Post your shelter's supply needs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Manage Dogs Tab */}
              <TabsContent value="dogs">
                {showPostDogForm ? (
                  <PostDogForm
                    onSubmit={(data) => {
                      console.log("New dog posted:", data);
                      setShowPostDogForm(false);
                      // In production, send to backend API
                    }}
                    onCancel={() => setShowPostDogForm(false)}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Manage Dogs</span>
                        <Button className="bg-primary" onClick={() => setShowPostDogForm(true)}>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Post New Dog
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Post dogs available for adoption and track their status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Dog className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Dogs Posted Yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start by posting your first dog available for adoption
                        </p>
                        <Button onClick={() => setShowPostDogForm(true)} className="bg-primary">
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Post Your First Dog
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Manage Content Tab */}
              <TabsContent value="manage" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Your Content</CardTitle>
                    <CardDescription>
                      View, edit, and delete your posted dogs, stories, volunteer opportunities, and supply needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {managementLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your content...</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Dogs Section */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Dog className="w-5 h-5" />
                            Your Dogs ({managedDogs.length})
                          </h3>
                          {managedDogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {managedDogs.map((dog: any) => (
                                <Card key={dog.id} className="relative">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold">{dog.name}</h4>
                                      <Badge className={dog.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                        {dog.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{dog.breed} • {dog.age}</p>
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{dog.description}</p>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" className="flex-1">
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => deleteDog(dog.id)} className="text-red-600 hover:text-red-700">
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No dogs posted yet.</p>
                          )}
                        </div>

                        {/* Stories Section */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Your Stories ({managedStories.length})
                          </h3>
                          {managedStories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {managedStories.map((story: any) => (
                                <Card key={story.id}>
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold line-clamp-1">{story.title}</h4>
                                      <Badge variant="outline">{story.story_type}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{story.content}</p>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" className="flex-1">
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => deleteStory(story.id)} className="text-red-600 hover:text-red-700">
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No stories posted yet.</p>
                          )}
                        </div>

                        {/* Volunteer Opportunities Section */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Your Volunteer Opportunities ({managedOpportunities.length})
                          </h3>
                          {managedOpportunities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {managedOpportunities.map((opp: any) => (
                                <Card key={opp.id}>
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold line-clamp-1">{opp.title}</h4>
                                      <Badge variant="outline">{opp.category}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">{opp.time_commitment}</p>
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{opp.description}</p>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" className="flex-1">
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => deleteOpportunity(opp.id)} className="text-red-600 hover:text-red-700">
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No volunteer opportunities posted yet.</p>
                          )}
                        </div>

                        {/* Supply Needs Section */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Your Supply Needs ({managedSupplies.length})
                          </h3>
                          {managedSupplies.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {managedSupplies.map((supply: any) => (
                                <Card key={supply.id}>
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold line-clamp-1">{supply.item_name}</h4>
                                      <Badge className={supply.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                                        {supply.priority}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">{supply.category} • Need: {supply.quantity_needed}</p>
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{supply.description}</p>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" className="flex-1">
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => deleteSupplyNeed(supply.id)} className="text-red-600 hover:text-red-700">
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No supply needs posted yet.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events">
                {showPostEventForm ? (
                  <PostEventForm
                    onSubmit={(data) => {
                      console.log("New event posted:", data);
                      setShowPostEventForm(false);
                      // In production, send to backend API
                    }}
                    onCancel={() => setShowPostEventForm(false)}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Events & Updates</span>
                        <Button className="bg-warning text-black" onClick={() => setShowPostEventForm(true)}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Create Event
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Schedule adoption events, fundraisers, and community gatherings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Events Scheduled</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create your first event to engage with the community
                        </p>
                        <Button onClick={() => setShowPostEventForm(true)} className="bg-warning text-black">
                          <Calendar className="w-4 h-4 mr-2" />
                          Create Your First Event
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Supplies Tab */}
              <TabsContent value="supplies">
                {showPostSupplyForm ? (
                  <PostSupplyNeedForm
                    onSubmit={(data) => {
                      console.log("New supply need posted:", data);
                      setShowPostSupplyForm(false);
                      // In production, send to backend API
                    }}
                    onCancel={() => setShowPostSupplyForm(false)}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Supply Wishlist</span>
                        <Button className="bg-destructive" onClick={() => setShowPostSupplyForm(true)}>
                          <Package className="w-4 h-4 mr-2" />
                          Add Supply Need
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Request supplies and track donations from the community
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Supply Needs Posted</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Post your shelter's supply needs to receive community support
                        </p>
                        <Button onClick={() => setShowPostSupplyForm(true)} className="bg-destructive">
                          <Package className="w-4 h-4 mr-2" />
                          Post Your First Supply Need
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Stories Tab */}
              <TabsContent value="stories">
                {showPostStoryForm ? (
                  <PostStoryForm
                    onSubmit={(data) => {
                      console.log("New story posted:", data);
                      setShowPostStoryForm(false);
                      // In production, send to backend API
                    }}
                    onCancel={() => setShowPostStoryForm(false)}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Stories & Updates</span>
                        <Button className="bg-rose-500 hover:bg-rose-600" onClick={() => setShowPostStoryForm(true)}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Share Story
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Share success stories, updates, and engage with donors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Stories Posted</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Share stories to keep donors engaged and celebrate successes
                        </p>
                        <Button onClick={() => setShowPostStoryForm(true)} className="bg-rose-500 hover:bg-rose-600">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Share Your First Story
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Volunteers Tab */}
              <TabsContent value="volunteers">
                {showPostVolunteerForm ? (
                  <PostVolunteerForm
                    onSubmit={(data) => {
                      console.log("New volunteer opportunity posted:", data);
                      setShowPostVolunteerForm(false);
                      // In production, send to backend API
                    }}
                    onCancel={() => setShowPostVolunteerForm(false)}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Volunteer Opportunities</span>
                        <Button className="bg-primary" onClick={() => setShowPostVolunteerForm(true)}>
                          <Users className="w-4 h-4 mr-2" />
                          Post Opportunity
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Manage volunteer opportunities and track volunteer hours
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Volunteer Opportunities</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Post volunteer opportunities to get help from the community
                        </p>
                        <Button className="bg-primary" onClick={() => setShowPostVolunteerForm(true)}>
                          <Users className="w-4 h-4 mr-2" />
                          Post Your First Opportunity
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShelterDashboard;
