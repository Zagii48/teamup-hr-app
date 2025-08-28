import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  User, 
  Phone, 
  Trophy, 
  Calendar,
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Trash2,
  LogIn,
  UserPlus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchUserData();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user data from users table
      const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;
      setUserData(userInfo);

      // Fetch user participation stats
      const { data: participations, error: statsError } = await supabase
        .from('event_participants')
        .select('attended')
        .eq('user_id', user.id);

      if (statsError) throw statsError;

      const totalSignups = participations?.length || 0;
      const attended = participations?.filter(p => p.attended === true).length || 0;
      const noShow = participations?.filter(p => p.attended === false).length || 0;
      const reliabilityPercentage = totalSignups > 0 ? Math.round((attended / totalSignups) * 100) : 100;

      setUserStats({
        totalSignups,
        attended,
        noShow,
        reliabilityPercentage
      });

      // Fetch recent events
      const { data: eventData, error: eventsError } = await supabase
        .from('event_participants')
        .select(`
          attended,
          events!inner(
            id,
            title,
            location,
            date_time,
            creator_id,
            profiles!inner(full_name)
          )
        `)
        .eq('user_id', user.id)
        .order('events(date_time)', { ascending: false })
        .limit(5);

      if (eventsError) throw eventsError;

      setRecentEvents(eventData || []);

    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message || "Greška pri dohvaćanju podataka.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getReliabilityBadge = (reliability: number) => {
    if (reliability >= 90) {
      return {
        variant: 'bg-success/10 text-success',
        icon: CheckCircle,
        text: 'Pouzdan'
      };
    }
    if (reliability >= 60) {
      return {
        variant: 'bg-warning/10 text-warning',
        icon: AlertTriangle,
        text: 'Umjeren'
      };
    }
    return {
      variant: 'bg-destructive/10 text-destructive',
      icon: XCircle,
      text: 'Nepouzdan'
    };
  };

  const handleDataDeletion = async () => {
    setIsDeleting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Zahtjev poslan",
      description: "Vaš zahtjev za brisanje podataka je poslan. Kontaktirat ćemo vas uskoro.",
    });
    setIsDeleting(false);
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <MobileLayout>
        <div className="p-4 text-center">
          <p>Učitavam...</p>
        </div>
      </MobileLayout>
    );
  }

  // Show login/register options if not authenticated
  if (!user) {
    return (
      <MobileLayout>
        <div className="p-4 space-y-6">
          <div className="text-center pt-8">
            <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Prijavite se
            </h1>
            <p className="text-muted-foreground mb-8">
              Za pristup profilu potrebno je da se prijavite
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-primary text-white"
              size="lg"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Prijava
            </Button>
            
            <Button 
              onClick={() => navigate('/register')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Registracija
            </Button>
          </div>

          <Card className="bg-gradient-card shadow-card border-0 mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2">Zašto se registrirati?</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Pridružite se sportskim terminama</li>
                <li>• Kreirajte svoje termine</li>
                <li>• Pratite svoju statistiku</li>
                <li>• Povežite se s drugim sportašima</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </MobileLayout>
    );
  }

  // Show actual user profile
  const reliabilityPercentage = userStats?.reliabilityPercentage || 100;
  const reliabilityBadge = getReliabilityBadge(reliabilityPercentage);
  const ReliabilityIcon = reliabilityBadge.icon;

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Moj profil
          </h1>
        </div>

        {/* User Info */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {userData?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{userData?.full_name || 'Korisnik'}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{userData?.phone || 'Nema telefona'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className={reliabilityBadge.variant}>
                <ReliabilityIcon className="h-4 w-4 mr-2" />
                {reliabilityBadge.text}
              </Badge>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{reliabilityPercentage}%</p>
                <p className="text-xs text-muted-foreground">pouzdanost</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Statistika</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{userStats?.totalSignups || 0}</p>
                <p className="text-xs text-muted-foreground">Ukupno prijava</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-success">{userStats?.attended || 0}</p>
                <p className="text-xs text-muted-foreground">Dolazaka</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pouzdanost</span>
                <span className="text-sm font-medium text-foreground">{reliabilityPercentage}%</span>
              </div>
              <Progress value={reliabilityPercentage} className="h-2" />
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">{userStats?.attended || 0} dolazaka</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-muted-foreground">{userStats?.noShow || 0} izostanaka</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Nedavni termini</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Još nema prijava na termine</p>
              </div>
            ) : (
              recentEvents.map((participation: any) => {
                const event = participation.events;
                const organizerName = event.profiles?.full_name || 'Nepoznat organizator';
                
                return (
                  <div 
                    key={event.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date_time).toLocaleDateString('hr-HR')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.location}
                      </p>
                      <p className="text-xs text-primary">
                        Organizator: {organizerName}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {participation.attended === true ? (
                        <Badge className="bg-success/10 text-success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Došao
                        </Badge>
                      ) : participation.attended === false ? (
                        <Badge className="bg-destructive/10 text-destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Izostao
                        </Badge>
                      ) : (
                        <Badge className="bg-warning/10 text-warning">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Čeka se
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Data Deletion */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-foreground mb-2">Upravljanje podacima</h3>
                <p className="text-sm text-muted-foreground">
                  Možete zatražiti brisanje svojih osobnih podataka iz sustava.
                </p>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Zatraži brisanje podataka
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Brisanje podataka</AlertDialogTitle>
                    <AlertDialogDescription>
                      Jeste li sigurni da želite zatražiti brisanje svojih podataka? 
                      Ovaj postupak će pokrenuti proces trajnog brisanja svih vaših 
                      osobnih informacija iz sustava.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Odustani</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDataDeletion}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? 'Šaljem zahtjev...' : 'Potvrdi brisanje'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}