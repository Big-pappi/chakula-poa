"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, Filter, Calendar } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default function StaffCollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mealFilter, setMealFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const collections = [
    { id: "1", studentName: "John Mwamba", cpsNumber: "CPS-2024-001", mealType: "Breakfast", status: "collected", time: "07:30 AM", date: "2024-01-15" },
    { id: "2", studentName: "Grace Kileo", cpsNumber: "CPS-2024-042", mealType: "Lunch", status: "collected", time: "12:42 PM", date: "2024-01-15" },
    { id: "3", studentName: "Peter Makundi", cpsNumber: "CPS-2024-089", mealType: "Lunch", status: "pending", time: "12:40 PM", date: "2024-01-15" },
    { id: "4", studentName: "Amina Hassan", cpsNumber: "CPS-2024-156", mealType: "Dinner", status: "collected", time: "18:38 PM", date: "2024-01-15" },
    { id: "5", studentName: "David Kimaro", cpsNumber: "CPS-2024-203", mealType: "Lunch", status: "expired", time: "12:35 PM", date: "2024-01-15" },
    { id: "6", studentName: "Sarah Mushi", cpsNumber: "CPS-2024-087", mealType: "Breakfast", status: "collected", time: "08:15 AM", date: "2024-01-15" },
    { id: "7", studentName: "Michael Njau", cpsNumber: "CPS-2024-134", mealType: "Lunch", status: "collected", time: "13:00 PM", date: "2024-01-15" },
    { id: "8", studentName: "Elizabeth Mgaya", cpsNumber: "CPS-2024-178", mealType: "Dinner", status: "pending", time: "19:00 PM", date: "2024-01-15" },
  ];

  const filteredCollections = collections.filter((c) => {
    const matchesSearch = c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.cpsNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMeal = mealFilter === "all" || c.mealType.toLowerCase() === mealFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesMeal && matchesStatus;
  });

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Collection History</h1>
            <p className="text-sm text-muted-foreground">View all meal collections</p>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>All Collections</CardTitle>
                  <CardDescription>Complete history of meal collections at your station</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or CPS number..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={mealFilter} onValueChange={setMealFilter}>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="collected">Collected</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>CPS Number</TableHead>
                    <TableHead>Meal Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell className="font-medium">{collection.studentName}</TableCell>
                      <TableCell>{collection.cpsNumber}</TableCell>
                      <TableCell>{collection.mealType}</TableCell>
                      <TableCell>{collection.date}</TableCell>
                      <TableCell>{collection.time}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            collection.status === "collected"
                              ? "default"
                              : collection.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {collection.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </Suspense>
  );
}
