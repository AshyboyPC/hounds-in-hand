import { Heart, Star, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Animated } from "@/components/ui/animated";
import { useNavigate } from "react-router-dom";

interface Story {
  id: number;
  title: string;
  content: string;
  type: "success" | "urgent" | "update";
  shelter: string;
}

const StoriesSection = () => {
  const navigate = useNavigate();
  
  // Sample stories - in production, fetch from Supabase
  const stories: Story[] = [
    {
      id: 1,
      title: "Bella's New Beginning",
      content: "From shy pup to confident companion. After 6 months, she found her forever home!",
      type: "success",
      shelter: "Hope for Hounds"
    },
    {
      id: 2,
      title: "Senior Dogs Need Fosters",
      content: "5 senior dogs urgently need foster homes. Can you help?",
      type: "urgent",
      shelter: "Harrisburg Rescue"
    }
  ];

  const getStoryStyle = (type: string) => {
    switch (type) {
      case "success":
        return { icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" };
      case "urgent":
        return { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" };
      default:
        return { icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" };
    }
  };

  return (
    <section className="h-full">
      <Card className="h-full border-none shadow-sm bg-neutral-50/50 dark:bg-neutral-900/50 p-6 sm:p-8 rounded-3xl">
        <Animated type="text" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl heading-font text-neutral-900 dark:text-white mb-2">
                Shelter Stories
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 body-font text-sm">
                Heartwarming updates from our community.
              </p>
            </div>
          </div>
        </Animated>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {stories.map((story, index) => {
            const style = getStoryStyle(story.type);
            const Icon = style.icon;
            
            return (
              <Animated key={story.id} type="fade" delay={index * 0.1}>
                <Card className={`h-full border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 group cursor-pointer ${
                  story.type === "urgent" ? "ring-2 ring-destructive/20" : ""
                }`} onClick={() => navigate("/stories")}>
                  <CardHeader className="pb-2">
                    <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${style.color}`} />
                    </div>
                    <CardTitle className="text-lg heading-font text-neutral-900 dark:text-white group-hover:text-primary transition-colors">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-600 dark:text-neutral-300 body-font text-sm mb-2">
                      {story.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {story.shelter}
                    </p>
                  </CardContent>
                </Card>
              </Animated>
            );
          })}
        </div>

        <Button 
          variant="ghost" 
          className="w-full text-primary hover:text-primary/80"
          onClick={() => navigate("/stories")}
        >
          View All Stories
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Card>
    </section>
  );
};

export default StoriesSection;