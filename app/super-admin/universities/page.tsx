"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Building2, Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Settings, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default function SuperAdminUniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const searchParams = useSearchParams();

  const universities = [
    { id: 1, name: "University of Dar es Salaam", code: "UDSM", location: "Dar es Salaam", students: 4567, staff: 45, admins: 3, status: "active", createdAt: "2023-01-15" },
    { id: 2, name: "University of Dodoma", code: "UDOM", location: "Dodoma", students: 3245, staff: 32, admins: 2, status: "active", createdAt: "2023-02-20" },
    { id: 3, name: "Sokoine University of Agriculture", code: "SUA", location: "Morogoro", students: 2890, staff: 28, admins: 2, status: "active", createdAt: "2023-03-10" },
    { id: 4, name: "Mzumbe University", code: "MU", location: "Morogoro", students: 2134, staff: 21, admins: 2, status: "maintenance", createdAt: "2023-04-05" },
    { id: 5, name: "Ardhi University", code: "ARU", location: "Dar es Salaam", students: 1456, staff: 15, admins: 1, status: "active", createdAt: "2023-05-12" },
    { id: 6, name: "Open University of Tanzania", code: "OUT", location: "Dar es Salaam", students: 1234, staff: 12, admins: 1, status: "active", createdAt: "2023-06-18" },
  ];

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Suspense fallback={<Loading />}>
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Universities Management</h1>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Building2 className="h-8 w-8" />
                Universities
              </h1>
              <p className="text-muted-foreground">Manage all registered universities</p>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add University
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New University</DialogTitle>
                  <DialogDescription>Register a new university to the Chakula Poa system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>University Name</Label>
                    <Input placeholder="e.g., University of Dar es Salaam" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Short Code</Label>
                      <Input placeholder="e.g., UDSM" />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input placeholder="e.g., Dar es Salaam" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Admin Email</Label>
                    <Input type="email" placeholder="admin@university.ac.tz" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input placeholder="+255 xxx xxx xxx" />
                  </div>
                  <Button className="w-full" onClick={() => setShowAddDialog(false)}>
                    Register University
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>All Universities</CardTitle>
                  <CardDescription>{filteredUniversities.length} universities registered</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search universities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>University</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUniversities.map((uni) => (
                    <TableRow key={uni.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                              {uni.code}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{uni.name}</p>
                            <p className="text-sm text-muted-foreground">{uni.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{uni.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {uni.students.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>{uni.staff}</TableCell>
                      <TableCell>
                        <Badge variant={uni.status === "active" ? "default" : "secondary"}>
                          {uni.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
