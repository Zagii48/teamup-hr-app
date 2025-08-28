import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Ticket, 
  Search, 
  Filter, 
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  FileText,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TicketData {
  id: string;
  type: string;
  status: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  } | null;
}

export default function TicketManagement() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          id,
          type,
          status,
          title,
          description,
          created_at,
          updated_at,
          profiles!tickets_user_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets((data as any) || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Greška",
        description: "Nije moguće dohvatiti tikete",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesType = typeFilter === 'all' || ticket.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTicketStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: 'Otvoren', variant: 'destructive' as const, icon: AlertCircle },
      in_progress: { label: 'U obradi', variant: 'default' as const, icon: Clock },
      resolved: { label: 'Riješen', variant: 'secondary' as const, icon: CheckCircle },
      closed: { label: 'Zatvoren', variant: 'outline' as const, icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTicketTypeLabel = (type: string) => {
    const typeLabels = {
      organizer_report: 'Prijava organizatora',
      gdpr_deletion: 'GDPR brisanje'
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getTicketTypeIcon = (type: string) => {
    return type === 'gdpr_deletion' ? Shield : AlertCircle;
  };

  const getStatusCounts = () => {
    return {
      all: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Upravljanje tiketima</h1>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Filteri i pretraživanje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pretraži tikete ili korisnike..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi statusi ({statusCounts.all})</SelectItem>
                <SelectItem value="open">Otvoreni ({statusCounts.open})</SelectItem>
                <SelectItem value="in_progress">U obradi ({statusCounts.in_progress})</SelectItem>
                <SelectItem value="resolved">Riješeni ({statusCounts.resolved})</SelectItem>
                <SelectItem value="closed">Zatvoreni ({statusCounts.closed})</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tip tiketa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi tipovi</SelectItem>
                <SelectItem value="organizer_report">Prijave organizatora</SelectItem>
                <SelectItem value="gdpr_deletion">GDPR brisanje</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Tiketi ({filteredTickets.length})</CardTitle>
          <CardDescription>
            Lista svih tiketa u sustavu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nema tiketa</p>
              <p className="text-sm">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
                  ? 'Nema tiketa koji odgovaraju filtrima'
                  : 'Trenutno nema tiketa u sustavu'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const TypeIcon = getTicketTypeIcon(ticket.type);
                return (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-lg bg-background border border-border hover:shadow-sm transition-all cursor-pointer group"
                    onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-1 p-2 rounded-lg bg-accent/10 text-accent-foreground">
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground group-hover:text-primary truncate">
                              {ticket.title}
                            </h3>
                            {getTicketStatusBadge(ticket.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {ticket.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{getTicketTypeLabel(ticket.type)}</span>
                            <span>•</span>
                            <span>{ticket.profiles?.full_name}</span>
                            <span>•</span>
                            <span>{new Date(ticket.created_at).toLocaleDateString('hr')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}