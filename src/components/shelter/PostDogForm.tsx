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

interface PostDogFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  editingItem?: any;
}

const PostDogForm = ({ onSubmit, onCancel, editingItem }: PostDogFormProps) => {
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shelterName: editingItem?.shelter_name || "",
    name: editingItem?.name || "",
    breed: editingItem?.breed || "",
    age: editingItem?.age || "",
    ageCategory: editingItem?.age_category || "adult",
    size: editingItem?.size || "medium",
    gender: editingItem?.gender || "male",
    temperament: editingItem?.temperament ? editingItem.temperament.join(', ') : "",
    description: editingItem?.description || "",
    medicalInfo: editingItem?.medical_info || "",
    status: editingItem?.status || "available",
    isUrgent: editingItem?.is_urgent || false,
    photos: editingItem?.photo_urls || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.shelter_id) {
      toast.error("You must be associated with a shelter to post dogs");
      return;
    }

    setIsSubmitting(true);

    try {
      const dogData = {
        shelter_id: profile.shelter_id,
        shelter_name: formData.shelterName,
        name: formData.name,
        breed: formData.breed,
        age: formData.age,
        age_category: formData.ageCategory,
        size: formData.size,
        gender: formData.gender,
        temperament: formData.temperament.split(',').map(t => t.trim()).filter(t => t.length > 0),
        description: formData.description,
        medical_info: formData.medicalInfo || null,
        status: formData.status,
        is_urgent: formData.isUrgent,
        photo_urls: formData.photos.length > 0 ? formData.photos : [],
      };

      let data, error;

      if (editingItem) {
        // Update existing dog
        const result = await supabase
          .from('dogs')
          .update(dogData)
          .eq('id', editingItem.id)
          .select();
        data = result.data;
        error = result.error;
      } else {
        // Create new dog
        const result = await supabase
          .from('dogs')
          .insert([dogData])
          .select();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      toast.success(editingItem ? "Dog updated successfully!" : "Dog posted successfully! It will now appear on the Adopt page.");
      onSubmit(data);
      
      // Reset form
      setFormData({
        shelterName: "",
        name: "",
        breed: "",
        age: "",
        ageCategory: "adult",
        size: "medium",
        gender: "male",
        temperament: "",
        description: "",
        medicalInfo: "",
        status: "available",
        isUrgent: false,
        photos: []
      });
    } catch (error: any) {
      console.error('Error posting dog:', error);
      toast.error(error.message || "Failed to post dog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In production, this would upload to a server
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
        <CardTitle>{editingItem ? 'Edit Dog' : 'Post New Dog for Adoption'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shelter Information */}
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

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Dog Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Buddy"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed *</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="e.g., Golden Retriever"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g., 3 years"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageCategory">Age Category *</Label>
              <Select value={formData.ageCategory} onValueChange={(value) => setFormData({ ...formData, ageCategory: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="puppy">Puppy (0-1 year)</SelectItem>
                  <SelectItem value="young">Young (1-3 years)</SelectItem>
                  <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                  <SelectItem value="senior">Senior (7+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size *</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (0-25 lbs)</SelectItem>
                  <SelectItem value="medium">Medium (25-60 lbs)</SelectItem>
                  <SelectItem value="large">Large (60+ lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Temperament */}
          <div className="space-y-2">
            <Label htmlFor="temperament">Temperament (comma-separated) *</Label>
            <Input
              id="temperament"
              value={formData.temperament}
              onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
              placeholder="e.g., Friendly, Energetic, Good with kids"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about this dog's personality, behavior, and what makes them special..."
              rows={4}
              required
            />
          </div>

          {/* Medical Information */}
          <div className="space-y-2">
            <Label htmlFor="medicalInfo">Medical Information</Label>
            <Textarea
              id="medicalInfo"
              value={formData.medicalInfo}
              onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
              placeholder="Any medical conditions, medications, or special care needs..."
              rows={3}
            />
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Availability Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available for Adoption</SelectItem>
                  <SelectItem value="foster">Foster Needed</SelectItem>
                  <SelectItem value="pending">Adoption Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="isUrgent"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="isUrgent" className="cursor-pointer">
                Mark as Urgent (needs immediate help)
              </Label>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photos</Label>
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

            {/* Photo Preview */}
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
              {isSubmitting ? (editingItem ? "Updating..." : "Posting...") : (editingItem ? "Update Dog" : "Post Dog")}
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

export default PostDogForm;
