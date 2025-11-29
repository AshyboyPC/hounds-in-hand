import { Menu, X, LogOut, LayoutDashboard, Home, Map, Heart, HandHeart, DollarSign, Package, BookHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Dock, DockCard, DockCardInner, DockDivider } from "@/components/ui/dock";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    console.log("Sign out button clicked");
    try {
      console.log("Calling signOut function...");
      await signOut();
      console.log("Sign out successful");
      toast.success("Signed out successfully");
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    const role = profile?.role || "community";
    if (role === "shelter" || role === "admin") {
      return "/dashboard/shelter";
    }
    return "/dashboard/community";
  };

  const navItems = [
    { icon: Home, label: "Home", href: "/", color: "text-blue-500", glow: "bg-blue-500" },
    { icon: Map, label: "Map", href: "/map", color: "text-emerald-500", glow: "bg-emerald-500" },
    { icon: Heart, label: "Adopt", href: "/adopt", color: "text-red-500", glow: "bg-red-500" },
    { icon: HandHeart, label: "Volunteer", href: "/volunteer", color: "text-purple-500", glow: "bg-purple-500" },
    { icon: Package, label: "Wishlist", href: "/supply-wishlist", color: "text-orange-500", glow: "bg-orange-500" },
    { icon: BookHeart, label: "Stories", href: "/stories", color: "text-pink-500", glow: "bg-pink-500" },
    { icon: DollarSign, label: "Donate", href: "/donate", color: "text-amber-500", glow: "bg-amber-500" },
  ];

  const location = useLocation();
  const activeIndex = navItems.findIndex(item => item.href === location.pathname);

  return (
    <header className="w-full bg-background relative z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <img
              src="/connect_4_paws_logo.png"
              alt="Connect 4 Paws"
              className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
            />
            <div className="hidden sm:block">
              <h1 className="text-sm sm:text-lg heading-font text-primary">Connect 4 Paws</h1>
            </div>
          </Link>

          {/* Dock Navigation - Desktop */}
          <div className="hidden lg:flex flex-1 justify-start items-center relative h-full ml-8">
            <Dock
              className="bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-2xl pb-3"
              defaultAnimatingIndexes={activeIndex >= 0 ? [activeIndex] : []}
            >
              {navItems.map((item, index) => (
                <DockCard
                  key={item.label}
                  id={index.toString()}
                  label={item.label}
                  textColor={item.color}
                  onClick={() => navigate(item.href)}
                >
                  <DockCardInner id={index.toString()} blurColor={item.glow}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </DockCardInner>
                </DockCard>
              ))}
            </Dock>
          </div>

          {/* Login/Dashboard & Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link to={getDashboardLink()}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="button-font border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSignOut();
                  }}
                  className="button-font text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs sm:text-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex button-font border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm"
                >
                  Login / Dashboard
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-foreground hover:bg-muted"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-24 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-primary/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-2 border-t border-border space-y-2">
                {user ? (
                  <>
                    <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full button-font border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSignOut();
                      }}
                      className="w-full button-font text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full button-font border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Login / Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;