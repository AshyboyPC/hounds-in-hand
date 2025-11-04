import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Users,
  Heart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  UserMinus,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

interface User {
  email: string;
  role: string;
  name: string;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      navigate("/login");
      return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Mock data for admin dashboard
  const systemStats = {
    totalDogs: 127,
    adoptionsThisMonth: 23,
    adoptionsLastMonth: 18,
    totalVolunteers: 45,
    activeVolunteers: 32,
    totalStaff: 8,
    activeStaff: 6,
    monthlyDonations: 15420,
    lastMonthDonations: 12800,
    operatingCosts: 18500,
    adoptionRate: 78
  };

  const recentUsers = [
    {
      id: 1,
      name: "Jessica Wilson",
      email: "jessica@email.com",
      role: "volunteer",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "David Brown",
      email: "david@email.com",
      role: "staff",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "1 day ago"
    },
    {
      id: 3,
      name: "Lisa Garcia",
      email: "lisa@email.com",
      role: "volunteer",
      status: "inactive",
      joinDate: "2024-01-08",
      lastActive: "1 week ago"
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Low Medical Supplies",
      message: "Vaccination supplies running low - reorder needed",
      timestamp: "2 hours ago",
      priority: "high"
    },
    {
      id: 2,
      type: "info",
      title: "Volunteer Training Scheduled",
      message: "New volunteer orientation scheduled for Saturday",
      timestamp: "4 hours ago",
      priority: "medium"
    },
    {
      id: 3,
      type: "success",
      title: "Monthly Goal Achieved",
      message: "Adoption goal for January exceeded by 15%",
      timestamp: "1 day ago",
      priority: "low"
    }
  ];

  const adoptionMetrics = [
    { month: "Sep", adoptions: 15, applications: 28 },
    { month: "Oct", adoptions: 18, applications: 32 },
    { month: "Nov", adoptions: 22, applications: 35 },
    { month: "Dec", adoptions: 19, applications: 30 },
    { month: "Jan", adoptions: 23, applications: 38 }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-gray-300 bg-gray-50";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive";
      case "staff":
        return "bg-warning/10 text-warning";
      case "volunteer":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-destructive to-destructive/80 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Admin Dashboard - {user.name.split(" ")[0]}</h1>
              <p className="text-destructive-foreground/80">
                System overview: {systemStats.totalDogs} dogs, {systemStats.totalVolunteers} volunteers, {systemStats.adoptionsThisMonth} adoptions this month.
              </p>
            </div>
            <Shield className="w-16 h-16 text-white/20" />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dogs</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{systemStats.totalDogs}</div>
              <p className="text-xs text-muted-foreground">
                {systemStats.adoptionRate}% adoption rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Adoptions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{systemStats.adoptionsThisMonth}</div>
              <p className="text-xs text-green-600">
                +{systemStats.adoptionsThisMonth - systemStats.adoptionsLastMonth} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{systemStats.activeVolunteers + systemStats.activeStaff}</div>
              <p className="text-xs text-muted-foreground">
                {systemStats.activeVolunteers} volunteers, {systemStats.activeStaff} staff
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${systemStats.monthlyDonations.toLocaleString()}</div>
              <p className="text-xs text-green-600">
                +{Math.round(((systemStats.monthlyDonations - systemStats.lastMonthDonations) / systemStats.lastMonthDonations) * 100)}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              System Alerts
            </CardTitle>
            <CardDescription>
              Important notifications and system status updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 border-l-4 rounded-lg ${getAlertColor(alert.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <h4 className="font-semibold text-sm">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{alert.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Adoption Trends
                  </CardTitle>
                  <CardDescription>
                    Monthly adoption statistics and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adoptionMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium w-8">{metric.month}</span>
                          <div className="flex-1">
                            <Progress value={(metric.adoptions / 30) * 100} className="h-2" />
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {metric.adoptions}/{metric.applications}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Overview
                  </CardTitle>
                  <CardDescription>
                    Monthly financial summary and budget tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Donations</span>
                      <span className="text-lg font-bold text-green-600">
                        ${systemStats.monthlyDonations.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Operating Costs</span>
                      <span className="text-lg font-bold text-red-600">
                        ${systemStats.operatingCosts.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Net Income</span>
                        <span className={`text-lg font-bold ${
                          systemStats.monthlyDonations - systemStats.operatingCosts > 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          ${(systemStats.monthlyDonations - systemStats.operatingCosts).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage system users, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Recent Users</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Add User
                      </Button>
                      <Button size="sm" variant="outline">
                        Export Users
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-white">
                              {user.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            Last active: {user.lastActive}
                          </div>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  System Reports
                </CardTitle>
                <CardDescription>
                  Generate and view comprehensive system reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Adoption Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed adoption statistics and trends
                    </p>
                    <Button size="sm" className="w-full">Generate Report</Button>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Volunteer Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Volunteer hours, activities, and performance
                    </p>
                    <Button size="sm" className="w-full">Generate Report</Button>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Financial Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Income, expenses, and budget analysis
                    </p>
                    <Button size="sm" className="w-full">Generate Report</Button>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Medical Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Health records and medical care statistics
                    </p>
                    <Button size="sm" className="w-full">Generate Report</Button>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Operational Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Daily operations and task completion
                    </p>
                    <Button size="sm" className="w-full">Generate Report</Button>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Custom Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create custom reports with specific metrics
                    </p>
                    <Button size="sm" className="w-full">Create Custom</Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system preferences and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Security Settings</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage authentication, permissions, and access controls
                      </p>
                      <Button size="sm">Configure Security</Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Notification Settings</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure system alerts and email notifications
                      </p>
                      <Button size="sm">Manage Notifications</Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Backup & Recovery</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Schedule backups and manage data recovery
                      </p>
                      <Button size="sm">Backup Settings</Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Integration Settings</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure third-party integrations and APIs
                      </p>
                      <Button size="sm">Manage Integrations</Button>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;