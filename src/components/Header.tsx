import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hopeLogo from "@/assets/hope-for-hounds-logo.png";

const Header = () => {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img 
              src={hopeLogo} 
              alt="Hope for Hounds Campbell High School" 
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-2xl font-bold text-primary">Hope</h1>
              <h2 className="text-2xl font-bold text-primary">for Hounds</h2>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Campbell High School
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Central Dauphin East
            </a>
          </nav>

          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex">
                <Input
                  placeholder="Campbell Junction"
                  className="w-40 rounded-r-none border-r-0 bg-background"
                />
                <Button 
                  variant="default"
                  size="sm"
                  className="rounded-l-none px-4"
                >
                  Campbell High School
                </Button>
              </div>
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;