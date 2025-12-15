import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Dog, Calendar, Package, Users, Heart, AlertCircle, BookOpen, ArrowLeftRight, Edit, Trash2 } from "lucide-react";
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
  // MANAGEMENT TAB REMOVED - ONLY 6 TABS NOW
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostDogForm, setShowPostDogForm] = useState(false);
  const [showPostEventForm, setShowPostEventForm] = useState(false);
  const [showPostSupplyForm, setShowPostSupplyForm] = useState(false);
  const [showPostStoryForm, setShowPostStoryForm] = useState(false);
  const [showPostVolunteerForm, setShowPostVolunteerForm] = useState(false);
  
  // Edit state
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [shelterName, setShelterName] = useState("Your Shelter");
  const { user, profile } = useAuth();

  // State for managing content within each section
  const [dogs, setDogs] = useState([]);
  const [stories, setStories] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [events, setEvents] = useState([]);
  const [sectionLoading, setSectionLoading] = useState({
    dogs: false,
    stories: false,
    opportunities: false,
    supplies: false,
    events: false
  });

  // Get user's name from profile
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Staff Member';

  // Fetch functions for each section
  const fetchDogs = async () => {
    if (!profile?.shelter_id) return;
    setSectionLoading(prev => ({ ...prev, dogs: true }));
    try {
      const { data } = await supabase
        .from('dogs')
        .select('*')
        .eq('shelter_id', profile.shelter_id)
        .order('created_at', { ascending: false });
      setDogs(data || []);
    } catch (error) {
      console.error('Error fetching dogs:', error);
      toast.error('Failed to load dogs');
    } finally {
      setSectionLoading(prev => ({ ...prev, dogs: false }));
    }
  };

  const fetchStories = async () => {
    if (!profile?.shelter_id) return;
    setSectionLoading(prev => ({ ...prev, stories: true }));
    try {
      const { data } = await supabase
        .from('shelter_stories')
        .select('*')
        .eq('shelter_id', profile.shelter_id)
        .order('created_at', { ascending: false });
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setSectionLoading(prev => ({ ...prev, stories: false }));
    }
  };

  const fetchOpportunities = async () => {
    if (!profile?.shelter_id) return;
    setSectionLoading(prev => ({ ...prev, opportunities: true }));
    try {
      const { data } = await supabase
        .from('volunteer_opportunities')
        .select('*')
        .eq('shelter_id', profile.shelter_id)
        .order('created_at', { ascending: false });
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to load opportunities');
    } finally {
      setSectionLoading(prev => ({ ...prev, opportunities: false }));
    }
  };

  const fetchSupplies = async () => {
    if (!profile?.shelter_id) return;
    setSectionLoading(prev => ({ ...prev, supplies: true }));
    try {
      const { data } = await supabase
        .from('supply_needs')
        .select('*')
        .eq('shelter_id', profile.shelter_id)
        .order('created_at', { ascending: false });
      setSupplies(data || []);
    } catch (error) {
      console.error('Error fetching supplies:', error);
      toast.error('Failed to load supplies');
    } finally {
      setSectionLoading(prev => ({ ...prev, supplies: false }));
    }
  };

  const fetchEvents = async () => {
    if (!profile?.shelter_id) return;
    setSectionLoading(prev => ({ ...prev, events: true }));
    try {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('shelter_id', profile.shelter_id)
        .order('created_at', { ascending: false });
      setEvents(data || []);
      console.log('Fetched events:', data); // Debug: Check if full data is retrieved
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setSectionLoading(prev => ({ ...prev, events: false }));
    }
  };

  // Delete functions
  // Delete functions
  const deleteDog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dog?')) return;
    try {
      const { error } = await supabase.from('dogs').delete().eq('id', id);
      if (error) throw error;
      toast.success('Dog deleted successfully');
      fetchDogs();
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
      fetchStories();
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
      fetchOpportunities();
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
      fetchSupplies();
    } catch (error) {
      console.error('Error deleting supply need:', error);
      toast.error('Failed to delete supply need');
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  // Edit functions
  const startEditing = (item: any, type: string) => {
    setEditingItem(item);
    setEditingType(type);
    
    // Show the appropriate form
    switch (type) {
      case 'dog':
        setShowPostDogForm(true);
        break;
      case 'event':
        setShowPostEventForm(true);
        break;
      case 'story':
        setShowPostStoryForm(true);
        break;
      case 'volunteer':
        setShowPostVolunteerForm(true);
        break;
      case 'supply':
        setShowPostSupplyForm(true);
        break;
    }
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditingType(null);
    setShowPostDogForm(false);
    setShowPostEventForm(false);
    setShowPostStoryForm(false);
    setShowPostVolunteerForm(false);
    setShowPostSupplyForm(false);
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingItem || !editingType) return;

    try {
      let table = '';
      let refreshFunction = null;

      switch (editingType) {
        case 'dog':
          table = 'dogs';
          refreshFunction = fetchDogs;
          break;
        case 'event':
          table = 'events';
          refreshFunction = fetchEvents;
          break;
        case 'story':
          table = 'shelter_stories';
          refreshFunction = fetchStories;
          break;
        case 'volunteer':
          table = 'volunteer_opportunities';
          refreshFunction = fetchOpportunities;
          break;
        case 'supply':
          table = 'supply_needs';
          refreshFunction = fetchSupplies;
          break;
      }

      const { error } = await supabase
        .from(table)
        .update(data)
        .eq('id', editingItem.id);

      if (error) throw error;

      toast.success(`${editingType.charAt(0).toUpperCase() + editingType.slice(1)} updated successfully!`);
      cancelEditing();
      if (refreshFunction) refreshFunction();
    } catch (error) {
      console.error(`Error updating ${editingType}:`, error);
      toast.error(`Failed to update ${editingType}`);
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

  // Fetch content when each tab is accessed
  useEffect(() => {
    if (!profile?.shelter_id) return;
    
    switch (activeTab) {
      case 'dogs':
        fetchDogs();
        break;
      case 'stories':
        fetchStories();
        break;
      case 'volunteers':
        fetchOpportunities();
        break;
      case 'supplies':
        fetchSupplies();
        break;
      case 'events':
        fetchEvents();
        break;
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
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
                <TabsTrigger value="overview" className="text-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="dogs" className="text-sm">
                  Dogs
                </TabsTrigger>
                <TabsTrigger value="events" className="text-sm">
                  Events
                </TabsTrigger>
                <TabsTrigger value="supplies" className="text-sm">
                  Supplies
                </TabsTrigger>
                <TabsTrigger value="stories" className="text-sm">
                  Stories
                </TabsTrigger>
                <TabsTrigger value="volunteers" className="text-sm">
                  Volunteers
                </TabsTrigger>
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
                        <h3 className="font-semibold text-primary mb-2">Manage Dogs</h3>
                        <p className="text-sm text-muted-foreground">Add, edit, and manage dogs</p>
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

              {/* Dogs Tab */}
              <TabsContent value="dogs" className="space-y-6">
                {showPostDogForm ? (
                  <PostDogForm
                    editingItem={editingType === 'dog' ? editingItem : null}
                    onSubmit={(data) => {
                      if (editingType === 'dog' && editingItem) {
                        handleEditSubmit(data);
                      } else {
                        console.log("New dog posted:", data);
                        cancelEditing();
                        fetchDogs(); // Refresh the list
                      }
                    }}
                    onCancel={cancelEditing}
                  />
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Your Dogs ({dogs.length})</span>
                          <Button className="bg-primary" onClick={() => setShowPostDogForm(true)}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Post New Dog
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          Manage all your posted dogs - add new ones, edit existing, or remove adopted dogs
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {sectionLoading.dogs ? (
                          <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading your dogs...</p>
                          </div>
                        ) : dogs.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dogs.map((dog: any) => (
                              <Card key={dog.id} className="relative">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold">{dog.name}</h4>
                                    <Badge className={dog.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                      {dog.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{dog.breed} • {dog.age}</p>
                                  <p className="text-xs text-muted-foreground mb-3" title={dog.description}>
                                    {dog.description && dog.description.length > 120 
                                      ? `${dog.description.substring(0, 120)}...` 
                                      : dog.description}
                                  </p>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="flex-1" onClick={() => startEditing(dog, 'dog')}>
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
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>



              {/* Events Tab */}
              <TabsContent value="events">
                {showPostEventForm ? (
                  <PostEventForm
                    editingItem={editingType === 'event' ? editingItem : null}
                    onSubmit={(data) => {
                      if (editingType === 'event' && editingItem) {
                        handleEditSubmit(data);
                      } else {
                        console.log("New event posted:", data);
                        setShowPostEventForm(false);
                        fetchEvents(); // Refresh the list
                      }
                    }}
                    onCancel={cancelEditing}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Your Events ({events.length})</span>
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
                      {sectionLoading.events ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warning mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Loading your events...</p>
                        </div>
                      ) : events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {events.map((event: any) => (
                            <Card key={event.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold line-clamp-2">{event.title}</h4>
                                  <Badge variant="outline">{event.event_type}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {event.date && new Date(event.date).toLocaleDateString()}
                                  {event.start_time && ` • ${event.start_time}`}
                                </p>
                                <p className="text-xs text-muted-foreground mb-3" title={event.description}>
                                  {event.description && event.description.length > 150 
                                    ? `${event.description.substring(0, 150)}...` 
                                    : event.description}
                                </p>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="flex-1" onClick={() => startEditing(event, 'event')}>
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => deleteEvent(event.id)} className="text-red-600 hover:text-red-700">
                                    <Trash2 className="w-3 h-3" />
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
                            Create your first event to engage with the community
                          </p>
                          <Button onClick={() => setShowPostEventForm(true)} className="bg-warning text-black">
                            <Calendar className="w-4 h-4 mr-2" />
                            Create Your First Event
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Supplies Tab */}
              <TabsContent value="supplies">
                {showPostSupplyForm ? (
                  <PostSupplyNeedForm
                    editingItem={editingType === 'supply' ? editingItem : null}
                    onSubmit={(data) => {
                      if (editingType === 'supply' && editingItem) {
                        handleEditSubmit(data);
                      } else {
                        console.log("New supply need posted:", data);
                        setShowPostSupplyForm(false);
                        fetchSupplies(); // Refresh the list
                      }
                    }}
                    onCancel={cancelEditing}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Your Supply Needs ({supplies.length})</span>
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
                      {sectionLoading.supplies ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-destructive mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Loading your supply needs...</p>
                        </div>
                      ) : supplies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {supplies.map((supply: any) => (
                            <Card key={supply.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold line-clamp-2">{supply.item_name}</h4>
                                  <Badge className={supply.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                                    {supply.priority}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{supply.category} • Need: {supply.quantity_needed}</p>
                                <p className="text-xs text-muted-foreground mb-3" title={supply.description}>
                                  {supply.description && supply.description.length > 120 
                                    ? `${supply.description.substring(0, 120)}...` 
                                    : supply.description}
                                </p>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="flex-1" onClick={() => startEditing(supply, 'supply')}>
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
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Stories Tab */}
              <TabsContent value="stories">
                {showPostStoryForm ? (
                  <PostStoryForm
                    editingItem={editingType === 'story' ? editingItem : null}
                    onSubmit={(data) => {
                      if (editingType === 'story' && editingItem) {
                        handleEditSubmit(data);
                      } else {
                        console.log("New story posted:", data);
                        setShowPostStoryForm(false);
                        fetchStories(); // Refresh the list
                      }
                    }}
                    onCancel={cancelEditing}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Your Stories ({stories.length})</span>
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
                      {sectionLoading.stories ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Loading your stories...</p>
                        </div>
                      ) : stories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {stories.map((story: any) => (
                            <Card key={story.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold line-clamp-2">{story.title}</h4>
                                  <Badge variant="outline">{story.story_type}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3" title={story.content}>
                                  {story.content && story.content.length > 120 
                                    ? `${story.content.substring(0, 120)}...` 
                                    : story.content}
                                </p>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="flex-1" onClick={() => startEditing(story, 'story')}>
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
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Volunteers Tab */}
              <TabsContent value="volunteers">
                {showPostVolunteerForm ? (
                  <PostVolunteerForm
                    editingItem={editingType === 'volunteer' ? editingItem : null}
                    onSubmit={(data) => {
                      if (editingType === 'volunteer' && editingItem) {
                        handleEditSubmit(data);
                      } else {
                        console.log("New volunteer opportunity posted:", data);
                        setShowPostVolunteerForm(false);
                        fetchOpportunities(); // Refresh the list
                      }
                    }}
                    onCancel={cancelEditing}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Your Volunteer Opportunities ({opportunities.length})</span>
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
                      {sectionLoading.opportunities ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Loading your volunteer opportunities...</p>
                        </div>
                      ) : opportunities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {opportunities.map((opp: any) => (
                            <Card key={opp.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold line-clamp-2">{opp.title}</h4>
                                  <Badge variant="outline">{opp.category}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{opp.time_commitment}</p>
                                <p className="text-xs text-muted-foreground mb-3" title={opp.description}>
                                  {opp.description && opp.description.length > 120 
                                    ? `${opp.description.substring(0, 120)}...` 
                                    : opp.description}
                                </p>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="flex-1" onClick={() => startEditing(opp, 'volunteer')}>
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
                      )}
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