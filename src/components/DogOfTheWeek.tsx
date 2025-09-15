import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import dogOfWeek from "@/assets/dog-of-week.jpg";

const DogOfTheWeek = () => {
  return (
    <div className="space-y-6">
      {/* Dog of the Week Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-6">
          Dog of the Week
        </h3>
      </div>

      {/* Dog Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <img 
            src={dogOfWeek} 
            alt="Dog of the Week" 
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h4 className="text-lg font-semibold mb-2">Dog of the Week</h4>
            <p className="text-sm text-muted-foreground mb-2">Piper | Dog | on Age</p>
            <p className="text-sm text-muted-foreground mb-4">
              Suspendisse et tincidunt ligula interdum, varius, 
              nam elit lorem blandit dolor varius, 
              consectetur, and even more things consectetur and more things.
            </p>
            <Button 
              size="sm" 
              className="bg-warning hover:bg-warning/90 text-warning-foreground rounded-full px-6"
            >
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Alerts */}
      <div className="space-y-3">
        <Card className="bg-urgent-bg border-destructive/20">
          <CardContent className="p-4">
            <h4 className="text-urgent-text font-semibold mb-1">
              Urgent: Blankets needed at Riverside Shelter
            </h4>
          </CardContent>
        </Card>

        <Card className="bg-urgent-bg border-destructive/20">
          <CardContent className="p-4">
            <h4 className="text-urgent-text font-semibold mb-2">
              Urgent: Blankets & Groceries
            </h4>
            <p className="text-sm text-muted-foreground">
              Suspendisse Chia, Siberian natoque tacitus, better 
              three atta tempus congue natoque, -gen 
              axial serving consectetur consectetur er 
              string, dolor magna ipsum, est, nat et semeis, coquest 
              counting iracesed lorem agonista.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DogOfTheWeek;