import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DogOfTheWeek from "@/components/DogOfTheWeek";
import StoriesSection from "@/components/StoriesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-12">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex-1">
            <HeroSection />
            <StoriesSection />
          </div>
          
          {/* Sidebar */}
          <aside className="lg:w-80 px-4 sm:px-6 lg:px-0 lg:pr-8 pt-8">
            <DogOfTheWeek />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;