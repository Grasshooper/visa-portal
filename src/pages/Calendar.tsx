
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

const eventTypes = [
  {
    name: "Interview",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    name: "Meeting",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    name: "Deadline",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  {
    name: "Document Submission",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    name: "Training",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
];

const upcomingEvents = [
  {
    id: "EVT-001",
    title: "Interview with Emma Wilson",
    description: "Work Visa Application Interview",
    date: new Date(2023, 7, 12, 14, 0),
    type: "Interview",
    location: "Immigration Office - Room 305",
    attendees: ["Sarah Kim", "Emma Wilson"],
  },
  {
    id: "EVT-002",
    title: "Document Submission Deadline",
    description: "Last day to submit supporting documents for Case CS-1024",
    date: new Date(2023, 7, 13, 17, 0),
    type: "Deadline",
    location: "Online Portal",
    attendees: ["John Davis"],
  },
  {
    id: "EVT-003",
    title: "Team Meeting - Case Reviews",
    description: "Weekly case review with the immigration team",
    date: new Date(2023, 7, 15, 10, 0),
    type: "Meeting",
    location: "Conference Room A",
    attendees: ["Sarah Kim", "John Davis", "Michael Chen", "Lisa Wang"],
  },
  {
    id: "EVT-004",
    title: "New Immigration Policies Training",
    description: "Training session on updated immigration regulations",
    date: new Date(2023, 7, 18, 9, 0),
    type: "Training",
    location: "Training Center",
    attendees: ["All Staff"],
  },
  {
    id: "EVT-005",
    title: "Submit Alex Johnson's Documents",
    description: "Upload all collected documents for visa processing",
    date: new Date(2023, 7, 20, 15, 0),
    type: "Document Submission",
    location: "Online Portal",
    attendees: ["John Davis"],
  },
];

const getEventTypeColor = (type: string) => {
  const eventType = eventTypes.find((t) => t.name === type);
  return eventType ? eventType.color : "bg-gray-100 text-gray-800";
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  const filterEventsByDay = (day: Date | undefined) => {
    if (!day) return [];
    return upcomingEvents.filter(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear()
    );
  };

  const sortEventsByTime = (events: typeof upcomingEvents) => {
    return [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const selectedDayEvents = sortEventsByTime(filterEventsByDay(date));

  return (
    <DashboardLayout title="Calendar">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">
              Manage appointments, deadlines and events.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="month">
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="agenda">Agenda</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Event</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="glass-card col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {date?.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      const newDate = new Date(date!);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setDate(newDate);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous month</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => setDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      const newDate = new Date(date!);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setDate(newDate);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next month</span>
                  </Button>
                </div>
              </div>
              <TabsList className="mt-2">
                <TabsTrigger
                  value="month"
                  onClick={() => setView("month")}
                  className={view === "month" ? "bg-primary text-white" : ""}
                >
                  Month
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  onClick={() => setView("week")}
                  className={view === "week" ? "bg-primary text-white" : ""}
                >
                  Week
                </TabsTrigger>
                <TabsTrigger
                  value="day"
                  onClick={() => setView("day")}
                  className={view === "day" ? "bg-primary text-white" : ""}
                >
                  Day
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="p-0 pl-2 pb-2 pr-2">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-3 pointer-events-auto rounded-md"
              />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {date
                  ? date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })
                  : "Selected Day"}
              </CardTitle>
              <CardDescription>
                {selectedDayEvents.length} events scheduled
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              {selectedDayEvents.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-auto pr-2">
                  {selectedDayEvents.map((event) => (
                    <Card
                      key={event.id}
                      className={`border-l-4 ${
                        getEventTypeColor(event.type).split(" ")[0]
                      } border-l-[3px]`}
                    >
                      <CardHeader className="p-3 pb-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-sm font-medium">
                              {event.title}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {formatTime(event.date)}
                            </CardDescription>
                          </div>
                          <Badge
                            variant="outline"
                            className={getEventTypeColor(event.type)}
                          >
                            {event.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <p className="text-xs text-muted-foreground mb-2">
                          {event.description}
                        </p>
                        <div className="text-xs">
                          <div className="flex items-start">
                            <span className="font-medium w-16">Location:</span>
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-start mt-1">
                            <span className="font-medium w-16">Attendees:</span>
                            <span>{event.attendees.join(", ")}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-3">
                    <CalendarComponent className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium mb-1">No Events</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    There are no events scheduled for this day.
                  </p>
                  <Button size="sm" className="h-8 gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Event</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your scheduled events for the next 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortEventsByTime(upcomingEvents).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-4 rounded-md p-3 transition-all hover:bg-muted/50 border border-border"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {event.title}
                      </p>
                      <Badge
                        variant="outline"
                        className={getEventTypeColor(event.type)}
                      >
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {event.description}
                    </p>
                    <div className="flex justify-between items-center pt-2 text-xs">
                      <div>
                        <span className="font-medium">{formatDate(event.date)}</span> at{" "}
                        <span className="font-medium">{formatTime(event.date)}</span>
                      </div>
                      <div>
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
