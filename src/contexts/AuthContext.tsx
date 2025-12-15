import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile, UserRole } from "@/types/database";

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    isAdminVerified: boolean;
    verifyAdmin: () => void;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    isAdminVerified: false,
    verifyAdmin: () => { },
    signOut: async () => { },
    refreshProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdminVerified, setIsAdminVerified] = useState(false);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error("Error fetching profile:", error);
            setProfile(null);
        }
    };

    const refreshProfile = async () => {
        if (user?.id) {
            await fetchProfile(user.id);
        }
    };

    useEffect(() => {
        let isMounted = true;
        
        // Check active sessions and subscribe to auth changes
        const initializeAuth = async () => {
            try {
                // Add timeout to prevent hanging
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Session check timeout')), 5000)
                );
                
                const sessionPromise = supabase.auth.getSession();
                const result = await Promise.race([sessionPromise, timeoutPromise]) as { data: { session: Session | null } };
                
                if (!isMounted) return;
                
                const session = result.data.session;
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchProfile(session.user.id);
                }

                // Check if admin verification is stored in session storage (for page reloads)
                const storedAdminVerification = sessionStorage.getItem("adminVerified");
                if (storedAdminVerification === "true") {
                    setIsAdminVerified(true);
                }
            } catch (error) {
                console.error("Error checking auth session:", error);
                // On error, still set loading to false so the app doesn't hang
                if (isMounted) {
                    setSession(null);
                    setUser(null);
                    setProfile(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) return;
            
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                // Fetch profile with timeout
                try {
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
                    );
                    await Promise.race([fetchProfile(session.user.id), timeoutPromise]);
                } catch (error) {
                    console.error("Error fetching profile on auth change:", error);
                    // Continue anyway - don't block the app
                }
            } else {
                setProfile(null);
            }

            setLoading(false);

            // Reset admin verification on logout
            if (!session) {
                setIsAdminVerified(false);
                sessionStorage.removeItem("adminVerified");
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const verifyAdmin = () => {
        setIsAdminVerified(true);
        sessionStorage.setItem("adminVerified", "true");
    };

    const signOut = async () => {
        try {
            // Set a timeout for the Supabase call
            const signOutPromise = supabase.auth.signOut();
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Sign out timeout')), 3000)
            );
            
            await Promise.race([signOutPromise, timeoutPromise]);
        } catch (error) {
            console.error("Error signing out:", error);
            // Continue anyway - we'll clear local state
        } finally {
            // Always clear state regardless of Supabase success
            setProfile(null);
            setSession(null);
            setUser(null);
            
            // Clear any legacy localStorage data
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            localStorage.removeItem('user');
            
            // Clear session storage
            sessionStorage.removeItem('adminVerified');
        }
    };

    return (
        <AuthContext.Provider value={{ session, user, profile, loading, isAdminVerified, verifyAdmin, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
