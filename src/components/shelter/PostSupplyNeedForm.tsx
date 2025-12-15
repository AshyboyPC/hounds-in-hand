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

interface PostSupplyNeedFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  editingItem?: any;
}

const PostSupplyNeedForm = ({ onSubmit, onCancel, editingItem }: PostSupplyNeedFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shelterName: editingItem?.shelter_name || "",
    item_name: editingItem?.item_name || "",
    category: editingItem?.category || "food",
    quantity_needed: editingItem?.quantity_needed || "",
    priority: editingItem?.priority || "medium",
    description: editingItem?.description || "",
    amazon_link: editingItem?.amazon_link || "",
    chewy_link: editingItem?.chewy_link || "",
    other_link: editingItem?.other_link || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to post supply needs");
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
      const supplyData = {
        shelter_id: userData.shelter_id,
        shelter_name: formData.shelterName,
        item_name: formData.item_name,
        category: formData.category,
        quantity_needed: parseInt(formData.quantity_needed),
        quantity_received: 0,
        priority: formData.priority,
        description: formData.description || null,
        amazon_link: formData.amazon_link || null,
        chewy_link: formData.chewy_link || null,
        other_link: formData.other_link || null,
        is_fulfilled: false
      };

      let data, error;

      if (editingItem) {
        // Update existing supply need
        const result = await supabase
          .from('supply_needs')
          .update(supplyData)
          .eq('id', editingItem.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Insert new supply need
        const result = await supabase
          .from('supply_needs')
          .insert([supplyData])
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      toast.success(editingItem ? "Supply need updated successfully!" : "Supply need posted successfully! It will now appear on the Supply Wishlist page.");
      onSubmit(data);
      
      // Reset form
      setFormData({
        shelterName: "",
        item_name: "",
        category: "food",
        quantity_needed: "",
        priority: "medium",
        description: "",
        amazon_link: "",
        chewy_link: "",
        other_link: ""
      });
    } catch (error: any) {
      console.error("Error posting supply need:", error);
      toast.error(error.message || "Failed to post supply need. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingItem ? 'Edit Supply Need' : 'Post Supply Need'}</CardTitle>
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

          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="item_name">Item Name *</Label>
            <Input
              id="item_name"
              value={formData.item_name}
              onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              placeholder="e.g., Dog Food - Large Breed"
              required
            />
          </div>

          {/* Category and Priority */}
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
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="bedding">Bedding</SelectItem>
                  <SelectItem value="toys">Toys</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quantity Needed */}
          <div className="space-y-2">
            <Label htmlFor="quantity_needed">Quantity Needed *</Label>
            <Input
              id="quantity_needed"
              type="number"
              min="1"
              value={formData.quantity_needed}
              onChange={(e) => setFormData({ ...formData, quantity_needed: e.target.value })}
              placeholder="e.g., 10"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about this item..."
              rows={3}
            />
          </div>

          {/* Purchase Links */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Purchase Links (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Add links where people can purchase and donate this item
            </p>

            <div className="space-y-2">
              <Label htmlFor="amazon_link">Amazon Link</Label>
              <Input
                id="amazon_link"
                type="url"
                value={formData.amazon_link}
                onChange={(e) => setFormData({ ...formData, amazon_link: e.target.value })}
                placeholder="https://amazon.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chewy_link">Chewy Link</Label>
              <Input
                id="chewy_link"
                type="url"
                value={formData.chewy_link}
                onChange={(e) => setFormData({ ...formData, chewy_link: e.target.value })}
                placeholder="https://chewy.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="other_link">Other Link</Label>
              <Input
                id="other_link"
                type="url"
                value={formData.other_link}
                onChange={(e) => setFormData({ ...formData, other_link: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-primary" disabled={isSubmitting}>
              {isSubmitting ? (editingItem ? "Updating..." : "Posting...") : (editingItem ? "Update Supply Need" : "Post Supply Need")}
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

export default PostSupplyNeedForm;
