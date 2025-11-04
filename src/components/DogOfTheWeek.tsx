import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import dogOfWeek from "@/assets/dog-of-week.jpg";
import { FadeIn, ScaleIn } from "@/components/animations";

const DogOfTheWeek = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Dog of the Week Header */}
      <FadeIn delay={0.2}>
        <div className="text-center">
          <h3 className="text-lg sm:text-xl heading-font text-primary mb-4 sm:mb-6">
            Dog of the Week
          </h3>
        </div>
      </FadeIn>

      {/* Dog Card */}
      <ScaleIn delay={0.3}>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <img 
              src={dogOfWeek} 
              alt="Dog of the Week" 
              className="w-full h-40 sm:h-48 object-cover"
            />
            <div className="p-3 sm:p-4">
              <h4 className="text-base sm:text-lg heading-font mb-2">Bella</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 body-font">2-year-old Labrador mix</p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 body-font leading-relaxed">
                Meet Bella – a 2-year-old Labrador mix with the sweetest personality. Bella loves cuddles, long walks, and is ready to find her forever home.
              </p>
              <Button 
                size="sm" 
                className="bg-warning hover:bg-warning/90 text-black rounded-full px-4 sm:px-6 button-font w-full sm:w-auto text-sm"
              >
                Adopt Me
              </Button>
            </div>
          </CardContent>
        </Card>
      </ScaleIn>

      {/* Urgent Needs Scrolling Bar */}
      <FadeIn delay={0.4} direction="up">
        <div className="space-y-3">
          <Card className="bg-urgent-bg border-destructive/20">
            <CardContent className="p-3 sm:p-4">
              <div className="overflow-hidden">
                <div className="animate-scroll whitespace-nowrap text-urgent-text heading-font text-xs sm:text-sm">
                  Shelter A needs blankets urgently — Max requires surgery — Shelter B is asking for foster homes — Community drive for food donations this week
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
};

export default DogOfTheWeek;