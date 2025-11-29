import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Dog, Calendar, Package, Users, Heart, AlertCircle, BookOpen } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import PostDogForm from "@/components/shelter/PostDogForm";
import PostEventForm from "@/components/shelter/PostEventForm";
import PostSupplyForm from "@/components/shelter/PostSupplyForm";
import PostStoryForm from "@/components/shelter/PostStoryForm";
import PostVolunteerForm from "@/components/shelter/PostVolunteerForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ShelterDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostDogForm, setShowPostDogForm] = useState(false);
  const [showPostEventForm, setShowPostEventForm] = useState(false);
  const [showPostSupplyForm, setShowPostSupplyForm] = useState(false);
  const [showPostStoryForm, setShowPostStoryForm] = useState(false);
  const [showPostVolunteerForm, setShowPostVolunteerForm] = useState(false);
  const [shelterName, setShelterName] = useState("Your Shelter");
  const { user, profile } = useAuth();

  // Get user's name from profile
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Staff Member';

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
            <div className="mb-8">
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                🏠 Shelter Dashboard
              </div>
              <h1 className="text-4xl display-font text-primary mb-2">Welcome, {userName}!</h1>
              <p className="text-lg text-muted-foreground">{shelterName}</p>
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
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
                <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                <TabsTrigger value="dogs" className="text-sm">Manage Dogs</TabsTrigger>
                <TabsTrigger value="events" className="text-sm">Events</TabsTrigger>
                <TabsTrigger value="supplies" className="text-sm">Supplies</TabsTrigger>
                <TabsTrigger value="stories" className="text-sm">Stories</TabsTrigger>
                <TabsTrigger value="volunteers" className="text-sm">Volunteers</TabsTrigger>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-6 border-2 border-dashed border-primary/30 rounded-lg text-center hover:border-primary transition-colors cursor-pointer" onClick={() => setActiveTab("dogs")}>
                        <Dog className="w-12 h-12 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-primary mb-2">Post a Dog</h3>
                        <p className="text-sm text-muted-foreground">Add dogs available for adoption</p>
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
                  <PostSupplyForm
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
