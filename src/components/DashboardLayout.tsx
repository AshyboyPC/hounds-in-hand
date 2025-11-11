import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  Menu,
  LogOut,
  User,
  Settings,
  Bell,
  Home,
  Calendar,
  Users,
  BarChart3,
  FileText,
  Shield,
  Clock,
  MapPin
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface User {
  email: string;
  role: string;
  name: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
}

const DashboardLayout = ({ children, user }: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: "Dashboard", href: `/dashboard/${user.role}` },
      { icon: User, label: "Profile", href: `/dashboard/${user.role}/profile` },
    ];

    switch (user.role) {
      case "volunteer":
        return [
          ...baseItems,
          { icon: Calendar, label: "My Schedule", href: `/dashboard/${user.role}/schedule` },
          { icon: Clock, label: "Hours Logged", href: `/dashboard/${user.role}/hours` },
          { icon: FileText, label: "My Tasks", href: `/dashboard/${user.role}/tasks` },
        ];
      case "staff":
        return [
          ...baseItems,
          { icon: Heart, label: "Dog Management", href: `/dashboard/${user.role}/dogs` },
          { icon: Users, label: "Volunteers", href: `/dashboard/${user.role}/volunteers` },
          { icon: Calendar, label: "Schedules", href: `/dashboard/${user.role}/schedules` },
          { icon: FileText, label: "Daily Tasks", href: `/dashboard/${user.role}/tasks` },
        ];
      case "admin":
        return [
          ...baseItems,
          { icon: BarChart3, label: "Analytics", href: `/dashboard/${user.role}/analytics` },
          { icon: Users, label: "User Management", href: `/dashboard/${user.role}/users` },
          { icon: Heart, label: "All Dogs", href: `/dashboard/${user.role}/dogs` },
          { icon: FileText, label: "Reports", href: `/dashboard/${user.role}/reports` },
          { icon: Settings, label: "System Settings", href: `/dashboard/${user.role}/settings` },
        ];
      default:
        return baseItems;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "volunteer":
        return "bg-primary/10 text-primary";
      case "staff":
        return "bg-warning/10 text-warning";
      case "admin":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const navItems = getNavItems();

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center space-x-2 p-6 border-b">
        <Heart className="w-8 h-8 text-destructive" fill="currentColor" />
        <div>
          <h2 className="text-lg font-semibold text-primary">Connect 4 Paws</h2>
          <p className="text-xs text-muted-foreground">Dashboard</p>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-white">
              {user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200">
          <NavContent />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <NavContent />
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Heart className="w-8 h-8 text-destructive" fill="currentColor" />
              <h1 className="text-lg font-semibold text-primary">Connect 4 Paws</h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white text-xs">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/dashboard/${user.role}/profile`)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;