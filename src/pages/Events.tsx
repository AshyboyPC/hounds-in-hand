import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useNavigate } from "react-router-dom";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  address?: string;
  max_attendees?: number;
  current_attendees: number;
  registration_required: boolean;
  registration_link?: string;
  contact_email?: string;
  contact_phone?: string;
  shelter_name: string;
}

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            id,
            title,
            description,
            event_type,
            date,
            start_time,
            end_time,
            location,
            address,
            max_attendees,
            current_attendees,
            registration_required,
            registration_link,
            contact_email,
            contact_phone,
            shelters (
              name
            )
          `)
          .eq('status', 'active')
          .gte('date', new Date().toISOString().split('T')[0]) // Only future events
          .order('date', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (data) {
          const formattedEvents: Event[] = data.map((event: any) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            event_type: event.event_type,
            date: event.date,
            start_time: event.start_time,
            end_time: event.end_time,
            location: event.location,
            address: event.address,
            max_attendees: event.max_attendees,
            current_attendees: event.current_attendees || 0,
            registration_required: event.registration_required,
            registration_link: event.registration_link,
            contact_email: event.contact_email,
            contact_phone: event.contact_phone,
            shelter_name: (Array.isArray(event.shelters) ? event.shelters[0]?.name : event.shelters?.name) || 'Unknown Shelter'
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    typeFilter === "all" || event.event_type === typeFilter
  );

  const formatEventType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-neutral-900 dark:to-neutral-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center justify-center p-3 bg-white/50 backdrop-blur-sm rounded-full mb-4">
                <Calendar className="w-6 h-6 text-blue-500 mr-2" />
                <span className="text-sm font-medium">Upcoming Events</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 className="text-4xl sm:text-5xl display-font text-primary mb-4">
                Community Events
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join us at adoption events, fundraisers, and community gatherings hosted by local shelters
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Shelter Info Banner */}
        <div className="bg-blue-50 border-b border-blue-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Events on this page are posted by shelters from the <strong>Shelter Dashboard</strong></span>
            </p>
            <Button size="sm" variant="outline" className="text-blue-700 border-blue-300" onClick={() => navigate("/login")}>
              Shelter Login
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <h3 className="text-lg font-semibold">Filter Events:</h3>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="adoption_event">Adoption Events</SelectItem>
                  <SelectItem value="fundraiser">Fundraisers</SelectItem>
                  <SelectItem value="volunteer_day">Volunteer Days</SelectItem>
                  <SelectItem value="community_event">Community Events</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : (
            <>
              <FadeIn>
                <p className="text-muted-foreground mb-6">
                  Showing {filteredEvents.length} upcoming events
                </p>
              </FadeIn>

              {filteredEvents.length > 0 ? (
                <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <StaggerItem key={event.id}>
                      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                            <Badge variant="outline" className="shrink-0">
                              {formatEventType(event.event_type)}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            {(event.start_time || event.end_time) && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {event.start_time && formatTime(event.start_time)}
                                  {event.start_time && event.end_time && ' - '}
                                  {event.end_time && formatTime(event.end_time)}
                                </span>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span className="line-clamp-1">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {event.description}
                          </p>

                          <div className="mt-auto space-y-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Hosted by: <strong>{event.shelter_name}</strong></span>
                              {event.max_attendees && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{event.current_attendees}/{event.max_attendees}</span>
                                </div>
                              )}
                            </div>

                            {event.registration_required && event.registration_link ? (
                              <Button 
                                className="w-full" 
                                onClick={() => window.open(event.registration_link, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Register Now
                              </Button>
                            ) : (
                              <div className="space-y-2">
                                {event.contact_email && (
                                  <Button 
                                    variant="outline" 
                                    className="w-full text-xs"
                                    onClick={() => window.open(`mailto:${event.contact_email}`, '_blank')}
                                  >
                                    Email: {event.contact_email}
                                  </Button>
                                )}
                                {event.contact_phone && (
                                  <Button 
                                    variant="outline" 
                                    className="w-full text-xs"
                                    onClick={() => window.open(`tel:${event.contact_phone}`, '_blank')}
                                  >
                                    Call: {event.contact_phone}
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No events found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {typeFilter === "all" 
                      ? "Check back later for upcoming events from local shelters"
                      : "Try selecting a different event type or check back later"
                    }
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

export default Events;