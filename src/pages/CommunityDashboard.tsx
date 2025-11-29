import { useState } from "react";
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

const CommunityDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");
  const [showShelterDialog, setShowShelterDialog] = useState(false);
  const { user, profile } = useAuth();

  // Get user name from profile (Supabase) or fallback to user email
  const userName = profile?.full_name || profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Friend';

  // Sample signed-up volunteer opportunities (in production, fetch from Supabase)
  const [myVolunteerSignups] = useState([
    // This would be populated from user's actual sign-ups stored in database
  ]);

  // Sample saved dogs (in production, fetch from Supabase)
  const [savedDogs] = useState([
    // This would be populated from user's saved dogs
  ]);

  // Calculate stats from actual data
  const userData = {
    savedDogs: savedDogs.length,
    volunteerHours: myVolunteerSignups.reduce((acc: number, v: any) => acc + (v.hours || 0), 0),
    donations: 0,
    upcomingEvents: myVolunteerSignups.filter((v: any) => v.date && new Date(v.date) > new Date()).length
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Latest Updates from Shelters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Bell className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Updates Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Check back later for updates from local shelters
                      </p>
                      <Button onClick={() => navigate("/stories")} className="bg-primary">
                        View Shelter Stories
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
                        <p className="text-3xl font-bold text-green-600">{myVolunteerSignups.filter((v: any) => v.completed).length}</p>
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
                    {myVolunteerSignups.length > 0 ? (
                      <div className="space-y-4">
                        {myVolunteerSignups.map((signup: any) => (
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
                            <Badge className={signup.completed ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                              {signup.completed ? "Completed" : "Upcoming"}
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
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>
                      RSVP to adoption events, fundraisers, and community gatherings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Events Scheduled</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Check back later for upcoming shelter events
                      </p>
                      <Button onClick={() => navigate("/")} className="bg-primary">
                        Explore Shelters
                      </Button>
                    </div>
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
