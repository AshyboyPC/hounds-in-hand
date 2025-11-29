import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Heart, Users, Building2, Handshake, GraduationCap, ListChecks, Calendar, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";

const About = () => {
  const differentiators = [
    {
      icon: Building2,
      title: "Focus on Smaller Shelters",
      description: "Most adoption platforms highlight large organizations. Smaller shelters and rescues often struggle to get the same visibility. Connect 4 Paws was created with these groups in mind, giving them an easy way to share their needs and reach the community."
    },
    {
      icon: ListChecks,
      title: "Beyond Adoption Listings",
      description: "While other sites mainly list pets available for adoption, Connect 4 Paws goes further. We help shelters share volunteer opportunities, requests for supplies and donations, and community events and adoption drives."
    },
    {
      icon: GraduationCap,
      title: "Student-Led Mission",
      description: "Unlike large national platforms, Connect 4 Paws grew out of a school club — the Help-a-Hound Club. We're a student-led initiative inspired by visiting shelters like the Atlanta Humane Society and seeing the impact strong community connections can make."
    },
    {
      icon: Handshake,
      title: "Community Connection First",
      description: "Our goal isn't just to place pets in homes — it's to build lasting relationships between shelters and the communities around them. That means making it simple for people to discover local shelters, learn their stories, and support them in meaningful ways."
    }
  ];

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-orange-50 px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="down">
              <h1 className="text-5xl display-font text-primary mb-6">About Connect 4 Paws</h1>
              <p className="text-xl body-font text-gray-700 leading-relaxed">
                A student-led platform bridging the gap between animal shelters and the community — helping dogs find homes and shelters find support.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* About Me Section */}
        <FadeIn direction="up">
          <div className="bg-white px-6 py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl display-font text-primary mb-6 text-center">About Me</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg body-font text-gray-700 leading-relaxed mb-6">
                  Hi, I'm Anand, the secretary of the Help-a-Hound Club at my school. I started Connect 4 Paws to expand the work we do in our club and to create a bridge between animal shelters and the community.
                </p>
                <p className="text-lg body-font text-gray-700 leading-relaxed mb-6">
                  After visiting the Atlanta Humane Society, I saw how valuable it is when shelters have strong ways to share their needs with the public. I wanted to create a resource that smaller shelters can use to do the same — whether it's finding adopters, recruiting volunteers, or spreading awareness about their dogs.
                </p>
                <p className="text-lg body-font text-gray-700 leading-relaxed mb-6">
                  Connect 4 Paws was built to make that connection easier. This site provides a space where shelters can express their needs and where the community can discover opportunities to help.
                </p>
                <p className="text-lg body-font text-gray-700 leading-relaxed font-medium text-primary">
                  Together, we can give more dogs the chance they deserve — a safe home, a caring family, and a hopeful future.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* How We're Different Section */}
        <div className="bg-gray-50 px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <FadeIn direction="up">
              <div className="text-center mb-12">
                <h2 className="text-4xl display-font text-primary mb-4">How We're Different</h2>
                <p className="text-lg body-font text-gray-600 max-w-2xl mx-auto">
                  There are many great websites that connect people with adoptable pets. So what makes Connect 4 Paws different?
                </p>
              </div>
            </FadeIn>

            <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {differentiators.map((item) => {
                const IconComponent = item.icon;
                return (
                  <StaggerItem key={item.title}>
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl heading-font font-semibold text-primary mb-2">
                              {item.title}
                            </h3>
                            <p className="body-font text-gray-600 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>

        {/* What Shelters Can Share Section */}
        <FadeIn direction="up">
          <div className="bg-white px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl display-font text-primary mb-8">What Shelters Can Share</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-t-4 border-t-purple-500">
                  <CardContent className="p-6 text-center">
                    <Users className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Volunteer Opportunities</h3>
                    <p className="text-sm text-gray-600">Connect with community members who want to help</p>
                  </CardContent>
                </Card>
                <Card className="border-t-4 border-t-orange-500">
                  <CardContent className="p-6 text-center">
                    <Heart className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Supplies & Donations</h3>
                    <p className="text-sm text-gray-600">Share wishlists and receive community support</p>
                  </CardContent>
                </Card>
                <Card className="border-t-4 border-t-blue-500">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Events & Adoption Drives</h3>
                    <p className="text-sm text-gray-600">Promote community events and find adopters</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Mission Statement */}
        <FadeIn direction="up">
          <div className="bg-primary text-white px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <Target className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl display-font mb-6">Our Mission</h2>
              <p className="text-xl leading-relaxed opacity-90">
                To build lasting relationships between shelters and the communities around them — making it simple for people to discover local shelters, learn their stories, and support them in meaningful ways.
              </p>
            </div>
          </div>
        </FadeIn>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default About;
