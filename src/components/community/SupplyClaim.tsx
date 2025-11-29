import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupplyClaimProps {
  supplyId: string;
  itemName: string;
  quantityNeeded: number;
  quantityClaimed: number;
  amazonLink?: string;
  chewyLink?: string;
}

const SupplyClaim = ({ supplyId, itemName, quantityNeeded, quantityClaimed, amazonLink, chewyLink }: SupplyClaimProps) => {
  const [claimQuantity, setClaimQuantity] = useState(1);
  const [hasClaimed, setHasClaimed] = useState(false);
  const { toast } = useToast();

  const remaining = quantityNeeded - quantityClaimed;
  const isFulfilled = remaining <= 0;

  const handleClaim = () => {
    if (claimQuantity > 0 && claimQuantity <= remaining) {
      setHasClaimed(true);
      toast({
        title: "Thank You!",
        description: `You've committed to donating ${claimQuantity} ${itemName}. The shelter will contact you with delivery details.`,
      });
      // In production, send to backend
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-primary">{itemName}</p>
          <p className="text-sm text-muted-foreground">
            {isFulfilled ? (
              <span className="text-green-600 font-medium">✓ Fulfilled!</span>
            ) : (
              <span>{remaining} of {quantityNeeded} still needed</span>
            )}
          </p>
        </div>
      </div>

      {!isFulfilled && !hasClaimed && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm">I can donate:</label>
            <input
              type="number"
              min="1"
              max={remaining}
              value={claimQuantity}
              onChange={(e) => setClaimQuantity(parseInt(e.target.value) || 1)}
              className="w-20 px-2 py-1 border rounded"
            />
            <span className="text-sm text-muted-foreground">items</span>
          </div>
          <Button 
            onClick={handleClaim}
            className="w-full bg-primary"
            size="sm"
          >
            <Package className="w-4 h-4 mr-2" />
            Commit to Donate
          </Button>
        </div>
      )}

      {hasClaimed && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            ✓ You've committed to donating {claimQuantity} items!
          </p>
        </div>
      )}

      {/* Wishlist Links */}
      {(amazonLink || chewyLink) && (
        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground">Purchase from:</p>
          <div className="flex gap-2">
            {amazonLink && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => window.open(amazonLink, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Amazon
              </Button>
            )}
            {chewyLink && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => window.open(chewyLink, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Chewy
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyClaim;
