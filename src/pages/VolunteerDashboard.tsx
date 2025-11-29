import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Users,
  Award,
  MapPin,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { useAuth } from "@/contexts/AuthContext";

const VolunteerDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Get user name from metadata or fallback to email
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "Volunteer";
  const userEmail = user.email || "";

  // Mock data for volunteer dashboard
  const upcomingShifts = [
    {
      id: 1,
      title: "Dog Walking & Exercise",
      date: "Today",
      time: "2:00 PM - 4:00 PM",
      location: "Main Shelter",
      status: "confirmed",
      dogs: ["Buddy", "Luna", "Max"]
    },
    {
      id: 2,
      title: "Feeding & Care",
      date: "Tomorrow",
      time: "8:00 AM - 10:00 AM",
      location: "Puppy Ward",
      status: "confirmed",
      dogs: ["Bella", "Charlie", "Daisy"]
    },
    {
      id: 3,
      title: "Adoption Event Setup",
      date: "Saturday",
      time: "9:00 AM - 1:00 PM",
      location: "Community Center",
      status: "pending",
      dogs: []
    }
  ];

  const recentTasks = [
    {
      id: 1,
      title: "Socialization with Rescue Dogs",
      completed: true,
      date: "Yesterday",
      hours: 3,
      notes: "Great progress with shy dogs"
    },
    {
      id: 2,
      title: "Kennel Cleaning & Maintenance",
      completed: true,
      date: "2 days ago",
      hours: 2,
      notes: "All kennels sanitized"
    },
    {
      id: 3,
      title: "Volunteer Training Session",
      completed: false,
      date: "Pending",
      hours: 0,
      notes: "Advanced dog handling techniques"
    }
  ];

  const stats = {
    totalHours: 127,
    monthlyGoal: 20,
    currentMonth: 18,
    dogsHelped: 45,
    tasksCompleted: 23,
    upcomingShifts: 3
  };

  const achievements = [
    { title: "First Month Complete", icon: Award, earned: true },
    { title: "50 Hours Milestone", icon: Clock, earned: true },
    { title: "Dog Whisperer", icon: Heart, earned: true },
    { title: "Team Player", icon: Users, earned: false },
  ];

  return (
    <DashboardLayout user={{ name: userName, email: userEmail, role: "volunteer" }}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <FadeIn direction="down">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome back, {userName.split(" ")[0]}!</h1>
                <p className="text-primary-foreground/80">
                  You have {stats.upcomingShifts} upcoming shifts and {stats.currentMonth} hours logged this month.
                </p>
              </div>
              <Heart className="w-16 h-16 text-white/20" fill="currentColor" />
            </div>
          </div>
        </FadeIn>

        {/* Stats Overview */}
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggerItem>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.totalHours}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime volunteer hours
                </p>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.currentMonth}</div>
                <div className="mt-2">
                  <Progress value={(stats.currentMonth / stats.monthlyGoal) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.currentMonth}/{stats.monthlyGoal} hours goal
                  </p>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dogs Helped</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.dogsHelped}</div>
                <p className="text-xs text-muted-foreground">
                  Dogs you've worked with
                </p>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks Done</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.tasksCompleted}</div>
                <p className="text-xs text-muted-foreground">
                  Completed this month
                </p>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        {/* Main Content Tabs */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Shifts
                </CardTitle>
                <CardDescription>
                  Your scheduled volunteer activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingShifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{shift.title}</h3>
                          <Badge variant={shift.status === "confirmed" ? "default" : "secondary"}>
                            {shift.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {shift.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {shift.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {shift.location}
                          </span>
                        </div>
                        {shift.dogs.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm text-muted-foreground">Dogs: </span>
                            {shift.dogs.map((dog) => (
                              <Badge key={dog} variant="outline" className="mr-1">
                                {dog}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
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
                  <CheckCircle className="w-5 h-5" />
                  Recent Tasks
                </CardTitle>
                <CardDescription>
                  Your completed and pending volunteer tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        )}
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.notes}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{task.date}</div>
                        {task.hours > 0 && (
                          <div className="text-sm text-muted-foreground">{task.hours} hours</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Your volunteer milestones and badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg flex items-center gap-3 ${achievement.earned
                          ? "bg-primary/5 border-primary/20"
                          : "bg-muted/50 border-muted"
                        }`}
                    >
                      <achievement.icon
                        className={`w-8 h-8 ${achievement.earned ? "text-primary" : "text-muted-foreground"
                          }`}
                      />
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.earned ? "Earned!" : "In progress"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Volunteer Profile
                </CardTitle>
                <CardDescription>
                  Your volunteer information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p className="text-sm text-muted-foreground">{userName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{userEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Volunteer Since</label>
                      <p className="text-sm text-muted-foreground">March 2024</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Preferred Activities</label>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline">Dog Walking</Badge>
                        <Badge variant="outline">Feeding</Badge>
                        <Badge variant="outline">Socialization</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button>Edit Profile</Button>
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

export default VolunteerDashboard;