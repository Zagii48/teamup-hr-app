import React from 'react';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Moon, 
  Sun, 
  Shield, 
  Trash2, 
  Bell,
  User,
  Info
} from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Postavke
          </h1>
          <p className="text-muted-foreground">
            Prilagodi aplikaciju prema svojem ukusu
          </p>
        </div>

        {/* Tema */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Tema aplikacije
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {theme === 'dark' ? 'Tamna tema' : 'Svijetla tema'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {theme === 'dark' 
                    ? 'Uštedi bateriju i smanji naprezanje očiju' 
                    : 'Klasična svijetla tema'
                  }
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifikacije */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Bell className="h-5 w-5" />
              Notifikacije
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Novi termini</p>
                <p className="text-sm text-muted-foreground">
                  Obavijesti o novim terminima tvog sporta
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Podsjetnici</p>
                <p className="text-sm text-muted-foreground">
                  Podsjetnik 2h prije termina
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privatnost */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5" />
              Privatnost
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Prikaži broj telefona</p>
                <p className="text-sm text-muted-foreground">
                  Maskiran prikaz (+385 91 *** 12 34)
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Javni profil</p>
                <p className="text-sm text-muted-foreground">
                  Drugi mogu vidjeti tvoju statistiku
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Profil */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5" />
              Korisnički račun
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Uredi profil
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Info className="h-4 w-4 mr-2" />
              O aplikaciji
            </Button>
            <Button 
              variant="destructive" 
              className="w-full justify-start"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Obriši račun
            </Button>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}