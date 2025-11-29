import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface PostSupplyFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PostSupplyForm = ({ onSubmit, onCancel }: PostSupplyFormProps) => {
  const [formData, setFormData] = useState({
    item: "",
    quantity: "",
    priority: "medium",
    description: "",
    amazonLink: "",
    chewyLink: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Add Supply Need
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item">Item Name *</Label>
            <Input
              id="item"
              value={formData.item}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              placeholder="e.g., Dog Food (50lb bags)"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Needed *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g., 10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High - Urgent Need</SelectItem>
                  <SelectItem value="medium">Medium - Needed Soon</SelectItem>
                  <SelectItem value="low">Low - Nice to Have</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about this supply need..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amazonLink">Amazon Wishlist Link (optional)</Label>
            <Input
              id="amazonLink"
              type="url"
              value={formData.amazonLink}
              onChange={(e) => setFormData({ ...formData, amazonLink: e.target.value })}
              placeholder="https://amazon.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chewyLink">Chewy Wishlist Link (optional)</Label>
            <Input
              id="chewyLink"
              type="url"
              value={formData.chewyLink}
              onChange={(e) => setFormData({ ...formData, chewyLink: e.target.value })}
              placeholder="https://chewy.com/..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-destructive">
              Post Supply Need
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

export default PostSupplyForm;
