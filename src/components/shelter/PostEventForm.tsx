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

interface PostEventFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  editingItem?: any;
}

const PostEventForm = ({ onSubmit, onCancel, editingItem }: PostEventFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shelterName: editingItem?.shelter_name || "",
    title: editingItem?.title || "",
    description: editingItem?.description || "",
    event_type: editingItem?.event_type || "adoption_event",
    date: editingItem?.date || "",
    start_time: editingItem?.start_time || "",
    end_time: editingItem?.end_time || "",
    location: editingItem?.location || "",
    address: editingItem?.address || "",
    max_attendees: editingItem?.max_attendees?.toString() || "",
    registration_required: editingItem?.registration_required || false,
    registration_link: editingItem?.registration_link || "",
    contact_email: editingItem?.contact_email || "",
    contact_phone: editingItem?.contact_phone || "",
    is_recurring: editingItem?.is_recurring || false,
    recurrence_pattern: editingItem?.recurrence_pattern || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to post events");
      return;
    }

    setIsSubmitting(true);

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
      const eventData = {
        shelter_id: userData.shelter_id,
        shelter_name: formData.shelterName,
        title: formData.title,
        description: formData.description,
        event_type: formData.event_type,
        date: formData.date,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        location: formData.location || null,
        address: formData.address || null,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        registration_required: formData.registration_required,
        registration_link: formData.registration_link || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        is_recurring: formData.is_recurring,
        recurrence_pattern: formData.is_recurring ? formData.recurrence_pattern : null,
        status: 'active'
      };

      let data, error;

      if (editingItem) {
        // Update existing event
        const result = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingItem.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Create new event
        const result = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      console.log(editingItem ? 'Event updated successfully:' : 'Event created successfully:', data);
      toast.success(editingItem ? "Event updated successfully!" : "Event posted successfully! It will now appear on the Events page and Community Dashboard.");
      onSubmit(data);
      
      // Reset form
      setFormData({
        shelterName: "",
        title: "",
        description: "",
        event_type: "adoption_event",
        date: "",
        start_time: "",
        end_time: "",
        location: "",
        address: "",
        max_attendees: "",
        registration_required: false,
        registration_link: "",
        contact_email: "",
        contact_phone: "",
        is_recurring: false,
        recurrence_pattern: ""
      });
    } catch (error: any) {
      console.error("Error posting event:", error);
      toast.error(error.message || "Failed to post event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post New Event</CardTitle>
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
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Adoption Day at the Park"
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
              placeholder="Describe your event..."
              rows={4}
              required
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="event_type">Event Type *</Label>
            <Select 
              value={formData.event_type} 
              onValueChange={(value) => setFormData({ ...formData, event_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adoption_event">Adoption Event</SelectItem>
                <SelectItem value="fundraiser">Fundraiser</SelectItem>
                <SelectItem value="volunteer_day">Volunteer Day</SelectItem>
                <SelectItem value="community_event">Community Event</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
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

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location Name</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Central Park"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address"
              />
            </div>
          </div>

          {/* Registration */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="registration_required"
                checked={formData.registration_required}
                onChange={(e) => setFormData({ ...formData, registration_required: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="registration_required" className="cursor-pointer">
                Registration required
              </Label>
            </div>

            {formData.registration_required && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registration_link">Registration Link</Label>
                  <Input
                    id="registration_link"
                    type="url"
                    value={formData.registration_link}
                    onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_attendees">Max Attendees</Label>
                  <Input
                    id="max_attendees"
                    type="number"
                    value={formData.max_attendees}
                    onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="contact@shelter.org"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="(555) 123-4567"
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
                This is a recurring event
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
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-primary" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Event"}
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

export default PostEventForm;