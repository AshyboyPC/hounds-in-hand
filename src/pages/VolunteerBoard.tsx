import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin, Calendar, Search, Heart, Building2, Info } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn, SlideInLeft, SlideInRight, FloatIn } from "@/components/animations";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

interface VolunteerOpportunity {
  id: string;
  shelter_id: string;
  shelter_name: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  time_commitment: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  max_volunteers?: number;
  current_volunteers: number;
  is_recurring: boolean;
}

const VolunteerBoard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const isShelter = profile?.role === 'shelter' || profile?.role === 'admin';
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [signedUpIds, setSignedUpIds] = useState<string[]>([]);

  // Fetch opportunities from database
  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('volunteer_opportunities')
          .select(`
            *,
            shelters (
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          console.log('Raw volunteer opportunities data:', data); // Debug log
          const formattedOpps: VolunteerOpportunity[] = data.map((opp: any) => ({
            id: opp.id,
            shelter_id: opp.shelter_id,
            shelter_name: opp.shelters?.name || '[Shelter Name]',
            title: opp.title || '[Opportunity Title]',
            description: opp.description || '[Description]',
            category: opp.category || 'other',
            difficulty: opp.difficulty || 'beginner',
            time_commitment: opp.time_commitment || '[Time]',
            date: opp.date,
            start_time: opp.start_time,
            end_time: opp.end_time,
            location: opp.location,
            max_volunteers: opp.max_volunteers,
            current_volunteers: opp.current_volunteers || 0,
            is_recurring: opp.is_recurring || false
          }));
          console.log('Formatted opportunities:', formattedOpps); // Debug log
          setOpportunities(formattedOpps);
        }
      } catch (error: any) {
        console.error('Error fetching opportunities:', error);
        sonnerToast.error('Failed to load volunteer opportunities');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Fetch user's signups if logged in
  useEffect(() => {
    const fetchMySignups = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('volunteer_signups')
          .select('opportunity_id')
          .eq('user_id', user.id);

        if (error) throw error;
        if (data) {
          setSignedUpIds(data.map(signup => signup.opportunity_id));
        }
      } catch (error: any) {
        console.error('Error fetching signups:', error);
      }
    };

    fetchMySignups();
  }, [user]);

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = searchQuery === "" ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.shelter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || opp.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || opp.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Debug logging
  console.log('All opportunities:', opportunities.length);
  console.log('Filtered opportunities:', filteredOpportunities.length);
  console.log('Search query:', searchQuery);
  console.log('Category filter:', categoryFilter);
  console.log('Difficulty filter:', difficultyFilter);

  const handleSignUp = async (opportunityId: string, title: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to sign up for volunteer opportunities.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    try {
      if (signedUpIds.includes(opportunityId)) {
        // Cancel signup - delete from database
        const { error } = await supabase
          .from('volunteer_signups')
          .delete()
          .eq('user_id', user.id)
          .eq('opportunity_id', opportunityId);

        if (error) throw error;

        setSignedUpIds(signedUpIds.filter(id => id !== opportunityId));
        setOpportunities(opportunities.map(opp => 
          opp.id === opportunityId 
            ? { ...opp, current_volunteers: Math.max(0, opp.current_volunteers - 1) }
            : opp
        ));
        toast({
          title: "Sign-up Cancelled",
          description: `Your registration for "${title}" has been cancelled.`
        });
      } else {
        // Sign up - insert into database
        const { error } = await supabase
          .from('volunteer_signups')
          .insert([{
            user_id: user.id,
            opportunity_id: opportunityId,
            status: 'confirmed'
          }]);

        if (error) throw error;

        // Update current_volunteers count in database
        const currentOpp = opportunities.find(o => o.id === opportunityId);
        if (currentOpp) {
          const { error: updateError } = await supabase
            .from('volunteer_opportunities')
            .update({ 
              current_volunteers: currentOpp.current_volunteers + 1
            })
            .eq('id', opportunityId);

          if (updateError) console.error('Error updating volunteer count:', updateError);
        }

        setSignedUpIds([...signedUpIds, opportunityId]);
        setOpportunities(opportunities.map(opp => 
          opp.id === opportunityId 
            ? { ...opp, current_volunteers: opp.current_volunteers + 1 }
            : opp
        ));
        toast({
          title: "Signed Up!",
          description: `You're registered for "${title}". View in your dashboard.`,
          action: (
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/community")}>
              View Dashboard
            </Button>
          )
        });
      }
    } catch (error: any) {
      console.error('Error with signup:', error);
      sonnerToast.error(error.message || 'Failed to process signup');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      animal_care: "bg-primary/10 text-primary",
      medical: "bg-destructive/10 text-destructive",
      training: "bg-warning/10 text-warning",
      administration: "bg-gray-100 text-gray-700",
      events: "bg-purple-100 text-purple-700",
      transport: "bg-blue-100 text-blue-700",
      other: "bg-gray-100 text-gray-700"
    };
    return colors[category] || colors.other;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-700",
      intermediate: "bg-warning/10 text-warning",
      advanced: "bg-destructive/10 text-destructive"
    };
    return colors[difficulty] || colors.beginner;
  };

  const formatCategory = (category: string) => {
    return category.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-neutral-900 dark:to-neutral-800 py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScaleIn delay={0.1}>
              <div className="inline-flex items-center justify-center p-3 bg-white/50 backdrop-blur-sm rounded-full mb-4">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 mr-2" />
                <span className="text-sm font-medium">Volunteer Opportunities Board</span>
              </div>
            </ScaleIn>
            <FloatIn delay={0.2}>
              <h1 className="text-4xl sm:text-5xl display-font text-primary mb-4">
                Find Your Way to Help
              </h1>
            </FloatIn>
            <FadeIn direction="up" delay={0.4}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse volunteer opportunities from shelters in your area and sign up to make a difference
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Shelter Info Banner */}
        {isShelter ? (
          <div className="bg-purple-50 border-b border-purple-200 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <p className="text-sm text-purple-700 flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Opportunities on this page are posted by shelters from the <strong>Shelter Dashboard</strong></span>
              </p>
              <Button size="sm" variant="outline" className="text-purple-700 border-purple-300" onClick={() => navigate("/dashboard/shelter")}>
                Post Opportunity
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-purple-50 border-b border-purple-200 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <p className="text-sm text-purple-700 flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Are you a shelter? Post volunteer opportunities from the Shelter Dashboard</span>
              </p>
              <Button size="sm" variant="outline" className="text-purple-700 border-purple-300" onClick={() => navigate("/login")}>
                Shelter Login
              </Button>
            </div>
          </div>
        )}

        {/* User Status Banner */}
        {user && signedUpIds.length > 0 && (
          <FadeIn>
            <div className="bg-green-50 border-b border-green-200 py-3">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <p className="text-sm text-green-700">
                  <span className="font-semibold">✓ You're signed up for {signedUpIds.length} opportunity{signedUpIds.length > 1 ? 'ies' : ''}</span>
                </p>
                <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-100" onClick={() => navigate("/dashboard/community")}>
                  View in Dashboard
                </Button>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Filters */}
        <SlideInLeft delay={0.3}>
          <div className="bg-white border-b py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search opportunities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="animal_care">Animal Care</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="administration">Administration</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </SlideInLeft>

        {/* Opportunities Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading volunteer opportunities...</p>
            </div>
          ) : (
            <>
              <FadeIn direction="up">
                <p className="text-muted-foreground mb-6">
                  Showing {filteredOpportunities.length} opportunities
                </p>
              </FadeIn>

              <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp) => {
              const isFull = opp.max_volunteers ? opp.current_volunteers >= opp.max_volunteers : false;
              const isSignedUp = signedUpIds.includes(opp.id);

              return (
                <StaggerItem key={opp.id}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{opp.title}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Building2 className="w-4 h-4 mr-1" />
                            {opp.shelter_name}
                          </div>
                        </div>
                        {opp.is_recurring && (
                          <Badge variant="outline" className="text-xs">Recurring</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-4 flex-1">
                        {opp.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-gray-100 text-gray-600">
                            [Category]
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-600">
                            [Difficulty]
                          </Badge>
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          {opp.time_commitment}
                        </div>

                        {opp.date && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(opp.date).toLocaleDateString()}
                            {opp.start_time && ` • ${opp.start_time}`}
                          </div>
                        )}

                        {opp.location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            {opp.location}
                          </div>
                        )}

                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-2" />
                          {opp.current_volunteers}
                          {opp.max_volunteers && ` / ${opp.max_volunteers}`} volunteers
                          {isFull && <span className="text-destructive ml-2">• Full</span>}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleSignUp(opp.id, opp.title)}
                        disabled={!isSignedUp && isFull}
                        className={`w-full ${isSignedUp ? "bg-green-600 hover:bg-green-700" : ""}`}
                      >
                        {isSignedUp ? "✓ Signed Up" : isFull ? "Full" : "Sign Up"}
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

              {filteredOpportunities.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No opportunities found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default VolunteerBoard;
