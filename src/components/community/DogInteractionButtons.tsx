import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DogInteractionButtonsProps {
  dogId: string;
  dogName: string;
  shelterId: string;
  initialSaved?: boolean;
}

const DogInteractionButtons = ({ dogId, dogName, shelterId, initialSaved = false }: DogInteractionButtonsProps) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In production, save to backend
    const savedDogs = JSON.parse(localStorage.getItem('savedDogs') || '[]');
    if (!isSaved) {
      savedDogs.push(dogId);
      toast({
        title: "Dog Saved!",
        description: `${dogName} has been added to your saved dogs.`,
      });
    } else {
      const index = savedDogs.indexOf(dogId);
      if (index > -1) savedDogs.splice(index, 1);
      toast({
        title: "Dog Removed",
        description: `${dogName} has been removed from your saved dogs.`,
      });
    }
    localStorage.setItem('savedDogs', JSON.stringify(savedDogs));
  };

  const handleInterested = () => {
    toast({
      title: "Interest Registered!",
      description: "The shelter has been notified of your interest. They'll contact you soon!",
    });
    // In production, send to backend
  };

  const handleMessage = () => {
    setShowMessageDialog(true);
    // In production, open messaging interface
    toast({
      title: "Message Shelter",
      description: "Opening message dialog...",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Meet ${dogName}!`,
          text: `Check out ${dogName} who is looking for a forever home!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Share this link with friends and family.",
      });
    }
  };

  const handleScheduleVisit = () => {
    toast({
      title: "Schedule a Visit",
      description: "Redirecting to shelter contact page...",
    });
    // In production, open scheduling interface
  };

  return (
    <div className="space-y-3">
      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={handleInterested}
          className="bg-primary hover:bg-primary/90 text-white font-semibold"
        >
          I'm Interested
        </Button>
        <Button 
          onClick={handleScheduleVisit}
          className="bg-warning hover:bg-warning/90 text-black font-semibold"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Visit
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSave}
          className={isSaved ? "border-destructive text-destructive" : ""}
        >
          <Heart className={`w-4 h-4 mr-1 ${isSaved ? "fill-destructive" : ""}`} />
          {isSaved ? "Saved" : "Save"}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleMessage}
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Message
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default DogInteractionButtons;
