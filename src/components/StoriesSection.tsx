import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const StoriesSection = () => {
  // Generate story images using placeholders for now
  const stories = [
    {
      id: 1,
      title: "Georgeanne Streetside babies",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop"
    },
    {
      id: 2, 
      title: "Suzie's Poodle Cupcake Dreams",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Macro-enhanced playtime shoot",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop"
    }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Stories Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-foreground">Stories</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-base font-medium text-foreground">
                    {story.title}
                  </h4>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;