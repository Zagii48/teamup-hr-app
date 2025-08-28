import React, { useState } from 'react';
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
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Ana Anić',
  phone: '+385 98 *** 12 34',
  reliability: 88,
  stats: {
    totalSignups: 24,
    attended: 21,
    noShow: 3,
    reliabilityPercentage: 88
  },
  recentEvents: [
    { id: '1', title: 'Odbojka - Maksimir', date: '2024-01-10', attended: true },
    { id: '2', title: 'Nogomet - Bundek', date: '2024-01-08', attended: true },
    { id: '3', title: 'Padel - Arena', date: '2024-01-05', attended: false },
    { id: '4', title: 'Tenis - TK Zagreb', date: '2024-01-03', attended: true },
    { id: '5', title: 'Odbojka - Športska', date: '2024-01-01', attended: true },
  ]
};

export default function Profile() {
  const [isDeleting, setIsDeleting] = useState(false);

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

  const reliabilityBadge = getReliabilityBadge(mockUser.reliability);
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
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{mockUser.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{mockUser.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className={reliabilityBadge.variant}>
                <ReliabilityIcon className="h-4 w-4 mr-2" />
                {mockUser.reliability}% {reliabilityBadge.text}
              </Badge>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{mockUser.reliability}%</p>
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
                <p className="text-2xl font-bold text-primary">{mockUser.stats.totalSignups}</p>
                <p className="text-xs text-muted-foreground">Ukupno prijava</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-success">{mockUser.stats.attended}</p>
                <p className="text-xs text-muted-foreground">Dolazaka</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pouzdanost</span>
                <span className="text-sm font-medium text-foreground">{mockUser.stats.reliabilityPercentage}%</span>
              </div>
              <Progress value={mockUser.stats.reliabilityPercentage} className="h-2" />
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">{mockUser.stats.attended} dolazaka</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-muted-foreground">{mockUser.stats.noShow} izostanaka</span>
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
            {mockUser.recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
                <div className="flex items-center">
                  {event.attended ? (
                    <Badge className="bg-success/10 text-success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Došao
                    </Badge>
                  ) : (
                    <Badge className="bg-destructive/10 text-destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Izostao
                    </Badge>
                  )}
                </div>
              </div>
            ))}
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