import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dribbble, 
  Zap, 
  Gamepad2, 
  Target,
  ArrowRight,
  Calendar,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function Sports() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [sports, setSports] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSports();
    if (slug) {
      fetchEventsBySlug(slug);
    }
  }, [slug]);

  const fetchSports = async () => {
    try {
      const { data, error } = await supabase
        .from('sports')
        .select('*')
        .order('name');

      if (error) throw error;

      setSports(data || []);
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message || "Greška pri dohvaćanju sportova.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEventsBySlug = async (sportSlug: string) => {
    try {
      const { data: sport } = await supabase
        .from('sports')
        .select('*')
        .eq('slug', sportSlug)
        .single();

      if (!sport) {
        navigate('/sports');
        return;
      }

      const { data, error } = await supabase
        .from('events')
        .select('*, profiles(full_name)')
        .eq('sport_type', sport.name)
        .eq('status', 'active')
        .order('date_time');

      if (error) throw error;

      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message || "Greška pri dohvaćanju termina.",
        variant: "destructive"
      });
    }
  };

  const getIconForSport = (sportName: string) => {
    const iconMap: { [key: string]: any } = {
      'Nogomet': Dribbble,
      'Košarka': Target,
      'Tenis': Gamepad2,
      'Odbojka': Zap,
      'Rukomet': Target,
      'Badminton': Gamepad2
    };
    return iconMap[sportName] || Target;
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="p-4 text-center">
          <p>Učitavam...</p>
        </div>
      </MobileLayout>
    );
  }

  // If viewing a specific sport
  if (slug) {
    const currentSport = sports.find((sport: any) => sport.slug === slug);
    
    return (
      <MobileLayout>
        <div className="p-4 space-y-6">
          <div className="text-center pt-4">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {currentSport?.name || 'Sport'}
            </h1>
            <p className="text-muted-foreground">
              {currentSport?.description || 'Termini za ovaj sport'}
            </p>
          </div>

          {events.length === 0 ? (
            <Card className="bg-gradient-card shadow-card border-0">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground mb-2">
                  Još nema termina za ovaj sport
                </h3>
                <p className="text-muted-foreground mb-4">
                  Budi prvi koji će ga kreirati!
                </p>
                <Button 
                  onClick={() => navigate('/create')}
                  className="bg-gradient-primary text-white"
                >
                  Stvori termin
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {events.map((event: any) => (
                <Card 
                  key={event.id}
                  className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer border-0"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {event.location}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        {event.price > 0 ? `${event.price} €` : 'Besplatno'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date_time).toLocaleDateString('hr-HR')} u {new Date(event.date_time).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{event.max_participants} mjesta</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button 
            variant="outline"
            onClick={() => navigate('/sports')}
            className="w-full"
          >
            Nazad na sve sportove
          </Button>
        </div>
      </MobileLayout>
    );
  }

  // Show all sports list
  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Sportovi
          </h1>
          <p className="text-muted-foreground">
            Odaberi sport i pridruži se terminu
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sports.map((sport: any) => {
            const IconComponent = getIconForSport(sport.name);
            return (
              <Card 
                key={sport.id}
                className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer border-0"
                onClick={() => navigate(`/sports/${sport.slug}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {sport.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {sport.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}