import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import hopeLogo from "@/assets/image-removebg-preview (18).png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-background relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src={hopeLogo} 
              alt="Connect 4 Paws" 
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
            />
            <div className="hidden sm:block">
              <h1 className="text-sm sm:text-lg heading-font text-primary">Connect 4 Paws</h1>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-primary/5">
              Home
            </Link>
            <Link to="/map" className="text-foreground hover:text-primary transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-primary/5">
              Interactive Map
            </Link>
            <Link to="/adopt" className="text-foreground hover:text-destructive transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-destructive/5">
              Adopt
            </Link>
            <Link to="/volunteer" className="text-foreground hover:text-warning transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-warning/10">
              Volunteer
            </Link>
            <Link to="/donate" className="text-foreground hover:text-primary transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-primary/5">
              Donations
            </Link>
            <a href="#" className="text-foreground hover:text-primary transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-primary/5">
              Resource Hub
            </a>
          </nav>

          {/* Login/Dashboard & Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/login">
              <Button 
                variant="outline"
                size="sm"
                className="hidden md:flex button-font border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm"
              >
                Login / Dashboard
              </Button>
            </Link>

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
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-background border-t border-border shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              <Link 
                to="/" 
                className="block text-foreground hover:text-primary transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-primary/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/map" 
                className="block text-foreground hover:text-primary transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-primary/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Interactive Map
              </Link>
              <Link 
                to="/adopt" 
                className="block text-foreground hover:text-destructive transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-destructive/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Adopt
              </Link>
              <Link 
                to="/volunteer" 
                className="block text-foreground hover:text-warning transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-warning/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Volunteer
              </Link>
              <Link 
                to="/donate" 
                className="block text-foreground hover:text-primary transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-primary/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Donations
              </Link>
              <a 
                href="#" 
                className="block text-foreground hover:text-primary transition-colors body-font font-medium px-3 py-2 rounded-lg hover:bg-primary/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Resource Hub
              </a>
              <div className="pt-2 border-t border-border">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full button-font border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Login / Dashboard
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;