import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Heart, Users, Award, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description: "Every dog deserves love, care, and a second chance at happiness."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "We bring together volunteers, shelters, and families to create lasting bonds."
    },
    {
      icon: Award,
      title: "Excellence in Care",
      description: "We maintain the highest standards in animal welfare and adoption practices."
    },
    {
      icon: Target,
      title: "Mission Focused",
      description: "Our goal is simple: find loving homes for every dog in need."
    }
  ];

  const team = [
    {
      name: "Dr. Emily Rodriguez",
      role: "Founder & Director",
      bio: "Veterinarian with 15+ years of experience in animal rescue and rehabilitation."
    },
    {
      name: "Mike Chen",
      role: "Operations Manager",
      bio: "Former shelter coordinator passionate about improving adoption processes."
    },
    {
      name: "Sarah Johnson",
      role: "Volunteer Coordinator",
      bio: "Community organizer dedicated to building strong volunteer networks."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-orange-50 px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="down">
              <h1 className="text-5xl display-font text-primary mb-6">About Connect 4 Paws</h1>
              <p className="text-xl body-font text-gray-700 leading-relaxed">
                We're a network of dedicated shelters, volunteers, and advocates working together 
                to rescue, rehabilitate, and rehome dogs across Pennsylvania.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Mission Section */}
        <FadeIn direction="up">
          <div className="bg-white px-6 py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl display-font text-primary mb-6 text-center">Our Mission</h2>
              <p className="text-lg body-font text-gray-700 leading-relaxed mb-6">
                Connect 4 Paws was founded in 2015 with a simple but powerful mission: to ensure that 
                every dog in need finds a loving, permanent home. We connect shelters across Campbell, 
                Harrisburg, and York, creating a unified network that maximizes resources and increases 
                adoption success rates.
              </p>
              <p className="text-lg body-font text-gray-700 leading-relaxed">
                Through our platform, we've helped thousands of dogs find their forever families while 
                supporting the incredible work of local shelters and volunteers who dedicate their time 
                and hearts to animal welfare.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Values Section */}
        <div className="bg-gray-50 px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <FadeIn direction="up">
              <h2 className="text-4xl display-font text-primary mb-12 text-center">Our Values</h2>
            </FadeIn>
            
            <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => {
                const IconComponent = value.icon;
                return (
                  <StaggerItem key={value.title}>
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl heading-font font-semibold text-primary mb-3">
                          {value.title}
                        </h3>
                        <p className="body-font text-gray-600">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up">
              <h2 className="text-4xl display-font text-primary mb-12 text-center">Meet Our Team</h2>
            </FadeIn>
            
            <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <StaggerItem key={member.name}>
                  <Card className="hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <h3 className="text-xl heading-font font-semibold text-primary mb-2">
                        {member.name}
                      </h3>
                      <p className="text-sm text-warning font-semibold mb-3">
                        {member.role}
                      </p>
                      <p className="body-font text-gray-600 text-sm">
                        {member.bio}
                      </p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>

        {/* Impact Section */}
        <FadeIn direction="up">
          <div className="bg-primary text-white px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl display-font mb-8">Our Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-5xl font-bold mb-2">5,000+</div>
                  <div className="text-lg opacity-90">Dogs Adopted</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">500+</div>
                  <div className="text-lg opacity-90">Active Volunteers</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">15</div>
                  <div className="text-lg opacity-90">Partner Shelters</div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </main>

      <Footer />
    </div>
  );
};

export default About;
