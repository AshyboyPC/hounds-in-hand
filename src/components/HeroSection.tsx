import { Heart, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative h-auto min-h-[400px] sm:min-h-[500px] rounded-3xl overflow-hidden mx-2 sm:mx-4 lg:mx-6 mt-4 sm:mt-6 lg:mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-neutral-900 dark:to-neutral-800 border border-white/20 shadow-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <PawPrint className="absolute -top-10 -right-10 w-64 h-64 rotate-12" />
        <PawPrint className="absolute bottom-10 left-10 w-40 h-40 -rotate-12" />
        <Heart className="absolute top-1/4 left-1/4 w-24 h-24 text-primary/20" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <div className="inline-flex items-center justify-center p-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-full mb-4 ring-1 ring-black/5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 mr-2" />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Spreading Love, One Paw at a Time</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
            Connecting Shelters with <br className="hidden sm:block" />
            <span className="text-primary">Loving Communities</span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Helping under-resourced shelters get the volunteers, adoptions, supplies, and donations they need — by connecting them directly to you.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 button-font"
            >
              <Link to="/adopt">Find a Dog</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 button-font"
            >
              <Link to="/volunteer">Volunteer</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 button-font"
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