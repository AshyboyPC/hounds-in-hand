import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventRSVPProps {
  eventId: string;
  eventTitle: string;
  currentAttendees: number;
  maxAttendees?: number;
  initialRSVP?: boolean;
}

const EventRSVP = ({ eventId, eventTitle, currentAttendees, maxAttendees, initialRSVP = false }: EventRSVPProps) => {
  const [hasRSVPd, setHasRSVPd] = useState(initialRSVP);
  const [attendeeCount, setAttendeeCount] = useState(currentAttendees);
  const { toast } = useToast();

  const isFull = maxAttendees ? attendeeCount >= maxAttendees : false;

  const handleRSVP = () => {
    if (!hasRSVPd && !isFull) {
      setHasRSVPd(true);
      setAttendeeCount(attendeeCount + 1);
      toast({
        title: "RSVP Confirmed!",
        description: `You're registered for ${eventTitle}. Check your email for details.`,
      });
      // In production, send to backend
    } else if (hasRSVPd) {
      setHasRSVPd(false);
      setAttendeeCount(attendeeCount - 1);
      toast({
        title: "RSVP Cancelled",
        description: `Your registration for ${eventTitle} has been cancelled.`,
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: `Join me at ${eventTitle}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Share this event with friends!",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {attendeeCount} {maxAttendees ? `/ ${maxAttendees}` : ''} attending
        </span>
        {isFull && <span className="text-destructive font-medium">Event Full</span>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button 
          onClick={handleRSVP}
          disabled={!hasRSVPd && isFull}
          className={hasRSVPd ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"}
        >
          <Calendar className="w-4 h-4 mr-2" />
          {hasRSVPd ? "You're Going!" : isFull ? "Event Full" : "RSVP"}
        </Button>
        <Button 
          variant="outline"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {hasRSVPd && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRSVP}
          className="w-full text-destructive hover:text-destructive"
        >
          Cancel RSVP
        </Button>
      )}
    </div>
  );
};

export default EventRSVP;
