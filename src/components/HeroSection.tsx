import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-dog.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 lg:mt-8">
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
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white max-w-4xl">
          <div className="mb-4 sm:mb-6">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-destructive mx-auto mb-2 sm:mb-4" fill="currentColor" />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl display-font mb-4 sm:mb-6 leading-tight">
            Connecting Shelters with Loving Communities
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 body-font max-w-2xl mx-auto">
            Every dog deserves a chance. Whether you adopt, volunteer, or donate, you can change a life today.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-2xl mx-auto">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg rounded-full button-font"
            >
              <Link to="/adopt">Find a Dog</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-warning hover:bg-warning/90 text-black px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg rounded-full button-font"
            >
              <Link to="/volunteer">Volunteer</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg rounded-full button-font"
            >
              <Link to="/donate">Donate</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;