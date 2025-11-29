import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ValidateAccessCodeResponse } from "@/types/database";

interface ShelterAccessDialogProps {
  open: boolean;
  onContinueToCommunity: () => void;
  onShelterAccess: () => void;
}

const ShelterAccessDialog = ({
  open,
  onContinueToCommunity,
  onShelterAccess,
}: ShelterAccessDialogProps) => {
  const [accessCode, setAccessCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { user, refreshProfile } = useAuth();

  const handleVerifyCode = async () => {
    if (!accessCode.trim()) {
      toast.error("Please enter an access code");
      return;
    }

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setIsVerifying(true);

    try {
      console.log("Calling validate_shelter_access_code with:", accessCode.trim(), user.id);
      
      // Call the Supabase function to validate the code and update the user's role
      const { data, error } = await supabase.rpc('validate_shelter_access_code', {
        p_code: accessCode.trim(),
        p_user_id: user.id
      });

      console.log("RPC response:", data, error);

      if (error) throw error;

      const result = data as ValidateAccessCodeResponse;

      if (result.success) {
        toast.success(`Access granted to ${result.shelter_name}!`);
        setAccessCode("");
        
        // Refresh profile with timeout
        try {
          await Promise.race([
            refreshProfile(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
          ]);
        } catch (e) {
          console.log("Profile refresh timed out, continuing anyway");
        }
        
        setIsVerifying(false);
        onShelterAccess();
      } else {
        toast.error(result.message || "Invalid access code");
        setIsVerifying(false);
      }
    } catch (error: any) {
      console.error("Error validating access code:", error);
      toast.error(error.message || "Failed to validate access code");
      setIsVerifying(false);
    }
  };

  const handleContinueToCommunity = () => {
    setAccessCode("");
    setIsVerifying(false);
    onContinueToCommunity();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md [&>button]:hidden" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl display-font">
            Welcome to Connect 4 Paws
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Do you have a shelter access code?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="access-code">Shelter Access Code</Label>
            <Input
              id="access-code"
              type="text"
              placeholder="Enter your code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleVerifyCode();
                }
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleVerifyCode}
              disabled={isVerifying}
              className="w-full"
            >
              <Building2 className="w-4 h-4 mr-2" />
              {isVerifying ? "Verifying..." : "Enter Code"}
            </Button>

            <Button
              onClick={handleContinueToCommunity}
              variant="outline"
              className="w-full"
            >
              <Users className="w-4 h-4 mr-2" />
              Go to Community
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Shelter staff can enter their access code to view the shelter dashboard
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShelterAccessDialog;
