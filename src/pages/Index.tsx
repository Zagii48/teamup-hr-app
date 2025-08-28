import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Users, 
  Dribbble,
  Zap,
  Gamepad2,
  Target,
  Calendar
} from 'lucide-react';

// Mock data for events
const mockEvents = [
  {
    id: '1',
    title: 'Večernja odbojka u Maksimiru',
    sport: 'Odbojka',
    sportIcon: Zap,
    date: '2024-01-15',
    time: '19:00',
    location: 'SC Maksimir',
    currentPlayers: 8,
    maxPlayers: 12,
    price: 25,
    status: 'open'
  },
  {
    id: '2', 
    title: 'Nogomet 5v5 - Bundek',
    sport: 'Nogomet',
    sportIcon: Dribbble,
    date: '2024-01-15',
    time: '20:30',
    location: 'Bundek',
    currentPlayers: 10,
    maxPlayers: 10,
    price: 30,
    status: 'full'
  },
  {
    id: '3',
    title: 'Padel turnir - Arena Zagreb',
    sport: 'Padel', 
    sportIcon: Target,
    date: '2024-01-16',
    time: '18:00',
    location: 'Arena Zagreb',
    currentPlayers: 6,
    maxPlayers: 8,
    price: 40,
    status: 'open'
  },
  {
    id: '4',
    title: 'Tenis doubles',
    sport: 'Tenis',
    sportIcon: Gamepad2,
    date: '2024-01-16',
    time: '17:00', 
    location: 'TK Zagreb',
    currentPlayers: 3,
    maxPlayers: 4,
    price: 20,
    status: 'open'
  }
];

const filterOptions = [
  { id: 'all', label: 'Svi termini' },
  { id: 'open', label: 'Dostupni' },
  { id: 'full', label: 'Popunjeni' },
];

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || event.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string, currentPlayers: number, maxPlayers: number) => {
    if (status === 'full') {
      return <Badge className="bg-destructive/10 text-destructive">Popunjeno</Badge>;
    }
    if (currentPlayers / maxPlayers >= 0.8) {
      return <Badge className="bg-warning/10 text-warning">Skoro puno</Badge>;
    }
    return <Badge className="bg-success/10 text-success">Dostupno</Badge>;
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            TeamUp
          </h1>
          <p className="text-muted-foreground">
            Brza i fer prijava na sportske termine
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži termine, sportove, lokacije..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filterOptions.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className={`whitespace-nowrap ${
                activeFilter === filter.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card text-foreground border-border hover:bg-accent'
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <Card className="bg-gradient-card shadow-card border-0">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  Nema termina
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Pokušaj s drugim pojmom za pretraživanje' : 'Trenutno nema dostupnih termina'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEvents.map((event) => (
              <Card 
                key={event.id}
                className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer border-0"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <event.sportIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-foreground">
                          {event.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {event.sport}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(event.status, event.currentPlayers, event.maxPlayers)}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{event.time}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{event.location}</p>
                        <p className="text-xs text-muted-foreground">{event.price} kn</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {event.currentPlayers}/{event.maxPlayers} igrača
                      </span>
                    </div>
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(event.currentPlayers / event.maxPlayers) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
