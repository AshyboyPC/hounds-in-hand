import { useState, useEffect } from "react";
import { Heart, Star, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Animated } from "@/components/ui/animated";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id: string;
  title: string;
  content: string;
  type: "success_story" | "urgent_need" | "update" | "event" | "thank_you";
  shelter: string;
}

const StoriesSection = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('shelter_stories')
          .select(`
            id,
            title,
            content,
            story_type,
            shelters (
              name
            )
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(2);

        if (error) throw error;

        const transformedStories = data?.map(story => {
          const shelterName = Array.isArray(story.shelters) 
            ? (story.shelters[0] as any)?.name 
            : (story.shelters as any)?.name;
          return {
            id: story.id,
            title: story.title,
            content: story.content,
            type: story.story_type as Story['type'],
            shelter: shelterName || 'Unknown Shelter'
          };
        }) || [];

        setStories(transformedStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const getStoryStyle = (type: string) => {
    switch (type) {
      case "success_story":
        return { icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" };
      case "urgent_need":
        return { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" };
      case "thank_you":
        return { icon: Heart, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" };
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

        {loading ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Loading stories...</p>
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {stories.map((story, index) => {
            const style = getStoryStyle(story.type);
            const Icon = style.icon;
            
            return (
              <Animated key={story.id} type="fade" delay={index * 0.1}>
                <Card className={`h-full border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 group cursor-pointer ${
                  story.type === "urgent_need" ? "ring-2 ring-destructive/20" : ""
                }`} onClick={() => navigate("/stories")}>
                  <CardHeader className="pb-2">
                    <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${style.color}`} />
                    </div>
                    <CardTitle className="text-lg heading-font text-neutral-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-600 dark:text-neutral-300 body-font text-sm mb-2 line-clamp-3">
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
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-2">No stories yet</p>
            <p className="text-xs text-muted-foreground">Check back soon for updates from local shelters</p>
          </div>
        )}

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