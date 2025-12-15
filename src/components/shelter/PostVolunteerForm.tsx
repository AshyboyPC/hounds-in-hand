import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PostVolunteerFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  editingItem?: any;
}

const PostVolunteerForm = ({ onSubmit, onCancel, editingItem }: PostVolunteerFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    shelterName: editingItem?.shelter_name || "",
    title: editingItem?.title || "",
    description: editingItem?.description || "",
    category: editingItem?.category || "animal_care",
    difficulty: editingItem?.difficulty || "beginner",
    time_commitment: editingItem?.time_commitment || "",
    date: editingItem?.date || "",
    start_time: editingItem?.start_time || "",
    end_time: editingItem?.end_time || "",
    location: editingItem?.location || "",
    max_volunteers: editingItem?.max_volunteers?.toString() || "",
    is_recurring: editingItem?.is_recurring || false,
    recurrence_pattern: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to post opportunities");
      return;
    }

    try {
      // Get shelter_id from user metadata
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('shelter_id')
        .eq('id', user.id)
        .single();

      if (userError || !userData?.shelter_id) {
        toast.error("Could not find your shelter information");
        return;
      }

      // Prepare the data for insertion
      const opportunityData = {
        shelter_id: userData.shelter_id,
        shelter_name: formData.shelterName,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        time_commitment: formData.time_commitment,
        date: formData.date || null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        location: formData.location || null,
        max_volunteers: formData.max_volunteers ? parseInt(formData.max_volunteers) : null,
        is_recurring: formData.is_recurring,
        recurrence_pattern: formData.is_recurring ? formData.recurrence_pattern : null,
        status: 'active'
      };

      let data, error;

      if (editingItem) {
        // Update existing volunteer opportunity
        const result = await supabase
          .from('volunteer_opportunities')
          .update(opportunityData)
          .eq('id', editingItem.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Insert new volunteer opportunity
        const result = await supabase
          .from('volunteer_opportunities')
          .insert([opportunityData])
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      toast.success(editingItem ? "Volunteer opportunity updated successfully!" : "Volunteer opportunity posted successfully!");
      onSubmit(data);
      
      // Reset form
      setFormData({
        shelterName: "",
        title: "",
        description: "",
        category: "animal_care",
        difficulty: "beginner",
        time_commitment: "",
        date: "",
        start_time: "",
        end_time: "",
        location: "",
        max_volunteers: "",
        is_recurring: false,
        recurrence_pattern: ""
      });
    } catch (error) {
      console.error("Error posting opportunity:", error);
      toast.error("Failed to post opportunity. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingItem ? 'Edit Volunteer Opportunity' : 'Post Volunteer Opportunity'}</CardTitle>
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

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Opportunity Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Dog Walking & Exercise"
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
              placeholder="Describe what volunteers will be doing..."
              rows={4}
              required
            />
          </div>

          {/* Category and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="animal_care">Animal Care</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="administration">Administration</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level *</Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Commitment */}
          <div className="space-y-2">
            <Label htmlFor="time_commitment">Time Commitment *</Label>
            <Input
              id="time_commitment"
              value={formData.time_commitment}
              onChange={(e) => setFormData({ ...formData, time_commitment: e.target.value })}
              placeholder="e.g., 2 hours, Flexible"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date (optional)</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
          </div>

          {/* Location and Max Volunteers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Main Shelter, Community Center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_volunteers">Max Volunteers (optional)</Label>
              <Input
                id="max_volunteers"
                type="number"
                value={formData.max_volunteers}
                onChange={(e) => setFormData({ ...formData, max_volunteers: e.target.value })}
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>

          {/* Recurring */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_recurring"
                checked={formData.is_recurring}
                onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="is_recurring" className="cursor-pointer">
                This is a recurring opportunity
              </Label>
            </div>

            {formData.is_recurring && (
              <div className="space-y-2">
                <Label htmlFor="recurrence_pattern">Recurrence Pattern</Label>
                <Select 
                  value={formData.recurrence_pattern} 
                  onValueChange={(value) => setFormData({ ...formData, recurrence_pattern: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-primary">
              {editingItem ? "Update Opportunity" : "Post Opportunity"}
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

export default PostVolunteerForm;
