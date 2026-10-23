import { Heart, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import "./Header.css";

const navItems = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Adopt", href: "/adopt", icon: "adopt" },
  { label: "Volunteer", href: "/volunteer", icon: "volunteer" },
  { label: "Wishlist", href: "/supply-wishlist", icon: "wishlist" },
  { label: "Shelter Map", href: "/map", icon: "map" },
  { label: "Stories", href: "/stories", icon: "stories" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const dashboardLink = !user ? "/login" : profile?.role === "shelter" || profile?.role === "admin"
    ? "/dashboard/shelter" : profile?.role === "staff" ? "/dashboard/staff" : "/dashboard/community";
  const accountLabel = user ? "Dashboard" : "Login / Dashboard";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      setMenuOpen(false);
      navigate("/");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unable to sign out. Please try again.");
    }
  };

  const isActive = (href: string) => pathname === href || (href === "/volunteer" && pathname === "/volunteer-board");

  return (
    <header className="c4p-header">
      <div className="c4p-nav-shell">
        <Link to="/" className="c4p-brand" aria-label="Connect 4 Paws home">
          <img src="/connect_4_paws_logo.png" alt="" width="88" height="88" />
          <span>Connect 4 Paws</span>
        </Link>

        <nav className="c4p-desktop-links" aria-label="Main navigation">
          {navItems.map(item => (
            <Link key={item.href} to={item.href} className={`c4p-nav-link${isActive(item.href) ? " is-active" : ""}`} aria-current={isActive(item.href) ? "page" : undefined}>
              <img src={`/nav-icons/${item.icon}.png`} alt="" width="52" height="52" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="c4p-nav-actions">
          <Link to="/donate" className="c4p-donate" aria-current={pathname === "/donate" ? "page" : undefined}>
            <Heart fill="currentColor" aria-hidden="true" /><span>Donate</span>
          </Link>
          <Link to={dashboardLink} className="c4p-account c4p-desktop-account">
            <img src="/nav-icons/account.png" alt="" width="30" height="30" /><span>{accountLabel}</span>
          </Link>
          {user && <button className="c4p-sign-out c4p-desktop-account" onClick={handleSignOut} aria-label="Sign out" title="Sign out"><LogOut aria-hidden="true" /></button>}
          <button className="c4p-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-controls="c4p-mobile-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="c4p-mobile-navigation" className="c4p-mobile-menu" aria-label="Mobile navigation">
          <div className="c4p-mobile-grid">
            {navItems.map(item => (
              <Link key={item.href} to={item.href} className={`c4p-mobile-link${isActive(item.href) ? " is-active" : ""}`} aria-current={isActive(item.href) ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                <img src={`/nav-icons/${item.icon}.png`} alt="" width="44" height="44" /><span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="c4p-mobile-account">
            <Link to={dashboardLink} className="c4p-account" onClick={() => setMenuOpen(false)}><img src="/nav-icons/account.png" alt="" width="30" height="30" /><span>{accountLabel}</span></Link>
            {user && <button className="c4p-sign-out" onClick={handleSignOut} aria-label="Sign out"><LogOut aria-hidden="true" /></button>}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
