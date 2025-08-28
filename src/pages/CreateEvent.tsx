import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Zap, 
  Dribbble, 
  Target, 
  Gamepad2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Timer,
  Share2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const sportsOptions = [
  { id: 'odbojka', name: 'Odbojka', icon: Zap, color: 'bg-sport-volleyball' },
  { id: 'nogomet', name: 'Nogomet', icon: Dribbble, color: 'bg-sport-football' },
  { id: 'padel', name: 'Padel', icon: Target, color: 'bg-sport-padel' },
  { id: 'tenis', name: 'Tenis', icon: Gamepad2, color: 'bg-sport-tennis' },
];

interface FormData {
  sport: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  capacity: string;
  waitingList: string;
  cancelDeadline: string;
  autoLock: string;
  description: string;
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    sport: '',
    title: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    capacity: '12',
    waitingList: '4',
    cancelDeadline: '2',
    autoLock: '15',
    description: ''
  });

  const handleSportSelect = (sportId: string) => {
    setSelectedSport(sportId);
    setFormData(prev => ({ ...prev, sport: sportId }));
    setCurrentStep(2);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateEvent = async () => {
    setIsCreating(true);
    
    try {
      // Simulate API call to create event
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock event ID for redirect
      const newEventId = '12345';
      
      toast({
        title: "Termin kreiran! ✅",
        description: `${formData.title} je uspješno kreiran.`,
      });
      
      // Redirect to event details with sharing message
      navigate(`/events/${newEventId}?created=true`);
    } catch (error) {
      toast({
        title: "Greška",
        description: "Dogodila se greška pri kreiranju termina.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const selectedSportData = sportsOptions.find(sport => sport.id === selectedSport);

  if (currentStep === 1) {
    return (
      <MobileLayout>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-foreground hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nazad
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Novi termin</h1>
            <div className="w-16"></div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-lg font-medium text-foreground">Odaberi sport</h2>
            <p className="text-muted-foreground text-sm">Najprije odaberi vrstu sporta za svoj termin</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {sportsOptions.map((sport) => {
              const SportIcon = sport.icon;
              return (
                <Card 
                  key={sport.id}
                  className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer border-0"
                  onClick={() => handleSportSelect(sport.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-lg ${sport.color} flex items-center justify-center mx-auto mb-3`}>
                      <SportIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-foreground">{sport.name}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(1)}
            className="text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad
          </Button>
          <div className="flex items-center space-x-2">
            {selectedSportData && (
              <>
                <div className={`w-6 h-6 rounded ${selectedSportData.color} flex items-center justify-center`}>
                  <selectedSportData.icon className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{selectedSportData.name}</span>
              </>
            )}
          </div>
          <div className="w-16"></div>
        </div>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Detalji termina</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Naziv termina</Label>
              <Input
                id="title"
                placeholder="npr. Večernja odbojka u Maksimiru"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Datum</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Vrijeme</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Trajanje termina</Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                  <SelectItem value="90">90 min</SelectItem>
                  <SelectItem value="120">120 min</SelectItem>
                  <SelectItem value="custom">Prilagođeno...</SelectItem>
                </SelectContent>
              </Select>
              {formData.duration === 'custom' && (
                <div className="mt-2">
                  <Input
                    type="number"
                    placeholder="Trajanje u minutama"
                    min="15"
                    max="480"
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokacija</Label>
              <Input
                id="location"
                placeholder="npr. Sportski centar Maksimir"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Kapacitet</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="2"
                  max="50"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waitingList">Pričuva</Label>
                <Input
                  id="waitingList"
                  type="number"
                  min="0"
                  max="20"
                  value={formData.waitingList}
                  onChange={(e) => handleInputChange('waitingList', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cancelDeadline">Rok odjave (sati)</Label>
                <Input
                  id="cancelDeadline"
                  type="number"
                  min="0"
                  max="48"
                  value={formData.cancelDeadline}
                  onChange={(e) => handleInputChange('cancelDeadline', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="autoLock">Auto-lock (min)</Label>
                <Input
                  id="autoLock"
                  type="number"
                  min="0"
                  max="60"
                  value={formData.autoLock}
                  onChange={(e) => handleInputChange('autoLock', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Dodatne informacije (opcionalno)</Label>
              <Textarea
                id="description"
                placeholder="Dodatne informacije o terminu..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleCreateEvent}
          disabled={!formData.title || !formData.date || !formData.time || !formData.location || isCreating}
          className="w-full bg-gradient-primary text-white font-medium"
          size="lg"
        >
          {isCreating ? (
            'Kreiram termin...'
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Objavi termin
            </>
          )}
        </Button>
      </div>
    </MobileLayout>
  );
}