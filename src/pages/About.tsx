import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Heart, 
  Info, 
  Users,
  Coffee,
  Smartphone
} from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const handleSupportCreator = () => {
    // Open external link or show toast
    window.open('https://revolut.me/gabrijels', '_blank');
  };

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
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Info className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* App Info */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl text-foreground">TeamUp</CardTitle>
            <p className="text-muted-foreground">Početna verzija aplikacije</p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-foreground">
              Brza prijava na amaterske sportske termine bez WhatsApp kaosa.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Kreirana za sportsku zajednicu</span>
            </div>
          </CardContent>
        </Card>

        {/* Creator */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-primary" />
              Kreator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-primary">GŠ</span>
              </div>
              <h3 className="font-semibold text-foreground">Gabrijel Šubar</h3>
              <p className="text-sm text-muted-foreground">
                Sportski entuzijast i developer
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support Creator */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
              <Coffee className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Podrži kreatora</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ako ti se sviđa aplikacija, možeš podržati njen razvoj
              </p>
            </div>
            <Button 
              onClick={handleSupportCreator}
              className="w-full bg-gradient-primary text-white font-medium"
            >
              <Heart className="h-4 w-4 mr-2" />
              Podrži na Revolut
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <span className="font-medium text-primary">Active Clubbing</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Sportska zajednica iz WhatsAppa
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}