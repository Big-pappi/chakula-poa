"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, Download, Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Loading = () => null;

export default function StaffHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMeal, setFilterMeal] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const searchParams = useSearchParams();

  const servingHistory = [
    { id: 1, studentName: "John Makundi", cps: "CPS-2024-001", meal: "Lunch", date: "2024-01-15", time: "12:45 PM", status: "success" },
    { id: 2, studentName: "Mary Kessy", cps: "CPS-2024-042", meal: "Lunch", date: "2024-01-15", time: "12:43 PM", status: "success" },
    { id: 3, studentName: "Peter Mwanga", cps: "CPS-2024-089", meal: "Breakfast", date: "2024-01-15", time: "08:30 AM", status: "success" },
    { id: 4, studentName: "Grace Mushi", cps: "CPS-2024-156", meal: "Dinner", date: "2024-01-14", time: "06:38 PM", status: "failed" },
    { id: 5, studentName: "David Lyimo", cps: "CPS-2024-203", meal: "Lunch", date: "2024-01-14", time: "12:35 PM", status: "success" },
    { id: 6, studentName: "Sarah Mwita", cps: "CPS-2024-078", meal: "Breakfast", date: "2024-01-14", time: "07:45 AM", status: "success" },
    { id: 7, studentName: "Michael Swai", cps: "CPS-2024-112", meal: "Dinner", date: "2024-01-13", time: "07:00 PM", status: "success" },
    { id: 8, studentName: "Anna Mwakyusa", cps: "CPS-2024-189", meal: "Lunch", date: "2024-01-13", time: "01:15 PM", status: "failed" },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/staff">Staff</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Serving History</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <History className="h-8 w-8" />
                Serving History
              </h1>
              <p className="text-muted-foreground">View your meal serving records</p>
            </div>
            <Button variant="outline" className="bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or CPS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterMeal} onValueChange={setFilterMeal}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Meal Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Meals</SelectItem>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Records</CardTitle>
              <CardDescription>Total {servingHistory.length} records found</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>CPS Number</TableHead>
                    <TableHead>Meal Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servingHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell>{record.cps}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{record.meal}</Badge>
                      </TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === "success" ? "default" : "destructive"}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </>
    </Suspense>
  );
}
