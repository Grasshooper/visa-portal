
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ChevronRight, FileText, Folder, Globe, Shield, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-background to-background"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up">
              Modern Immigration Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up animation-delay-100">
              Streamline your immigration processes with our powerful, intuitive platform designed for immigration officers, applicants, and legal representatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up animation-delay-200">
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/demo">
                  Request a Demo
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative mx-auto max-w-5xl rounded-lg overflow-hidden shadow-card animate-fade-up animation-delay-300">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
              <div className="absolute inset-0 bg-immigration-primary/5 backdrop-blur-sm glass-panel rounded-lg border border-border/30">
                <div className="absolute top-0 left-0 right-0 h-8 bg-background/80 border-b border-border/30 flex items-center px-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="pt-8 p-4 md:p-8 h-full flex flex-col">
                  <div className="grid grid-cols-4 gap-4 h-full">
                    <div className="col-span-1 bg-background/80 rounded-lg border border-border/40 p-4">
                      <div className="space-y-2">
                        <div className="h-5 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="mt-4 h-8 bg-primary rounded w-full"></div>
                      </div>
                    </div>
                    <div className="col-span-3 bg-background/80 rounded-lg border border-border/40 p-4">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="space-y-4">
                          <div className="h-6 bg-muted rounded w-3/4"></div>
                          <div className="h-24 bg-muted rounded w-full"></div>
                          <div className="h-24 bg-muted rounded w-full"></div>
                        </div>
                        <div className="space-y-4">
                          <div className="h-6 bg-muted rounded w-1/2"></div>
                          <div className="h-52 bg-muted rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to efficiently manage immigration cases and documents in one secure platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card group hover:border-primary/20 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="bg-primary/10 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-2 text-primary">
                  <Folder className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Case Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Comprehensive tools to organize, track, and manage immigration cases efficiently from start to finish.
                </CardDescription>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Case timeline tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Deadline management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Custom case workflows</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card group hover:border-primary/20 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="bg-primary/10 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-2 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Document Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Secure storage, organization and retrieval of immigration documents with robust version control.
                </CardDescription>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Secure document repository</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Version history tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Document expiration alerts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Multi-Language Support card removed */}
            
            <Card className="glass-card group hover:border-primary/20 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="bg-primary/10 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-2 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Security & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Enterprise-grade security measures to protect sensitive immigration data and maintain compliance.
                </CardDescription>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>End-to-end encryption</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Role-based access control</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Audit logs and reporting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card group hover:border-primary/20 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="bg-primary/10 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-2 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Collaborative Workspace</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Tools for seamless collaboration between immigration officers, applicants, and legal representatives.
                </CardDescription>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>In-app messaging</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Comment threads</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Shared calendars</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card group hover:border-primary/20 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="bg-primary/10 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-2 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Analytics & Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Powerful analytics and customizable reports to gain insights and make data-driven decisions.
                </CardDescription>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Real-time dashboards</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Custom report builder</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Export capabilities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted By Immigration Professionals</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about the visa4U platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background rounded-lg p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
              </div>
              <p className="text-muted-foreground mb-6">
                "visa4U has completely transformed our workflow. The intuitive interface and powerful features have increased our efficiency by 40%."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">SF</span>
                </div>
                <div>
                  <p className="font-medium">Sarah Fisher</p>
                  <p className="text-sm text-muted-foreground">Immigration Attorney</p>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
              </div>
              <p className="text-muted-foreground mb-6">
                "The document management system is exceptional. Being able to track version history and set expiration alerts has been a game-changer for our firm."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">MR</span>
                </div>
                <div>
                  <p className="font-medium">Michael Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Immigration Consultant</p>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8" stroke="none" className="opacity-40"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
              </div>
              <p className="text-muted-foreground mb-6">
                "As a government official, the reporting features have made my job significantly easier. I can generate custom reports in minutes instead of hours."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">JT</span>
                </div>
                <div>
                  <p className="font-medium">Jennifer Thompson</p>
                  <p className="text-sm text-muted-foreground">Immigration Officer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Immigration Management?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of immigration professionals already using visa4U to streamline their processes and improve efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Get Started Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <SiteFooter />
    </div>
  );
};

export default Index;
