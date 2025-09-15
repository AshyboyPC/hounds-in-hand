import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dog.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-96 rounded-2xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Person holding a happy dog" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-8">
        <div className="text-center text-white max-w-2xl">
          <div className="mb-6">
            <Heart className="w-8 h-8 text-destructive mx-auto mb-4" fill="currentColor" />
          </div>
          
          <h1 className="text-5xl font-bold mb-2">
            Find Your Perfect
          </h1>
          <h2 className="text-5xl font-bold mb-6">
            Companion
          </h2>
          
          <p className="text-xl mb-2 opacity-90">
            Supporting local shelters and connecting dogs
          </p>
          <p className="text-xl mb-8 opacity-90">
            with loving homes
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg rounded-full"
            >
              Find a Shelter
            </Button>
            <Button 
              size="lg"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-3 text-lg rounded-full"
            >
              Adopt a Dog
            </Button>
            <Button 
              size="lg"
              className="bg-warning hover:bg-warning/90 text-warning-foreground px-8 py-3 text-lg rounded-full"
            >
              Volunteer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;