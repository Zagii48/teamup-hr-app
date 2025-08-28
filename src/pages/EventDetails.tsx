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
  Dribbble
} from 'lucide-react';

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
    name: 'Marko Marković',
    phone: '+385 91 *** 45 67',
    reliability: 95
  },
  players: [
    { id: '1', name: 'Ana Anić', phone: '+385 98 *** 12 34', reliability: 88 },
    { id: '2', name: 'Petar Petrić', phone: '+385 95 *** 56 78', reliability: 92 },
    { id: '3', name: 'Marija Marić', phone: '+385 99 *** 90 12', reliability: 85 },
    { id: '4', name: 'Josip Josić', phone: '+385 91 *** 34 56', reliability: 90 },
    { id: '5', name: 'Iva Ivić', phone: '+385 92 *** 78 90', reliability: 87 },
    { id: '6', name: 'Luka Lukić', phone: '+385 98 *** 23 45', reliability: 94 },
    { id: '7', name: 'Nina Ninić', phone: '+385 95 *** 67 89', reliability: 91 },
    { id: '8', name: 'Toma Tomić', phone: '+385 99 *** 01 23', reliability: 89 }
  ],
  waitingList: [
    { id: '9', name: 'Sara Sarić', phone: '+385 91 *** 45 67', reliability: 86 },
    { id: '10', name: 'Filip Filip', phone: '+385 92 *** 89 01', reliability: 93 }
  ]
};

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isInWaitingList, setIsInWaitingList] = useState(false);

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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {mockEvent.organizer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{mockEvent.organizer.name}</p>
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
              {mockEvent.players.map((player, index) => (
                <div key={player.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{player.name}</p>
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

          {/* Waiting List */}
          {mockEvent.waitingList.length > 0 && (
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-sm">Pričuva ({mockEvent.waitingList.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {mockEvent.waitingList.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{player.name}</p>
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