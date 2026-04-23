import { Layout } from "@/components/layout";
import { useGetCustomer, getGetCustomerQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { Users, Mail, Phone, Calendar, ArrowLeft, History, MessageSquare, Phone as PhoneIcon, Mail as MailIcon } from "lucide-react";
import { Link, useParams } from "wouter";

export default function CustomerDetail() {
  const params = useParams();
  const customerId = params.customerId as string;
  
  const { data: customer, isLoading, isError } = useGetCustomer(customerId, {
    query: {
      enabled: !!customerId,
      queryKey: getGetCustomerQueryKey(customerId)
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-6 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !customer) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Users className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load customer profile</h2>
          <p className="text-muted-foreground mb-6">Could not find details for this customer ID.</p>
          <Link href="/customers" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Customers
          </Link>
        </div>
      </Layout>
    );
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
      case "escalated":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "pending":
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400";
    }
  };

  const ChannelIcon = ({ channel }: { channel: string }) => {
    switch (channel) {
      case "chat": return <MessageSquare className="w-4 h-4" />;
      case "phone": return <PhoneIcon className="w-4 h-4" />;
      case "email": return <MailIcon className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <Link href="/customers" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 w-fit mb-4 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Customers
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight" data-testid="text-customer-name">{customer.name}</h1>
              <p className="text-muted-foreground mt-1 font-mono text-sm">{customer.customerId}</p>
            </div>
            <Badge className={getTierColor(customer.tier)} variant="outline" data-testid="badge-tier">
              {customer.tier} TIER
            </Badge>
          </div>
        </div>

        <Card className="border-primary/20 shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-semibold">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="font-semibold">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="font-semibold">{formatDate(customer.joinDate)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Interaction History</h2>
          </div>
          
          {customer.history.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No interaction history found for this customer.
              </CardContent>
            </Card>
          ) : (
            <div className="relative border-l border-muted ml-4 md:ml-6 space-y-8 pb-8">
              {customer.history.map((item, index) => (
                <div key={item.ticketId} className="relative pl-8 md:pl-10" data-testid={`history-item-${item.ticketId}`}>
                  {/* Timeline dot */}
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                  
                  <Card className="border-border/50 hover:border-primary/30 transition-colors shadow-sm">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs text-muted-foreground bg-muted/20">
                            {item.ticketId}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{formatDate(item.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2 capitalize bg-muted/30 px-2 py-1 rounded">
                            <ChannelIcon channel={item.channel} /> {item.channel}
                          </div>
                          <Badge className={getStatusColor(item.status)} variant="outline">
                            {item.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-base leading-tight mt-1">{item.issue}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize text-xs font-medium">
                            {item.complaintType.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        {item.resolution && (
                          <div className="bg-muted/30 border border-border/50 rounded-md p-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Resolution</p>
                            <p className="text-sm">{item.resolution}</p>
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground text-right font-medium">
                          Handled by: {item.agentName}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
