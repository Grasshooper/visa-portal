import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container max-w-4xl py-12 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              About visa4U
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Supporting your immigration journey with expertise and technology.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 rounded-lg p-8 aspect-square flex items-center justify-center">
              <div className="text-4xl font-bold text-center text-primary">
                visa4U
              </div>
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
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Transparency in all processes</li>
                <li>Accessibility for clients of all backgrounds</li>
                <li>Technological innovation that simplifies complexity</li>
                <li>Compassion for the challenges immigrants face</li>
                <li>Excellence in legal representation</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Our Team</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4"></div>
                <h3 className="font-bold text-lg text-center">Jane Doe</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Founder & CEO
                </p>
                <p className="mt-2 text-sm text-center">
                  Immigration attorney with over 15 years of experience.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4"></div>
                <h3 className="font-bold text-lg text-center">John Smith</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Technical Director
                </p>
                <p className="mt-2 text-sm text-center">
                  Expert in legal tech solutions and automation.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4"></div>
                <h3 className="font-bold text-lg text-center">Maria Garcia</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Client Support Lead
                </p>
                <p className="mt-2 text-sm text-center">
                  Dedicated to ensuring client success through every step.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              Get Started Today
            </h2>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link to="/register">Create Account</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
