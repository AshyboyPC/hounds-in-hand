import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, HandshakeIcon, Heart, TrendingUp, GraduationCap, Clock, Award, Users } from "lucide-react";
import PageTransition from "@/components/PageTransition";

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

  const studentBenefits = [
    {
      icon: Clock,
      title: "Track Volunteer Hours",
      description: "Log and verify your volunteer hours for school requirements, college applications, and scholarships."
    },
    {
      icon: Award,
      title: "Earn Certificates",
      description: "Receive official volunteer certificates and recognition for your service."
    },
    {
      icon: GraduationCap,
      title: "College Applications",
      description: "Stand out with documented community service and leadership experience."
    },
    {
      icon: Users,
      title: "Club Activities",
      description: "Organize group volunteer events and build teamwork skills with your club."
    }
  ];

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
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

        {/* Student & School Club Section */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <FadeIn direction="up">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl display-font text-primary mb-4">Student & School Club Program</h2>
                <p className="text-lg body-font text-gray-700 max-w-2xl mx-auto">
                  Perfect for high school clubs, NHS chapters, and student organizations looking to make a difference while earning volunteer hours.
                </p>
              </div>
            </FadeIn>

            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {studentBenefits.map((benefit) => {
                const IconComponent = benefit.icon;
                return (
                  <StaggerItem key={benefit.title}>
                    <Card className="h-full hover:shadow-xl transition-shadow border-t-4 border-t-purple-500">
                      <CardContent className="p-6 text-center">
                        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-7 h-7 text-purple-600" />
                        </div>
                        <h3 className="text-lg heading-font font-semibold text-gray-900 mb-2">
                          {benefit.title}
                        </h3>
                        <p className="body-font text-gray-600 text-sm">
                          {benefit.description}
                        </p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <FadeIn delay={0.2}>
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl heading-font font-semibold text-primary mb-4">
                        How It Works for Students
                      </h3>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-3">
                          <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                          <span>Sign up and create your volunteer profile</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                          <span>Browse and sign up for volunteer opportunities</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                          <span>Complete your volunteer shift and get hours verified</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">4</span>
                          <span>Download your hours report or certificate anytime</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 rounded-2xl p-6 mb-4">
                        <p className="text-4xl font-bold text-purple-600 mb-2">500+</p>
                        <p className="text-gray-600">Student Volunteers</p>
                      </div>
                      <div className="bg-purple-100 rounded-2xl p-6">
                        <p className="text-4xl font-bold text-purple-600 mb-2">10,000+</p>
                        <p className="text-gray-600">Hours Logged</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="text-center mt-12">
                <h3 className="text-xl heading-font font-semibold text-gray-900 mb-4">
                  Register Your School Club Today
                </h3>
                <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                  Get your club set up with group volunteer tracking, event coordination, and official hour verification.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full">
                    Register Your Club
                  </Button>
                  <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full">
                    Student Sign Up
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Partnerships;
