import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Activity,
  TrendingUp,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

interface User {
  email: string;
  role: string;
  name: string;
}

const StaffDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "staff") {
      navigate("/login");
      return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Mock data for staff dashboard
  const dogs = [
    {
      id: 1,
      name: "Buddy",
      breed: "Golden Retriever",
      age: "3 years",
      status: "Available",
      medicalStatus: "Up to date",
      lastCheckup: "2024-01-15",
      notes: "Friendly, good with kids",
      urgency: "low"
    },
    {
      id: 2,
      name: "Luna",
      breed: "German Shepherd Mix",
      age: "2 years",
      status: "Medical Care",
      medicalStatus: "Treatment needed",
      lastCheckup: "2024-01-18",
      notes: "Recovering from surgery",
      urgency: "high"
    },
    {
      id: 3,
      name: "Max",
      breed: "Labrador",
      age: "5 years",
      status: "Adoption Pending",
      medicalStatus: "Up to date",
      lastCheckup: "2024-01-10",
      notes: "Meet & greet scheduled",
      urgency: "medium"
    }
  ];

  const volunteers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@email.com",
      phone: "(555) 123-4567",
      nextShift: "Today 2:00 PM",
      hoursThisMonth: 18,
      status: "active",
      specialties: ["Dog Walking", "Feeding"]
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@email.com",
      phone: "(555) 234-5678",
      nextShift: "Tomorrow 9:00 AM",
      hoursThisMonth: 22,
      status: "active",
      specialties: ["Training", "Socialization"]
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@email.com",
      phone: "(555) 345-6789",
      nextShift: "Friday 1:00 PM",
      hoursThisMonth: 15,
      status: "inactive",
      specialties: ["Medical Care", "Administration"]
    }
  ];

  const dailyTasks = [
    {
      id: 1,
      title: "Morning Feeding Round",
      assignedTo: "Sarah Johnson",
      status: "completed",
      time: "8:00 AM",
      priority: "high"
    },
    {
      id: 2,
      title: "Medication Administration",
      assignedTo: "Mike Chen",
      status: "in-progress",
      time: "10:00 AM",
      priority: "high"
    },
    {
      id: 3,
      title: "Kennel Cleaning - Block A",
      assignedTo: "Emily Davis",
      status: "pending",
      time: "2:00 PM",
      priority: "medium"
    },
    {
      id: 4,
      title: "Adoption Interview",
      assignedTo: "Staff",
      status: "scheduled",
      time: "3:30 PM",
      priority: "high"
    }
  ];

  const stats = {
    totalDogs: 47,
    availableForAdoption: 32,
    inMedicalCare: 8,
    adoptionsPending: 7,
    activeVolunteers: 23,
    scheduledToday: 12,
    tasksCompleted: 15,
    tasksPending: 8
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800";
      case "medical care":
        return "bg-red-100 text-red-800";
      case "adoption pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Activity className="w-4 h-4 text-blue-500" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-warning to-warning/80 rounded-xl p-6 text-black">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Staff Dashboard - {user.name.split(" ")[0]}</h1>
              <p className="text-black/80">
                Managing {stats.totalDogs} dogs with {stats.activeVolunteers} active volunteers today.
              </p>
            </div>
            <Users className="w-16 h-16 text-black/20" />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dogs</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalDogs}</div>
              <p className="text-xs text-muted-foreground">
                {stats.availableForAdoption} available for adoption
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.activeVolunteers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.scheduledToday} scheduled today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Care</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.inMedicalCare}</div>
              <p className="text-xs text-muted-foreground">
                Dogs requiring attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.tasksCompleted}</div>
              <p className="text-xs text-muted-foreground">
                {stats.tasksPending} pending completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dogs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dogs">Dog Management</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="tasks">Daily Tasks</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
          </TabsList>

          <TabsContent value="dogs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Dog Management
                </CardTitle>
                <CardDescription>
                  Monitor and manage all dogs in the shelter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dogs.map((dog) => (
                    <div key={dog.id} className={`p-4 border-l-4 border rounded-lg ${getUrgencyColor(dog.urgency)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-semibold text-lg">{dog.name}</h3>
                            <p className="text-sm text-muted-foreground">{dog.breed} • {dog.age}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(dog.status)}>
                          {dog.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Medical Status:</span>
                          <p className="text-muted-foreground">{dog.medicalStatus}</p>
                        </div>
                        <div>
                          <span className="font-medium">Last Checkup:</span>
                          <p className="text-muted-foreground">{dog.lastCheckup}</p>
                        </div>
                        <div>
                          <span className="font-medium">Notes:</span>
                          <p className="text-muted-foreground">{dog.notes}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">View Profile</Button>
                        <Button size="sm" variant="outline">Medical Records</Button>
                        <Button size="sm" variant="outline">Update Status</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Volunteer Management
                </CardTitle>
                <CardDescription>
                  Manage volunteer schedules and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {volunteers.map((volunteer) => (
                    <div key={volunteer.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-white">
                              {volunteer.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{volunteer.name}</h3>
                            <p className="text-sm text-muted-foreground">{volunteer.hoursThisMonth} hours this month</p>
                          </div>
                        </div>
                        <Badge variant={volunteer.status === "active" ? "default" : "secondary"}>
                          {volunteer.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{volunteer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{volunteer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Next: {volunteer.nextShift}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>Specialties: {volunteer.specialties.join(", ")}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Schedule</Button>
                        <Button size="sm" variant="outline">Assign Task</Button>
                        <Button size="sm" variant="outline">Contact</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Daily Tasks
                </CardTitle>
                <CardDescription>
                  Track and manage daily shelter operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTaskStatusIcon(task.status)}
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Assigned to: {task.assignedTo} • {task.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}>
                          {task.priority}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule Management
                </CardTitle>
                <CardDescription>
                  Manage volunteer schedules and shift assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Schedule Management</h3>
                  <p className="text-muted-foreground mb-4">
                    View and manage volunteer schedules, assign shifts, and track attendance.
                  </p>
                  <Button>Open Schedule Manager</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;