"use client";

import { useState, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scan, Users, UtensilsCrossed, CheckCircle2, XCircle, Clock, Search, QrCode, Hash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Loading from "./loading";

export default function StaffDashboard() {
  const searchParams = useSearchParams();
  const [cpsNumber, setCpsNumber] = useState("");
  const [searchResult, setSearchResult] = useState<null | {
    name: string;
    cps: string;
    plan: string;
    mealsLeft: number;
    status: string;
  }>(null);
  const [showServeDialog, setShowServeDialog] = useState(false);
  const [mealType, setMealType] = useState("");

  const stats = [
    { title: "Meals Served Today", value: "234", icon: UtensilsCrossed, color: "text-primary" },
    { title: "Students Verified", value: "198", icon: CheckCircle2, color: "text-green-600" },
    { title: "Pending Queue", value: "12", icon: Clock, color: "text-amber-600" },
    { title: "Failed Verifications", value: "3", icon: XCircle, color: "text-red-600" },
  ];

  const recentServes = [
    { id: 1, name: "John Makundi", cps: "CPS-2024-001", meal: "Lunch", time: "12:45 PM", status: "success" },
    { id: 2, name: "Mary Kessy", cps: "CPS-2024-042", meal: "Lunch", time: "12:43 PM", status: "success" },
    { id: 3, name: "Peter Mwanga", cps: "CPS-2024-089", meal: "Lunch", time: "12:40 PM", status: "success" },
    { id: 4, name: "Grace Mushi", cps: "CPS-2024-156", meal: "Lunch", time: "12:38 PM", status: "failed" },
    { id: 5, name: "David Lyimo", cps: "CPS-2024-203", meal: "Lunch", time: "12:35 PM", status: "success" },
  ];

  const handleSearch = () => {
    if (cpsNumber.trim()) {
      setSearchResult({
        name: "John Makundi",
        cps: cpsNumber,
        plan: "Monthly Plan",
        mealsLeft: 45,
        status: "active",
      });
    }
  };

  const handleServeMeal = () => {
    setShowServeDialog(false);
    setSearchResult(null);
    setCpsNumber("");
    setMealType("");
  };

  return (
    <Suspense fallback={<Loading />}>
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Staff Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, Staff Member</h1>
            <p className="text-muted-foreground">Verify students and serve meals efficiently</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Verify Student
                </CardTitle>
                <CardDescription>Enter CPS number or scan QR code to verify student</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Enter CPS Number (e.g., CPS-2024-001)"
                      value={cpsNumber}
                      onChange={(e) => setCpsNumber(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={handleSearch}>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <Separator className="flex-1" />
                  <span className="text-sm text-muted-foreground">or</span>
                  <Separator className="flex-1" />
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR Code
                </Button>

                {searchResult && (
                  <Card className="border-primary">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-primary/10 text-primary text-xl">
                              {searchResult.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">{searchResult.name}</h3>
                            <p className="text-sm text-muted-foreground">{searchResult.cps}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge variant="secondary">{searchResult.plan}</Badge>
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Meals Remaining</p>
                          <p className="text-2xl font-bold text-primary">{searchResult.mealsLeft}</p>
                        </div>
                      </div>
                      <Button className="mt-4 w-full" onClick={() => setShowServeDialog(true)}>
                        <UtensilsCrossed className="mr-2 h-4 w-4" />
                        Serve Meal
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest meal serving activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentServes.map((serve) => (
                    <div key={serve.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {serve.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{serve.name}</p>
                          <p className="text-sm text-muted-foreground">{serve.cps}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={serve.status === "success" ? "default" : "destructive"}>
                          {serve.meal}
                        </Badge>
                        <p className="mt-1 text-xs text-muted-foreground">{serve.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Dialog open={showServeDialog} onOpenChange={setShowServeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Meal Service</DialogTitle>
              <DialogDescription>Select the meal type to serve to {searchResult?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Meal Type</Label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleServeMeal} className="w-full" disabled={!mealType}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirm & Serve
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </Suspense>
  );
}
