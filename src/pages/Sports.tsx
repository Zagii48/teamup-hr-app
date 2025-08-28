import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dribbble, 
  Zap, 
  Gamepad2, 
  Target,
  ArrowRight
} from 'lucide-react';

const sports = [
  {
    id: 'nogomet',
    name: 'Nogomet',
    icon: Dribbble,
    color: 'sport-football',
    activeEvents: 12,
    totalPlayers: 144,
    description: 'Klasični 11 vs 11'
  },
  {
    id: 'odbojka',
    name: 'Odbojka',
    icon: Zap,
    color: 'sport-volleyball',
    activeEvents: 8,
    totalPlayers: 48,
    description: '6 vs 6, indoor/outdoor'
  },
  {
    id: 'tenis',
    name: 'Tenis',
    icon: Gamepad2,
    color: 'sport-tennis',
    activeEvents: 15,
    totalPlayers: 30,
    description: 'Singles i doubles'
  },
  {
    id: 'padel',
    name: 'Padel',
    icon: Target,
    color: 'sport-padel',
    activeEvents: 6,
    totalPlayers: 24,
    description: '2 vs 2 na zatvorenom terenu'
  }
];

export default function Sports() {
  const navigate = useNavigate();

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
          {sports.map((sport) => (
            <Card 
              key={sport.id}
              className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer border-0"
              onClick={() => navigate(`/sports/${sport.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-${sport.color}/10`}>
                      <sport.icon className={`h-6 w-6 text-${sport.color}`} />
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

                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">
                        {sport.activeEvents}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Aktivni termini
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">
                        {sport.totalPlayers}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ukupno igrača
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Dostupno
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}