import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Ticket, 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  openTickets: number;
  resolvedTickets: number;
  avgTrustScore: number;
  recentTickets: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    openTickets: 0,
    resolvedTickets: 0,
    avgTrustScore: 0,
    recentTickets: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersData, eventsData, ticketsData, recentTicketsData] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('tickets').select('status', { count: 'exact' }),
        supabase.from('tickets')
          .select(`
            id,
            type,
            status,
            title,
            created_at,
            profiles!tickets_user_id_fkey(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const openTickets = ticketsData.data?.filter(t => ['open', 'in_progress'].includes(t.status)).length || 0;
      const resolvedTickets = ticketsData.data?.filter(t => ['resolved', 'closed'].includes(t.status)).length || 0;

      setStats({
        totalUsers: usersData.count || 0,
        totalEvents: eventsData.count || 0,
        openTickets,
        resolvedTickets,
        avgTrustScore: 85, // This would be calculated from actual data
        recentTickets: recentTicketsData.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ukupno korisnika
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ukupno događaja
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalEvents}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Otvoreni tiketi
            </CardTitle>
            <Ticket className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.openTickets}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prosječni Trust Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.avgTrustScore}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Najnoviji tiketi</CardTitle>
              <CardDescription>
                Pregled najnovijih zahtjeva korisnika
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/tickets')}
            >
              Vidi sve tikete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nema novih tiketa</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {ticket.title}
                      </p>
                      {getTicketStatusBadge(ticket.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getTicketTypeLabel(ticket.type)} • {ticket.profiles?.full_name}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleDateString('hr')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}