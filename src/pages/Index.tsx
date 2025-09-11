import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
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
  Calendar,
  User,
  LogIn,
  UserPlus
} from 'lucide-react';

// Mock data for user's signed up events
const mockSignedUpEvents = [
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
    status: 'confirmed',
    canCancel: true,
    cancelDeadline: '2024-01-15T17:00:00Z',
    organizer: { id: 'org1', name: 'Marko Marković' }
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
    status: 'waitlist',
    canCancel: true,
    cancelDeadline: '2024-01-16T16:00:00Z',
    organizer: { id: 'org2', name: 'Ana Anić' }
  }
];

// Mock data for user's created events - Active (no attendance recorded)
const mockActiveEvents = [
  {
    id: '2',
    title: 'Košarka - Dražen Petrović',
    sport: 'Košarka',
    sportIcon: Gamepad2,
    date: '2024-01-17', 
    time: '20:00',
    location: 'Dvorana Dražen Petrović',
    currentPlayers: 9,
    maxPlayers: 10,
    price: 30,
    status: 'confirmed',
    canCancel: false,
    cancelDeadline: '2024-01-17T18:00:00Z',
    organizer: { id: 'currentUser', name: 'Ti' },
    attendanceRecorded: false
  }
];

// Mock data for user's created events - Past (attendance recorded)
const mockPastEvents = [
  {
    id: '4',
    title: 'Tenis - TK Zagreb',
    sport: 'Tenis',
    sportIcon: Target,
    date: '2024-01-18',
    time: '16:00', 
    location: 'Teniski klub Zagreb',
    currentPlayers: 4,
    maxPlayers: 4,
    price: 50,
    status: 'confirmed',
    canCancel: true,
    cancelDeadline: '2024-01-18T14:00:00Z',
    organizer: { id: 'currentUser', name: 'Ti' },
    attendanceRecorded: true
  }
];

const filterOptions = [
  { id: 'all', label: 'Svi termini' },
  { id: 'confirmed', label: 'Potvrđeni' },
  { id: 'waitlist', label: 'Pričuva' },
];

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('signed-up');
  const [myEventsSubTab, setMyEventsSubTab] = useState<'active' | 'past'>('active');

  const getCurrentEvents = () => {
    if (activeTab === 'signed-up') {
      return mockSignedUpEvents;
    } else {
      return myEventsSubTab === 'active' ? mockActiveEvents : mockPastEvents;
    }
  };

  const filteredEvents = getCurrentEvents().filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || event.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getCancellationStatus = (event: typeof mockSignedUpEvents[0]) => {
    const now = new Date();
    const deadline = new Date(event.cancelDeadline);
    
    if (!event.canCancel || now > deadline) {
      return {
        canCancel: false,
        message: 'Otkazivanje više nije moguće'
      };
    }
    
    const hoursLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
    return {
      canCancel: true,
      message: `Možeš otkazati do: ${deadline.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })}`
    };
  };

  const getStatusBadge = (status: string) => {
    if (status === 'confirmed') {
      return <Badge className="bg-success/10 text-success">Potvrđeno</Badge>;
    }
    if (status === 'waitlist') {
      return <Badge className="bg-warning/10 text-warning">Pričuva</Badge>;
    }
    return <Badge className="bg-muted/10 text-muted-foreground">Nepoznato</Badge>;
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pregled
          </h1>
          <p className="text-muted-foreground">
            Tvoji termini i prijave
          </p>
        </div>

        {/* Show auth required message if user not logged in */}
        {!user ? (
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-8 text-center">
              <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                Prijava potrebna
              </h3>
              <p className="text-muted-foreground mb-6">
                Za pregled svojih termina moraš se prijaviti ili registrirati.
              </p>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => navigate('/login')}
                  className="flex-1 bg-gradient-primary text-white"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Prijava
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  variant="outline"
                  className="flex-1"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Registracija
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="signed-up" className="data-[state=active]:bg-background">
              Prijavljeni termini
            </TabsTrigger>
            <TabsTrigger value="created" className="data-[state=active]:bg-background">
              Moji termini
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signed-up" className="space-y-4">
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
                      {searchQuery 
                        ? 'Pokušaj s drugim pojmom za pretraživanje' 
                        : activeTab === 'signed-up' 
                          ? 'Nisi prijavljen na nijedan termin'
                          : 'Nisi kreirao nijedan termin'
                      }
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
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(event.status)}
                          {activeTab === 'created' && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3 text-primary" />
                              <span className="text-xs text-primary">Organizator</span>
                            </div>
                          )}
                        </div>
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
                            <p className="text-xs text-muted-foreground">
                              {event.price > 0 ? `${event.price} €` : 'Besplatno'}
                              {event.price > 0 && ` • ~ ${(event.price / event.maxPlayers).toFixed(2)} € po osobi`}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
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
                        
                        {/* Cancellation Status - only for signed up events */}
                        {activeTab === 'signed-up' && (
                          <div className="pt-2 border-t border-border/50">
                            <p className={`text-xs ${getCancellationStatus(event).canCancel ? 'text-muted-foreground' : 'text-destructive'}`}>
                              {getCancellationStatus(event).message}
                            </p>
                            {getCancellationStatus(event).canCancel && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 mt-1 text-destructive hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle cancellation logic here
                                }}
                              >
                                Odjavi se
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="created" className="space-y-4">
            {/* Sub-tabs for My Events */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMyEventsSubTab('active')}
                className={`flex-1 transition-all ${myEventsSubTab === 'active' 
                  ? 'bg-background text-foreground shadow-sm border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Aktivni
              </Button>
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => setMyEventsSubTab('past')}
                className={`flex-1 transition-all ${myEventsSubTab === 'past'
                  ? 'bg-background text-foreground shadow-sm border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Prošli
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pretraži moje termine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
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
                      {searchQuery 
                        ? 'Pokušaj s drugim pojmom za pretraživanje' 
                        : myEventsSubTab === 'active'
                          ? 'Nema aktivnih termina koji čekaju evidenciju'
                          : 'Nema prošlih termina s evidencijom'
                      }
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
                        <div className="flex items-center space-x-2">
                          {myEventsSubTab === 'active' && (
                            <Badge className="bg-yellow-800/30 text-white rounded px-2 py-1 text-xs">
                              🟡 Očekuje se evidencija
                            </Badge>
                          )}
                          {myEventsSubTab === 'past' && (
                            <Badge className="bg-green-800/30 text-white rounded px-2 py-1 text-xs">
                              🟢 Evidencija spremljena
                            </Badge>
                          )}
                        </div>
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
          </TabsContent>
        </Tabs>
        </>
        )}
      </div>
    </MobileLayout>
  );
}
