import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CircularImageGallery } from "@/components/ui/circular-image-gallery";
import { Animated, AnimatedList } from "@/components/ui/animated";

const StoriesSection = () => {
  const stories = [
    {
      id: 1,
      title: "Bella's New Beginning",
      content: "After 3 months in foster care, Bella found her forever home with the Martinez family. Her journey from a shy, timid pup to a confident companion has been incredible to witness.",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop"
    },
    {
      id: 2, 
      title: "Max's Road to Recovery",
      content: "Thanks to generous community donations, Max received the life-saving surgery he needed. He's now recovering well and enjoying his new lease on life with his foster family.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Community Support in Action",
      content: "Campbell High School students organized a food drive that collected over 200 pounds of dog food for local shelters. Their efforts will help feed dozens of dogs in need.",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Senior Dog Finds Love",
      content: "At 10 years young, Buddy was adopted by a wonderful family who fell in love with his gentle nature. He's now enjoying his golden years in comfort and love.",
      image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Puppy Training Program Success",
      content: "Our new puppy training program has helped over 50 puppies learn basic commands and socialization skills, making them more adoptable and well-adjusted family members.",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Volunteer of the Month",
      content: "Sarah Johnson has been named Volunteer of the Month for her tireless dedication to walking and socializing our shelter dogs, helping them stay happy and healthy.",
      image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&h=600&fit=crop"
    }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Animated type="text" className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Shelter Stories & Updates
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover heartwarming success stories and the latest news from our shelter community.
          </p>
        </Animated>
        
        <Animated type="fade" delay={0.2}>
          <div className="mb-12">
            <CircularImageGallery stories={stories} />
          </div>
        </Animated>
        
        <Animated type="fade" delay={0.4} className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Click on the dots below to browse through our stories. Each story represents a life changed through compassion and care.
          </p>
        </Animated>
      </div>
    </section>
  );
};

export default StoriesSection;