import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DogOfTheWeek from "@/components/DogOfTheWeek";
import StoriesSection from "@/components/StoriesSection";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SlideInLeft, SlideInRight, FadeIn } from "@/components/animations/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, Map, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: Users,
      title: "Volunteer",
      description: "Find opportunities to help",
      href: "/volunteer",
      color: "text-purple-500",
      bg: "bg-purple-50 hover:bg-purple-100"
    },
    {
      icon: Package,
      title: "Supply Wishlist",
      description: "Donate items shelters need",
      href: "/supply-wishlist",
      color: "text-orange-500",
      bg: "bg-orange-50 hover:bg-orange-100"
    },
    {
      icon: Map,
      title: "Shelter Map",
      description: "Find shelters near you",
      href: "/map",
      color: "text-emerald-500",
      bg: "bg-emerald-50 hover:bg-emerald-100"
    },
    {
      icon: Heart,
      title: "Success Stories",
      description: "Read heartwarming updates",
      href: "/stories",
      color: "text-rose-500",
      bg: "bg-rose-50 hover:bg-rose-100"
    }
  ];

  return (
    <PageTransition className="min-h-screen bg-background">
      <Header />

      <main className="pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Hero Section - Full Width */}
          <HeroSection />

          {/* Quick Links Section */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <Card 
                  key={link.title}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-none ${link.bg}`}
                  onClick={() => navigate(link.href)}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <link.icon className={`w-8 h-8 mx-auto mb-2 ${link.color}`} />
                    <h3 className="font-semibold text-sm sm:text-base text-neutral-900">{link.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">{link.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>

          {/* Bottom Grid - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            <SlideInLeft delay={0.2}>
              <StoriesSection />
            </SlideInLeft>
            <SlideInRight delay={0.2}>
              <DogOfTheWeek />
            </SlideInRight>
          </div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Index;