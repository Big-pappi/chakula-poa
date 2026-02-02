"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Shield,
  Activity,
  Server,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const systemStats = [
    { title: "Total Universities", value: "12", change: "+2", icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Students", value: "15,678", change: "+856", icon: Users, color: "text-green-600", bg: "bg-green-50" },
    { title: "Active Subscriptions", value: "12,456", change: "+1,234", icon: CreditCard, color: "text-primary", bg: "bg-primary/10" },
    { title: "Monthly Revenue", value: "TSh 892M", change: "+15%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const universities = [
    { name: "University of Dar es Salaam", code: "UDSM", students: 4567, revenue: "TSh 245M", status: "active" },
    { name: "University of Dodoma", code: "UDOM", students: 3245, revenue: "TSh 178M", status: "active" },
    { name: "Sokoine University", code: "SUA", students: 2890, revenue: "TSh 156M", status: "active" },
    { name: "Mzumbe University", code: "MU", students: 2134, revenue: "TSh 112M", status: "maintenance" },
    { name: "Ardhi University", code: "ARU", students: 1456, revenue: "TSh 78M", status: "active" },
  ];

  const systemHealth = [
    { service: "API Gateway", status: "operational", uptime: "99.9%" },
    { service: "Database", status: "operational", uptime: "99.8%" },
    { service: "Payment Gateway", status: "operational", uptime: "99.7%" },
    { service: "USSD Service", status: "degraded", uptime: "98.2%" },
  ];

  const recentActivity = [
    { action: "New university onboarded", detail: "Ardhi University", time: "2 hours ago", type: "success" },
    { action: "System maintenance completed", detail: "Database optimization", time: "5 hours ago", type: "info" },
    { action: "Payment gateway updated", detail: "M-Pesa integration v2.1", time: "1 day ago", type: "success" },
    { action: "Security patch applied", detail: "Critical vulnerability fix", time: "2 days ago", type: "warning" },
  ];

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-semibold">Super Admin</span>
        </div>
        <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
          System Administrator
        </Badge>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
            <p className="text-muted-foreground">Manage all universities and system-wide settings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent" asChild>
              <Link href="/super-admin/system">System Settings</Link>
            </Button>
            <Button asChild>
              <Link href="/super-admin/universities/new">Add University</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {systemStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  {stat.change} this month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Universities
                  </CardTitle>
                  <CardDescription>All registered universities in the system</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent" asChild>
                  <Link href="/super-admin/universities">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {universities.map((uni) => (
                  <div key={uni.code} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {uni.code}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{uni.name}</p>
                        <p className="text-sm text-muted-foreground">{uni.students.toLocaleString()} students</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{uni.revenue}</p>
                        <p className="text-xs text-muted-foreground">Monthly revenue</p>
                      </div>
                      <Badge variant={uni.status === "active" ? "default" : "secondary"}>
                        {uni.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemHealth.map((service) => (
                  <div key={service.service} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {service.status === "operational" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      )}
                      <span className="text-sm">{service.service}</span>
                    </div>
                    <Badge variant={service.status === "operational" ? "outline" : "secondary"} className="text-xs">
                      {service.uptime}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="border-l-2 border-primary/20 pl-4">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
