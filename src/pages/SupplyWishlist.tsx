import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, Search, ExternalLink, Building2, AlertCircle, Heart, DollarSign, Info, Loader2 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn, SlideInRight, FloatIn } from "@/components/animations";
import PageTransition from "@/components/PageTransition";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SupplyNeed {
  id: string;
  shelter_id: string;
  shelter_name: string;
  item_name: string;
  category: string;
  quantity_needed: number;
  quantity_received: number;
  priority: string;
  description?: string;
  amazon_link?: string;
  chewy_link?: string;
  other_link?: string;
}

const SupplyWishlist = () => {
  const navigate = useNavigate();
  const [supplyNeeds, setSupplyNeeds] = useState<SupplyNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [shelterFilter, setShelterFilter] = useState("all");

  useEffect(() => {
    const fetchSupplyNeeds = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('supply_needs')
          .select(`
            *,
            shelters (
              name
            )
          `)
          .order('priority', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match component interface
        const transformedData = data?.map(need => ({
          id: need.id,
          shelter_id: need.shelter_id,
          shelter_name: need.shelters?.name || 'Unknown Shelter',
          item_name: need.item_name,
          category: need.category,
          quantity_needed: need.quantity_needed,
          quantity_received: need.quantity_received || 0,
          priority: need.priority,
          description: need.description,
          amazon_link: need.amazon_link,
          chewy_link: need.chewy_link,
          other_link: need.other_link
        })) || [];

        setSupplyNeeds(transformedData);
      } catch (error) {
        console.error('Error fetching supply needs:', error);
        toast.error('Failed to load supply needs');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplyNeeds();
  }, []);

  const shelters = [...new Set(supplyNeeds.map(s => s.shelter_name))];

  const filteredNeeds = supplyNeeds.filter(need => {
    const matchesSearch = searchQuery === "" ||
      need.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      need.shelter_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || need.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || need.priority === priorityFilter;
    const matchesShelter = shelterFilter === "all" || need.shelter_name === shelterFilter;
    return matchesSearch && matchesCategory && matchesPriority && matchesShelter;
  });

  // Sort by priority (urgent first)
  const sortedNeeds = [...filteredNeeds].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - 
           priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: "bg-destructive text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-warning text-black",
      low: "bg-green-500 text-white"
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryIcon = (category: string) => {
    return <Package className="w-4 h-4" />;
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getProgressColor = (received: number, needed: number) => {
    const percent = (received / needed) * 100;
    if (percent >= 75) return "bg-green-500";
    if (percent >= 50) return "bg-warning";
    if (percent >= 25) return "bg-orange-500";
    return "bg-destructive";
  };

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-neutral-900 dark:to-neutral-800 py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScaleIn delay={0.1}>
              <div className="inline-flex items-center justify-center p-3 bg-white/50 backdrop-blur-sm rounded-full mb-4">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 mr-2" />
                <span className="text-sm font-medium">Shelter Supply Wishlists</span>
              </div>
            </ScaleIn>
            <FloatIn delay={0.2}>
              <h1 className="text-4xl sm:text-5xl display-font text-primary mb-4">
                Help Shelters Get What They Need
              </h1>
            </FloatIn>
            <FadeIn direction="up" delay={0.4}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse supply wishlists from local shelters and donate items directly through Amazon, Chewy, or other retailers
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Shelter Info Banner */}
        <div className="bg-orange-50 border-b border-orange-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <p className="text-sm text-orange-700 flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Supply needs on this page are posted by shelters from the <strong>Shelter Dashboard</strong></span>
            </p>
            <Button size="sm" variant="outline" className="text-orange-700 border-orange-300" onClick={() => navigate("/login")}>
              Shelter Login
            </Button>
          </div>
        </div>

        {/* Urgent Needs Banner */}
        {sortedNeeds.some(n => n.priority === "urgent") && (
          <SlideInRight delay={0.3}>
            <div className="bg-destructive/10 border-y border-destructive/20 py-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center gap-2 text-destructive">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    {sortedNeeds.filter(n => n.priority === "urgent").length} urgent needs require immediate attention
                  </span>
                </div>
              </div>
            </div>
          </SlideInRight>
        )}

        {/* Filters */}
        <div className="bg-white border-b py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="bedding">Bedding</SelectItem>
                  <SelectItem value="toys">Toys</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Supply Needs Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading supply needs...</p>
            </div>
          ) : (
            <>
              <FadeIn direction="up">
                <p className="text-muted-foreground mb-6">
                  Showing {sortedNeeds.length} items needed
                </p>
              </FadeIn>

              <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNeeds.map((need) => {
              const progressPercent = (need.quantity_received / need.quantity_needed) * 100;

              return (
                <StaggerItem key={need.id}>
                  <Card className={`h-full flex flex-col hover:shadow-lg transition-shadow ${
                    need.priority === "urgent" ? "border-destructive/50 border-2" : ""
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{need.item_name}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Building2 className="w-4 h-4 mr-1" />
                            {need.shelter_name}
                          </div>
                        </div>
                        <Badge className={getPriorityColor(need.priority)}>
                          {need.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      {need.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {need.description}
                        </p>
                      )}

                      <div className="space-y-3 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(need.category)}
                          <span className="ml-1">{formatCategory(need.category)}</span>
                        </Badge>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">
                              {need.quantity_received} / {need.quantity_needed}
                            </span>
                          </div>
                          <Progress 
                            value={progressPercent} 
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground">
                            {need.quantity_needed - need.quantity_received} more needed
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">
                          Donate via:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {need.amazon_link && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => window.open(need.amazon_link, "_blank")}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Amazon
                            </Button>
                          )}
                          {need.chewy_link && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => window.open(need.chewy_link, "_blank")}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Chewy
                            </Button>
                          )}
                          {need.other_link && !need.amazon_link && !need.chewy_link && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => window.open(need.other_link, "_blank")}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Donate
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {sortedNeeds.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No supply needs found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}

          {/* Prefer to Donate Money Section */}
          <FadeIn delay={0.3}>
            <Card className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-8 text-center">
                <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Prefer to Donate Money?</h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Your monetary donations help shelters purchase exactly what they need most. Every dollar makes a difference!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate("/donate")} className="bg-green-600 hover:bg-green-700">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Donate to a Shelter
                  </Button>
                  <Button onClick={() => navigate("/adopt")} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    <Heart className="w-4 h-4 mr-2" />
                    Sponsor a Dog
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
            </>
          )}
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default SupplyWishlist;
