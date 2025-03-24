
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Calendar, FileText, Folder, MoreHorizontal, Plus, RefreshCw, Users } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { name: "Jan", cases: 40 },
  { name: "Feb", cases: 30 },
  { name: "Mar", cases: 20 },
  { name: "Apr", cases: 27 },
  { name: "May", cases: 18 },
  { name: "Jun", cases: 23 },
  { name: "Jul", cases: 34 },
];

const statusData = [
  { name: "Active", value: 45, color: "#1a73e8" },
  { name: "Pending", value: 30, color: "#f4b400" },
  { name: "Completed", value: 20, color: "#0f9d58" },
  { name: "Rejected", value: 5, color: "#d93025" },
];

const caseTypes = [
  { name: "Work Visa", count: 38 },
  { name: "Family Visa", count: 24 },
  { name: "Student Visa", count: 18 },
  { name: "Permanent Residency", count: 12 },
  { name: "Citizenship", count: 8 },
];

const recentCases = [
  {
    id: "CS-1024",
    name: "Emma Wilson",
    type: "Work Visa",
    status: "In Progress",
    updated: "1 hour ago",
    progress: 65,
  },
  {
    id: "CS-1023",
    name: "Alex Johnson",
    type: "Student Visa",
    status: "Document Review",
    updated: "3 hours ago",
    progress: 40,
  },
  {
    id: "CS-1022",
    name: "Maya Patel",
    type: "Family Visa",
    status: "Interview Scheduled",
    updated: "1 day ago",
    progress: 75,
  },
  {
    id: "CS-1021",
    name: "Daniel Kim",
    type: "Permanent Residency",
    status: "Background Check",
    updated: "2 days ago",
    progress: 30,
  },
];

const upcomingEvents = [
  {
    id: "EVT-001",
    title: "Interview with Emma Wilson",
    date: "Today, 2:00 PM",
    type: "Interview",
  },
  {
    id: "EVT-002",
    title: "Document Submission Deadline",
    date: "Tomorrow, 5:00 PM",
    type: "Deadline",
  },
  {
    id: "EVT-003",
    title: "Team Meeting - Case Reviews",
    date: "Wed, 10:00 AM",
    type: "Meeting",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Document Review":
      return "bg-purple-100 text-purple-800";
    case "Interview Scheduled":
      return "bg-green-100 text-green-800";
    case "Background Check":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "Interview":
      return "bg-green-100 text-green-800";
    case "Deadline":
      return "bg-red-100 text-red-800";
    case "Meeting":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your immigration cases.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button size="sm" className="h-8 gap-1" asChild>
              <Link to="/cases/new">
                <Plus className="h-3.5 w-3.5" />
                <span>New Case</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">54</div>
              <p className="text-xs text-muted-foreground">
                +3 from last month
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">
                +5 from last month
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14</div>
              <p className="text-xs text-muted-foreground">
                Next: Today at 2:00 PM
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1 lg:col-span-2 glass-card">
                <CardHeader>
                  <CardTitle>Case Activity</CardTitle>
                  <CardDescription>
                    Case submissions per month
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={data}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="#94a3b8"
                          fontSize={12}
                        />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="cases"
                          stroke="#1a73e8"
                          fill="#1a73e8"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Case Status</CardTitle>
                  <CardDescription>
                    Distribution by current status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            value,
                            index,
                          }) => {
                            const RADIAN = Math.PI / 180;
                            const radius =
                              25 + innerRadius + (outerRadius - innerRadius);
                            const x =
                              cx +
                              radius *
                                Math.cos(-midAngle * RADIAN);
                            const y =
                              cy +
                              radius *
                                Math.sin(-midAngle * RADIAN);

                            return (
                              <text
                                x={x}
                                y={y}
                                textAnchor={
                                  x > cx ? "start" : "end"
                                }
                                dominantBaseline="central"
                                className="text-xs font-medium"
                                fill="#64748b"
                              >
                                {statusData[index].name} ({value})
                              </text>
                            );
                          }}
                        >
                          {statusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Cases</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCases.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/placeholder.svg" alt={item.name} />
                          <AvatarFallback>
                            {item.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium leading-none">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.id}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {item.type}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </Badge>
                          </div>
                          <div className="pt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>{item.progress}%</span>
                              <span>{item.updated}</span>
                            </div>
                            <Progress value={item.progress} className="h-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Events</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start space-x-4 rounded-md p-3 transition-all hover:bg-muted/50"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">
                              {event.title}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getEventTypeColor(
                                event.type
                              )}`}
                            >
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {event.date}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      View Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Case Types Distribution</CardTitle>
                <CardDescription>
                  Analysis of current case types
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={caseTypes}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        scale="band"
                        stroke="#94a3b8"
                        fontSize={12}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#1a73e8"
                        barSize={30}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Generate and view immigration case reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Case Status Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground">
                        Summary of all cases by current status.
                      </p>
                      <Button className="w-full mt-4" variant="outline">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Case Processing Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground">
                        Analysis of case processing times by type.
                      </p>
                      <Button className="w-full mt-4" variant="outline">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Document Expiration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground">
                        List of documents expiring in the next 90 days.
                      </p>
                      <Button className="w-full mt-4" variant="outline">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Client Demographics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground">
                        Demographic analysis of immigration clients.
                      </p>
                      <Button className="w-full mt-4" variant="outline">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <Button className="w-full">Create Custom Report</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
