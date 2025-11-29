import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

interface PostStoryFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PostStoryForm = ({ onSubmit, onCancel }: PostStoryFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    story_type: "update",
    dog_name: "",
    is_featured: false,
    photos: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        <CardTitle>Share a Story or Update</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Button type="submit" className="flex-1 bg-primary">
              Publish Story
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostStoryForm;
