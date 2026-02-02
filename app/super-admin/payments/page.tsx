"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Search, Download, TrendingUp, ArrowUpRight, Wallet, Building2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Loading = () => null;

export default function SuperAdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  const stats = [
    { title: "Total Revenue", value: "TSh 2.4B", change: "+18%", icon: TrendingUp },
    { title: "This Month", value: "TSh 892M", change: "+15%", icon: Wallet },
    { title: "Transactions", value: "45,678", change: "+12%", icon: CreditCard },
  ];

  const transactions = [
    { id: "TXN-001", student: "John Makundi", university: "UDSM", amount: "TSh 180,000", method: "M-Pesa", status: "completed", date: "2024-01-15 14:30" },
    { id: "TXN-002", student: "Mary Kessy", university: "UDOM", amount: "TSh 650,000", method: "Airtel Money", status: "completed", date: "2024-01-15 13:45" },
    { id: "TXN-003", student: "Peter Mwanga", university: "SUA", amount: "TSh 50,000", method: "M-Pesa", status: "pending", date: "2024-01-15 12:30" },
    { id: "TXN-004", student: "Grace Mushi", university: "MU", amount: "TSh 180,000", method: "M-Pesa", status: "failed", date: "2024-01-15 11:20" },
    { id: "TXN-005", student: "David Lyimo", university: "ARU", amount: "TSh 650,000", method: "Airtel Money", status: "completed", date: "2024-01-15 10:15" },
  ];

  const universityRevenue = [
    { name: "UDSM", revenue: "TSh 245M", transactions: 1234, percentage: 27 },
    { name: "UDOM", revenue: "TSh 178M", transactions: 892, percentage: 20 },
    { name: "SUA", revenue: "TSh 156M", transactions: 756, percentage: 17 },
    { name: "MU", revenue: "TSh 112M", transactions: 567, percentage: 13 },
    { name: "ARU", revenue: "TSh 78M", transactions: 398, percentage: 9 },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Payments Overview</h1>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <CreditCard className="h-8 w-8" />
                System Payments
              </h1>
              <p className="text-muted-foreground">Monitor all payments across universities</p>
            </div>
            <Button variant="outline" className="bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    {stat.change} vs last period
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
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest payment transactions across all universities</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-48 pl-9"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                        <TableCell>{txn.student}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{txn.university}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{txn.amount}</TableCell>
                        <TableCell>{txn.method}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              txn.status === "completed"
                                ? "default"
                                : txn.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {txn.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Revenue by University
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {universityRevenue.map((uni) => (
                  <div key={uni.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{uni.name}</span>
                      <span className="text-muted-foreground">{uni.revenue}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${uni.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{uni.transactions} transactions</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    </Suspense>
  );
}
