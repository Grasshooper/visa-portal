
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container max-w-4xl py-12 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="space-y-12">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary animate-float"
              >
                <path d="M3 11h18" />
                <path d="M5 11V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v4" />
                <path d="M8 11v5c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-5" />
                <path d="M6 7h12" />
                <path d="M11 16H9" />
                <path d="M15 16h-2" />
                <path d="M18 11V7" />
                <path d="M20 11V7" />
                <path d="M22 11V7" />
                <path d="M2 11v4c0 1.1.9 2 2 2h3" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              About visa4U
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Supporting your immigration journey with expertise and technology.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 rounded-lg p-8 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                viewBox="0 0 24 24"
                fill="none"
                className="text-primary"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
                <path
                  d="M12 6v6l4 2"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M4.93 5.93l2.83 2.83"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M19.07 5.93l-2.83 2.83"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M15.93 16.07l-2.83 2.83"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M8.07 18.9l2.83-2.83"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground">
                At visa4U, we believe in making the immigration process more
                accessible, transparent, and efficient for everyone. Our
                platform connects immigrants with legal representatives and
                provides tools to streamline case management.
              </p>
              <h2 className="text-2xl font-bold">Our Values</h2>
              <ul className="list-none space-y-2 text-muted-foreground">
                {[
                  "Transparency in all processes",
                  "Accessibility for clients of all backgrounds",
                  "Technological innovation that simplifies complexity",
                  "Compassion for the challenges immigrants face",
                  "Excellence in legal representation"
                ].map((value, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M20 6L9 17L4 12" />
                    </svg>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Our Team</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: "Jane Doe",
                  role: "Founder & CEO",
                  description: "Immigration attorney with over 15 years of experience.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  )
                },
                {
                  name: "John Smith",
                  role: "Technical Director",
                  description: "Expert in legal tech solutions and automation.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <rect x="3" y="4" width="18" height="12" rx="2" ry="2" />
                      <line x1="3" y1="20" x2="21" y2="20" />
                      <line x1="12" y1="20" x2="12" y2="16" />
                    </svg>
                  )
                },
                {
                  name: "Maria Garcia",
                  role: "Client Support Lead",
                  description: "Dedicated to ensuring client success through every step.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <path d="M12 8v4" />
                      <path d="M12 15h.01" />
                    </svg>
                  )
                }
              ].map((member, i) => (
                <div key={i} className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300">
                  <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    {member.icon}
                  </div>
                  <h3 className="font-bold text-lg text-center">{member.name}</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    {member.role}
                  </p>
                  <p className="mt-2 text-sm text-center">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted p-8 rounded-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center mb-6 relative z-10">
              Get Started Today
            </h2>
            <div className="flex justify-center gap-4 relative z-10">
              <Button asChild className="gap-2">
                <Link to="/register">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  Create Account
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/contact">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
