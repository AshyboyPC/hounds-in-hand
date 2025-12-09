import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dog, Bone, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedDog {
  id: string;
  name: string;
  breed: string;
  age: string;
  description: string;
  shelter_name: string;
}

const DogOfTheWeek = () => {
  const navigate = useNavigate();
  const [featuredDog, setFeaturedDog] = useState<FeaturedDog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedDog = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('dogs')
          .select(`
            id,
            name,
            breed,
            age,
            description,
            shelters (
              name
            )
          `)
          .eq('is_dog_of_week', true)
          .eq('is_available', true)
          .limit(1)
          .single();

        if (error) {
          // No featured dog found, that's okay
          console.log('No featured dog found');
          setFeaturedDog(null);
        } else if (data) {
          const shelterName = Array.isArray(data.shelters) 
            ? (data.shelters[0] as any)?.name 
            : (data.shelters as any)?.name;
          setFeaturedDog({
            id: data.id,
            name: data.name,
            breed: data.breed,
            age: data.age,
            description: data.description || '',
            shelter_name: shelterName || 'Unknown Shelter'
          });
        }
      } catch (error) {
        console.error('Error fetching featured dog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDog();
  }, []);

  return (
    <div className="h-full">
      <Card className="h-full border-none shadow-sm bg-white dark:bg-neutral-800 overflow-hidden rounded-3xl flex flex-col">
        <div className="bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/20 p-6 flex items-center justify-center relative overflow-hidden flex-1 min-h-[160px]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Bone className="w-32 h-32 rotate-12" />
          </div>
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-warning/90 text-black px-2 py-1 rounded-full text-xs font-bold">
            <Star className="w-3 h-3 fill-current" />
            Dog of the Week
          </div>
          <div className="w-20 h-20 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-sm z-10">
            <Dog className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Loading featured dog...</p>
            </div>
          ) : featuredDog ? (
            <>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl heading-font text-neutral-900 dark:text-white">
                      Featured Friend
                    </h3>
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  </div>
                  <h4 className="text-2xl font-bold heading-font text-neutral-900 dark:text-white">
                    {featuredDog.name}
                  </h4>
                </div>
                <span className="text-xs font-bold button-font text-primary bg-primary/10 px-2 py-1 rounded-md">
                  {featuredDog.age} • {featuredDog.breed}
                </span>
              </div>

              <p className="text-neutral-600 dark:text-neutral-300 mb-2 body-font text-sm leading-relaxed line-clamp-3">
                {featuredDog.description}
              </p>
              
              <p className="text-xs text-muted-foreground mb-4">
                From: {featuredDog.shelter_name}
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl heading-font text-neutral-900 dark:text-white">
                      Featured Friend
                    </h3>
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  </div>
                  <h4 className="text-2xl font-bold heading-font text-neutral-900 dark:text-white">
                    Coming Soon
                  </h4>
                </div>
              </div>

              <p className="text-neutral-600 dark:text-neutral-300 mb-2 body-font text-sm leading-relaxed">
                Check back soon for our featured dog of the week!
              </p>
              
              <p className="text-xs text-muted-foreground mb-4">
                Shelters can feature a dog from their dashboard
              </p>
            </>
          )}

          <Button
            onClick={() => navigate(`/adopt`)}
            className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 text-white rounded-full button-font shadow-sm mt-auto"
          >
            View Adoptable Dogs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DogOfTheWeek;