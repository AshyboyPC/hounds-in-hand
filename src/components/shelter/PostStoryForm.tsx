import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PostStoryFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  editingItem?: any;
}

const PostStoryForm = ({ onSubmit, onCancel, editingItem }: PostStoryFormProps) => {
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shelterName: editingItem?.shelter_name || "",
    title: editingItem?.title || "",
    content: editingItem?.content || "",
    story_type: editingItem?.story_type || "update",
    dog_name: editingItem?.dog_name || "",
    is_featured: editingItem?.is_featured || false,
    photos: editingItem?.photo_urls || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.shelter_id) {
      toast.error("You must be associated with a shelter to post stories");
      return;
    }

    setIsSubmitting(true);

    try {
      const storyData = {
        shelter_id: profile.shelter_id,
        shelter_name: formData.shelterName,
        title: formData.title,
        content: formData.content,
        story_type: formData.story_type,
        dog_name: formData.dog_name || null,
        is_featured: formData.is_featured,
        photo_url: formData.photos[0] || null,
      };

      let data, error;

      if (editingItem) {
        // Update existing story
        const result = await supabase
          .from('shelter_stories')
          .update(storyData)
          .eq('id', editingItem.id)
          .select();
        data = result.data;
        error = result.error;
      } else {
        // Insert new story
        const result = await supabase
          .from('shelter_stories')
          .insert([storyData])
          .select();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      toast.success(editingItem ? "Story updated successfully!" : "Story posted successfully! It will now appear on the Stories page.");
      onSubmit(data);
      
      // Reset form
      setFormData({
        shelterName: "",
        title: "",
        content: "",
        story_type: "update",
        dog_name: "",
        is_featured: false,
        photos: []
      });
    } catch (error: any) {
      console.error('Error posting story:', error);
      
      // Provide specific error messages for common issues
      if (error.message?.includes('photo_url')) {
        toast.error("Database schema error: photo_url column missing. Please run the database fix script.");
      } else if (error.message?.includes('dog_name')) {
        toast.error("Database schema error: dog_name column missing. Please run the database fix script.");
      } else if (error.message?.includes('schema cache')) {
        toast.error("Database schema cache needs refresh. Please run the database fix script.");
      } else {
        toast.error(error.message || "Failed to post story. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData({ ...formData, photos: [...formData.photos, ...newPhotos] });
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingItem ? 'Edit Story' : 'Share a Story or Update'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shelter Name */}
          <div className="space-y-2">
            <Label htmlFor="shelterName">Shelter Name *</Label>
            <Input
              id="shelterName"
              value={formData.shelterName}
              onChange={(e) => setFormData({ ...formData, shelterName: e.target.value })}
              placeholder="Enter your shelter name"
              required
            />
          </div>

          {/* Story Type */}
          <div className="space-y-2">
            <Label htmlFor="story_type">Story Type *</Label>
            <Select 
              value={formData.story_type} 
              onValueChange={(value) => setFormData({ ...formData, story_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update">General Update</SelectItem>
                <SelectItem value="success_story">Success Story</SelectItem>
                <SelectItem value="urgent_need">Urgent Need</SelectItem>
                <SelectItem value="event">Event Announcement</SelectItem>
                <SelectItem value="thank_you">Thank You Message</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Bella Found Her Forever Home!"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Story Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your story with the community..."
              rows={6}
              required
            />
          </div>

          {/* Dog Name (optional) */}
          <div className="space-y-2">
            <Label htmlFor="dog_name">Featured Dog Name (optional)</Label>
            <Input
              id="dog_name"
              value={formData.dog_name}
              onChange={(e) => setFormData({ ...formData, dog_name: e.target.value })}
              placeholder="e.g., Bella"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="is_featured" className="cursor-pointer">
              Mark as Featured Story
            </Label>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photos (optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label htmlFor="photos" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload photos</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
              </label>
            </div>

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img src={photo} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-primary" disabled={isSubmitting}>
              {isSubmitting ? (editingItem ? "Updating..." : "Publishing...") : (editingItem ? "Update Story" : "Publish Story")}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostStoryForm;
