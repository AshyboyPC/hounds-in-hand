import { Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Logo and Name */}
          <div className="flex items-center justify-center space-x-3">
            <img 
              src="/connect_4_paws_logo.png" 
              alt="Connect 4 Paws" 
              className="w-10 h-10 brightness-0 invert"
            />
            <span className="text-base heading-font">Connect 4 Paws</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center space-x-6">
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <Instagram className="h-5 w-5" />
            </button>
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <Facebook className="h-5 w-5" />
            </button>
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/about" onClick={scrollToTop} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors body-font">
              About
            </Link>
            <Link to="/contact" onClick={scrollToTop} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors body-font">
              Contact
            </Link>
            <Link to="/privacy-policy" onClick={scrollToTop} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors body-font">
              Privacy Policy
            </Link>
            <Link to="/partnerships" onClick={scrollToTop} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors body-font">
              Partnerships
            </Link>
          </nav>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between mb-4">
          {/* Left Side - Logo and School Name */}
          <div className="flex items-center space-x-3">
            <img 
              src="/connect_4_paws_logo.png" 
              alt="Connect 4 Paws" 
              className="w-12 h-12 brightness-0 invert"
            />
            <span className="text-lg heading-font">Connect 4 Paws</span>
          </div>

          {/* Center - Navigation Links */}
          <nav className="flex items-center space-x-8">
            <Link to="/about" onClick={scrollToTop} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors body-font">
              About
            </Link>
            <Link to="/contact" onClick={scrollToTop} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors body-font">
              Contact
            </Link>
            <Link to="/privacy-policy" onClick={scrollToTop} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors body-font">
              Privacy Policy
            </Link>
            <Link to="/partnerships" onClick={scrollToTop} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors body-font">
              Partnerships
            </Link>
          </nav>

          {/* Right Side - Social Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <Instagram className="h-5 w-5" />
            </button>
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <Facebook className="h-5 w-5" />
            </button>
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Copyright Line */}
        <div className="text-center border-t border-primary-foreground/20 pt-4 mt-4 md:mt-0">
          <p className="text-primary-foreground/70 body-font text-xs sm:text-sm">
            © 2025 Connect 4 Paws
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;