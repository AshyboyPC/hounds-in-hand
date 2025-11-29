import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DashboardRedirect = () => {
    const { user, loading, verifyAdmin } = useAuth();
    const navigate = useNavigate();
    const [showAdminClaim, setShowAdminClaim] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        const role = user.user_metadata?.role;

        if (role) {
            // User already has a role, redirect accordingly
            navigate(`/dashboard/${role}`, { replace: true });
        } else {
            // New user without a role, automatically assign volunteer
            const assignVolunteerRole = async () => {
                try {
                    const { error } = await supabase.auth.updateUser({
                        data: { role: "volunteer" },
                    });

                    if (error) throw error;

                    await supabase.auth.refreshSession();
                    toast.success("Welcome to the Volunteer team!");
                    navigate("/dashboard/volunteer", { replace: true });
                } catch (error) {
                    console.error("Error setting volunteer role:", error);
                    toast.error("Failed to initialize dashboard.");
                }
            };
            assignVolunteerRole();
        }
    }, [user, loading, navigate]);

    // Removed manual selection handlers as we now auto-assign


    const handleAdminSelect = () => {
        setShowAdminClaim(false);
        setShowPasswordInput(true);
    };

    const verifyAdminPassword = async () => {
        setIsVerifying(true);
        // In a real app, this should be a backend check or a secure edge function
        // For this demo, we check against the hardcoded value
        if (adminPassword === "admin-secure-123") {
            try {
                const { error } = await supabase.auth.updateUser({
                    data: { role: "admin" },
                });

                if (error) throw error;

                verifyAdmin(); // Mark as verified in context to avoid double prompt
                await supabase.auth.refreshSession(); // Ensure context updates before navigation
                toast.success("Admin access granted!");
                navigate("/dashboard/admin", { replace: true });
            } catch (error) {
                console.error("Error setting admin role:", error);
                toast.error("Failed to set admin role.");
                setIsVerifying(false);
            }
        } else {
            toast.error("Incorrect admin password.");
            setIsVerifying(false);
        }
    };

    if (loading) return null;

    return (
        <>
            {/* Admin Claim Modal Removed - Auto-assigning volunteer role */}
            {/* 
            <AlertDialog open={showAdminClaim}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Welcome to Hope for Hounds!</AlertDialogTitle>
                        <AlertDialogDescription>
                            We noticed this is your first time logging in. Are you an administrator for the organization?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleVolunteerSelect}>No, I am a Volunteer</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAdminSelect}>Yes, I am an Admin</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> 
            */}

            <AlertDialog open={showPasswordInput}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Admin Verification</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please enter the administrator security password to claim this account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="admin-password">Admin Password</Label>
                        <Input
                            id="admin-password"
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="Enter admin password"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setShowPasswordInput(false);
                            setShowAdminClaim(true);
                        }}>Back</AlertDialogCancel>
                        <Button onClick={verifyAdminPassword} disabled={isVerifying}>
                            {isVerifying ? "Verifying..." : "Verify Access"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default DashboardRedirect;
