import { MessageCircle, Users, MoreHorizontal } from "lucide-react";
import hopeLogo from "@/assets/hope-for-hounds-logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo and School Name */}
          <div className="flex items-center space-x-3">
            <img 
              src={hopeLogo} 
              alt="Campbell High School" 
              className="w-8 h-8 filter brightness-0 invert"
            />
            <span className="text-lg font-semibold">Campbell High School</span>
          </div>

          {/* Center - Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Campbell High School
            </a>
            <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Central Tennessee High School
            </a>
            <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Approved and Sent to you Day
            </a>
          </nav>

          {/* Right Side - Social Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <MessageCircle className="h-5 w-5" />
            </button>
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <Users className="h-5 w-5" />
            </button>
            <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;