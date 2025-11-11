import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, HandshakeIcon, Heart, TrendingUp } from "lucide-react";

const Partnerships = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Make a Difference",
      description: "Help save lives and support animal welfare in your community."
    },
    {
      icon: TrendingUp,
      title: "Brand Visibility",
      description: "Gain exposure through our website, events, and social media channels."
    },
    {
      icon: HandshakeIcon,
      title: "Community Impact",
      description: "Show your commitment to social responsibility and community values."
    },
    {
      icon: Building2,
      title: "Networking",
      description: "Connect with other businesses and organizations that share your values."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-br from-blue-50 to-orange-50 px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="down">
              <h1 className="text-5xl display-font text-primary mb-6">Partner With Us</h1>
              <p className="text-xl body-font text-gray-700">
                Join us in making a difference in the lives of dogs in need.
              </p>
            </FadeIn>
          </div>
        </div>

        <FadeIn direction="up">
          <div className="bg-white px-6 py-16">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl display-font text-primary mb-6">Why Partner With Connect 4 Paws?</h2>
              <p className="text-lg body-font text-gray-700 leading-relaxed">
                By partnering with Connect 4 Paws, your organization joins a network dedicated to animal welfare 
                and community support. Together, we can create lasting change.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="bg-gray-50 px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {benefits.map((benefit) => {
                const IconComponent = benefit.icon;
                return (
                  <StaggerItem key={benefit.title}>
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl heading-font font-semibold text-primary mb-3">
                          {benefit.title}
                        </h3>
                        <p className="body-font text-gray-600">
                          {benefit.description}
                        </p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <FadeIn delay={0.3} direction="up">
              <div className="text-center">
                <h3 className="text-2xl display-font text-primary mb-6">Ready to Get Started?</h3>
                <p className="text-lg body-font text-gray-700 mb-8 max-w-2xl mx-auto">
                  Contact us today to learn more about partnership opportunities and how we can work together.
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-3 rounded-full">
                  Contact Us About Partnerships
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Partnerships;
