import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  User,
  Phone,
  Calendar,
  Dribbble,
  Share2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data - this would come from your API
const mockEvent = {
  id: '1',
  title: 'Večernja odbojka u Maksimiru',
  sport: 'Odbojka',
  date: '2024-01-15',
  time: '19:00',
  location: 'Sportski centar Maksimir',
  address: 'Maksimirska cesta 124, Zagreb',
  maxPlayers: 12,
  currentPlayers: 8,
  price: 25,
  organizer: {
    id: 'org1',
    name: 'Marko Marković',
    phone: '+385 91 *** 45 67',
    reliability: 95
  },
  players: [
    { id: '1', name: 'Ana Anić', phone: '+385 98 *** 12 34', reliability: 88, attended: null },
    { id: '2', name: 'Petar Petrić', phone: '+385 95 *** 56 78', reliability: 92, attended: null },
    { id: '3', name: 'Marija Marić', phone: '+385 99 *** 90 12', reliability: 85, attended: null },
    { id: '4', name: 'Josip Josić', phone: '+385 91 *** 34 56', reliability: 90, attended: null },
    { id: '5', name: 'Iva Ivić', phone: '+385 92 *** 78 90', reliability: 87, attended: null },
    { id: '6', name: 'Luka Lukić', phone: '+385 98 *** 23 45', reliability: 94, attended: null },
    { id: '7', name: 'Nina Ninić', phone: '+385 95 *** 67 89', reliability: 91, attended: null },
    { id: '8', name: 'Toma Tomić', phone: '+385 99 *** 01 23', reliability: 89, attended: null }
  ],
  waitingList: [
    { id: '9', name: 'Sara Sarić', phone: '+385 91 *** 45 67', reliability: 86 },
    { id: '10', name: 'Filip Filip', phone: '+385 92 *** 89 01', reliability: 93 }
  ],
  isUserOrganizer: true // This would be determined from auth context
};

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isInWaitingList, setIsInWaitingList] = useState(false);
  const [attendanceData, setAttendanceData] = useState<{[playerId: string]: boolean | null}>({});
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  // Check if user was promoted from waitlist (simulate)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('promoted') === 'true') {
      toast({
        title: "Ušao si s pričuve ✅",
        description: `Termin: ${mockEvent.sport} ${mockEvent.location} (${mockEvent.date} ${mockEvent.time})`,
      });
    }
  }, []);

  const handleAttendanceChange = (playerId: string, attended: boolean) => {
    setAttendanceData(prev => ({
      ...prev,
      [playerId]: attended
    }));
  };

  const handleSaveAttendance = async () => {
    setIsSavingAttendance(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Evidencija spremljena",
        description: "Dolasci sudionika su uspješno ažurirani.",
      });
    } catch (error) {
      toast({
        title: "Greška",
        description: "Dogodila se greška pri spremanju evidencije.",
        variant: "destructive"
      });
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const handleSignUp = () => {
    if (mockEvent.currentPlayers < mockEvent.maxPlayers) {
      setIsSignedUp(true);
    } else {
      setIsInWaitingList(true);
    }
  };

  const handleWithdraw = () => {
    setIsSignedUp(false);
    setIsInWaitingList(false);
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 90) return 'text-success';
    if (reliability >= 80) return 'text-warning';
    return 'text-destructive';
  };

  const getReliabilityBadge = (reliability: number) => {
    if (reliability >= 90) return 'bg-success/10 text-success';
    if (reliability >= 80) return 'bg-warning/10 text-warning';
    return 'bg-destructive/10 text-destructive';
  };

  return (
    <MobileLayout>
      <div className="relative">
        {/* Header */}
        <div className="bg-gradient-primary p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nazad
            </Button>
            <Dribbble className="h-6 w-6" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-bold">{mockEvent.title}</h1>
            <div className="flex items-center space-x-4 text-sm opacity-90">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {mockEvent.date}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {mockEvent.time}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Event Info */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{mockEvent.location}</p>
                    <p className="text-sm text-muted-foreground">{mockEvent.address}</p>
                  </div>
                </div>
                <Badge className="bg-primary/10 text-primary">
                  {mockEvent.price} kn
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {mockEvent.currentPlayers}/{mockEvent.maxPlayers} igrača
                  </span>
                </div>
                <Progress 
                  value={(mockEvent.currentPlayers / mockEvent.maxPlayers) * 100} 
                  className="w-20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Organizer */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-sm">Organizator</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-accent/50 p-1 rounded-lg transition-colors"
                onClick={() => navigate(`/profile/${mockEvent.organizer.id}`)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {mockEvent.organizer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground hover:text-primary transition-colors">{mockEvent.organizer.name}</p>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{mockEvent.organizer.phone}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getReliabilityBadge(mockEvent.organizer.reliability)}>
                  {mockEvent.organizer.reliability}% pouzdanost
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Players List */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-sm">Prijavljeni igrači ({mockEvent.currentPlayers})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {mockEvent.isUserOrganizer ? (
                // Show attendance controls for organizer
                <>
                  {mockEvent.players.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between">
                      <div 
                        className="flex items-center space-x-3 cursor-pointer hover:bg-accent/50 p-1 rounded-lg transition-colors flex-1"
                        onClick={() => navigate(`/profile/${player.id}`)}
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm hover:text-primary transition-colors">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{player.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${getReliabilityColor(player.reliability)}`}>
                          {player.reliability}%
                        </span>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAttendanceChange(player.id, true)}
                            className={`h-6 w-6 p-0 ${attendanceData[player.id] === true ? 'bg-success/20 text-success' : 'text-muted-foreground'}`}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAttendanceChange(player.id, false)}
                            className={`h-6 w-6 p-0 ${attendanceData[player.id] === false ? 'bg-destructive/20 text-destructive' : 'text-muted-foreground'}`}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t border-border/50">
                    <Button 
                      onClick={handleSaveAttendance}
                      disabled={isSavingAttendance || Object.keys(attendanceData).length === 0}
                      className="w-full bg-gradient-primary text-white"
                      size="sm"
                    >
                      {isSavingAttendance ? 'Spremam...' : 'Spremi evidenciju'}
                    </Button>
                  </div>
                </>
              ) : (
                // Show read-only list for non-organizers
                <>
                  {mockEvent.players.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between">
                      <div 
                        className="flex items-center space-x-3 cursor-pointer hover:bg-accent/50 p-1 rounded-lg transition-colors"
                        onClick={() => navigate(`/profile/${player.id}`)}
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm hover:text-primary transition-colors">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{player.phone}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${getReliabilityColor(player.reliability)}`}>
                        {player.reliability}%
                      </span>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t border-border/50 text-center">
                    <p className="text-sm text-muted-foreground">
                      Samo organizator može uređivati dolaske
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Waiting List */}
          {mockEvent.waitingList.length > 0 && (
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-sm">Pričuva ({mockEvent.waitingList.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {mockEvent.waitingList.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-3 cursor-pointer hover:bg-accent/50 p-1 rounded-lg transition-colors"
                      onClick={() => navigate(`/profile/${player.id}`)}
                    >
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm hover:text-primary transition-colors">{player.name}</p>
                        <p className="text-xs text-muted-foreground">{player.phone}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${getReliabilityColor(player.reliability)}`}>
                      {player.reliability}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Sharing Message for Created Events */}
          {new URLSearchParams(window.location.search).get('created') === 'true' && (
            <Card className="bg-gradient-card shadow-card border-0">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                    <Share2 className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Termin kreiran!</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Podijeli link s prijateljima da se mogu prijaviti
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      const shareText = `🏐 ${mockEvent.title}\n📅 ${mockEvent.date} u ${mockEvent.time}\n📍 ${mockEvent.location}\n💰 ${mockEvent.price} kn\n\nPrijavi se: ${window.location.origin}/events/${mockEvent.id}`;
                      if (navigator.share) {
                        navigator.share({ text: shareText });
                      } else {
                        navigator.clipboard.writeText(shareText);
                        toast({
                          title: "Kopirano!",
                          description: "Poruka je kopirana u međuspremnik.",
                        });
                      }
                    }}
                    className="w-full bg-gradient-primary text-white"
                    size="sm"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Podijeli termin
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pb-4">
            {!isSignedUp && !isInWaitingList ? (
              <Button 
                onClick={handleSignUp}
                className="w-full bg-gradient-primary text-white font-medium"
                size="lg"
              >
                <User className="h-4 w-4 mr-2" />
                {mockEvent.currentPlayers < mockEvent.maxPlayers ? 'Prijavi se' : 'Dodaj u pričuvu'}
              </Button>
            ) : (
              <Button 
                onClick={handleWithdraw}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                Odjavi se
              </Button>
            )}
            
            {(isSignedUp || isInWaitingList) && (
              <p className="text-center text-sm text-muted-foreground">
                {isSignedUp ? 'Uspješno si se prijavio!' : 'Dodan si u pričuvu!'}
              </p>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}