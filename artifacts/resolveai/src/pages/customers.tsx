import { Layout } from "@/components/layout";
import { useListCustomers, type CustomerSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { formatShortDate } from "@/lib/format";

export default function Customers() {
  const { data: customers, isLoading, isError } = useListCustomers();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter((c) => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Premium":
        return "bg-amber-500/20 text-amber-600 border-amber-500/30 dark:text-amber-400";
      case "Standard":
        return "bg-blue-500/20 text-blue-600 border-blue-500/30 dark:text-blue-400";
      case "Basic":
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-[350px] mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !customers) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Users className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load customers</h2>
          <p className="text-muted-foreground">Please check your connection and try again.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Profiles</h1>
          <p className="text-muted-foreground mt-1">Manage users and their historical interactions.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, or ID..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-customers"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
            <p>No customers found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Link key={customer.customerId} href={`/customers/${customer.customerId}`} data-testid={`card-customer-${customer.customerId}`}>
                <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full group">
                  <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{customer.name}</CardTitle>
                        <p className="text-sm text-muted-foreground font-mono mt-1 text-xs">{customer.customerId}</p>
                      </div>
                      <Badge className={getTierColor(customer.tier)} variant="outline">
                        {customer.tier}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium truncate max-w-[180px]" title={customer.email}>{customer.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Joined</span>
                        <span className="font-medium">{formatShortDate(customer.joinDate)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Total Tickets</span>
                        <span className="font-medium">{customer.totalTickets}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-t border-border/50 pt-3">
                        <span className="text-muted-foreground">Open Tickets</span>
                        <Badge variant={customer.openTickets > 0 ? "default" : "secondary"} className={customer.openTickets > 0 ? "bg-destructive text-destructive-foreground hover:bg-destructive" : ""}>
                          {customer.openTickets}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/50 flex justify-end items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View Profile <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
