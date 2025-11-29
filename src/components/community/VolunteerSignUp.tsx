import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VolunteerSignUpProps {
  opportunityId: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  currentVolunteers: number;
  maxVolunteers?: number;
  initialSignedUp?: boolean;
}

const VolunteerSignUp = ({ 
  opportunityId, 
  title, 
  date, 
  time, 
  location,
  currentVolunteers, 
  maxVolunteers,
  initialSignedUp = false 
}: VolunteerSignUpProps) => {
  const [isSignedUp, setIsSignedUp] = useState(initialSignedUp);
  const [volunteerCount, setVolunteerCount] = useState(currentVolunteers);
  const { toast } = useToast();

  const isFull = maxVolunteers ? volunteerCount >= maxVolunteers : false;

  const handleSignUp = () => {
    if (!isSignedUp && !isFull) {
      setIsSignedUp(true);
      setVolunteerCount(volunteerCount + 1);
      toast({
        title: "Signed Up!",
        description: `You're registered for ${title}. Check your email for details.`,
      });
      // In production, send to backend
    } else if (isSignedUp) {
      setIsSignedUp(false);
      setVolunteerCount(volunteerCount - 1);
      toast({
        title: "Sign-up Cancelled",
        description: `Your registration for ${title} has been cancelled.`,
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Opportunity Details */}
      <div className="space-y-2 text-sm text-muted-foreground">
        {date && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{date} {time && `• ${time}`}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>
            {volunteerCount} {maxVolunteers ? `/ ${maxVolunteers}` : ''} volunteers
            {isFull && <span className="text-destructive ml-2">• Full</span>}
          </span>
        </div>
      </div>

      {/* Sign Up Button */}
      <Button 
        onClick={handleSignUp}
        disabled={!isSignedUp && isFull}
        className={`w-full ${isSignedUp ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"}`}
      >
        {isSignedUp ? "✓ You're Signed Up!" : isFull ? "Opportunity Full" : "Sign Up to Volunteer"}
      </Button>

      {isSignedUp && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSignUp}
          className="w-full text-destructive hover:text-destructive"
        >
          Cancel Sign-up
        </Button>
      )}
    </div>
  );
};

export default VolunteerSignUp;
