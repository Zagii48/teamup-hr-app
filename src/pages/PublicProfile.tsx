import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  User, 
  Phone, 
  Trophy,
  CheckCircle, 
  XCircle,
  AlertTriangle
} from 'lucide-react';

// Mock user data - this would come from API
const mockPublicUser = {
  id: '2',
  name: 'Marko Marković',
  phone: '+385 91 *** 45 67',
  avatar_url: null,
  reliability: 95,
  stats: {
    totalSignups: 42,
    attended: 40,
    noShow: 2,
    reliabilityPercentage: 95
  }
};

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();

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

  const reliabilityBadge = getReliabilityBadge(mockPublicUser.reliability);
  const ReliabilityIcon = reliabilityBadge.icon;

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">
              Javni profil
            </h1>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* User Info */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={mockPublicUser.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {mockPublicUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{mockPublicUser.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{mockPublicUser.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className={reliabilityBadge.variant}>
                <ReliabilityIcon className="h-4 w-4 mr-2" />
                {mockPublicUser.reliability}% {reliabilityBadge.text}
              </Badge>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{mockPublicUser.reliability}%</p>
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
              <span>Javna statistika</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{mockPublicUser.stats.totalSignups}</p>
                <p className="text-xs text-muted-foreground">Ukupno prijava</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-success">{mockPublicUser.stats.attended}</p>
                <p className="text-xs text-muted-foreground">Dolazaka</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pouzdanost</span>
                <span className="text-sm font-medium text-foreground">{mockPublicUser.stats.reliabilityPercentage}%</span>
              </div>
              <Progress value={mockPublicUser.stats.reliabilityPercentage} className="h-2" />
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">{mockPublicUser.stats.attended} dolazaka</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-muted-foreground">{mockPublicUser.stats.noShow} izostanaka</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Ovo je javni profil. Poviješ termina je privatna i vidljiva samo korisniku.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}