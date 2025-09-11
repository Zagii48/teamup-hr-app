import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  User,
  Phone,
  Key,
  Smartphone
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Client from "@/api/client.ts";
import UserSession from "@/api/userData.ts";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to normalize Croatian phone numbers
  const normalizePhoneNumber = (phoneInput: string): string => {
    // Remove all non-digit characters
    const cleaned = phoneInput.replace(/\D/g, '');
    
    // If it starts with 385, it's already in international format
    if (cleaned.startsWith('385')) {
      return `+${cleaned}`;
    }
    
    // If it starts with 0, remove it and add +385
    if (cleaned.startsWith('0')) {
      return `+385${cleaned.substring(1)}`;
    }
    
    // If it starts with 9 (Croatian mobile), add +385
    if (cleaned.startsWith('9') && cleaned.length === 8) {
      return `+385${cleaned}`;
    }
    
    // If no country code and looks like Croatian mobile, add +385
    if (cleaned.length === 8 || cleaned.length === 9) {
      return `+385${cleaned}`;
    }
    
    // Otherwise, return as-is with + prefix if not present
    return phoneInput.startsWith('+') ? phoneInput : `+${phoneInput}`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!fullName.trim() || !username.trim() || !password) {
        throw new Error('Sva polja su obavezna');
      }

      if (password !== confirmPassword) {
        throw new Error('Lozinke se ne poklapaju');
      }

      if (password.length < 6) {
        throw new Error('Lozinka mora imati najmanje 6 znakova');
      }

      const normalizedPhone = normalizePhoneNumber(phone);

      // Create user account
      const registerData: AuthenticationRegisterRequest = {
        username: username.trim(),
        password: password,
        email: null
      };
      const response = await Client.register(registerData);

      if (response.error) {
        throw new Error(response.error);
      }

      UserSession.setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        token: response.token,
      });


      toast({
        title: "Uspješna registracija!",
        description: "Možete se prijaviti s vašim korisničkim imenom.",
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message || "Dogodila se greška prilikom registracije.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="flex items-center justify-between">
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
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Logo/Title */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Registracija</h1>
            <p className="text-muted-foreground">
              Stvori svoj TeamUp račun
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Novi račun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Ime i prezime</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ana Anić"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">Korisničko ime</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="mojnadimak"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Broj mobitela</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="091 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Broj možeš unijeti s ili bez pozivnog broja (+385)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Lozinka</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Potvrdi lozinku</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary text-white font-medium"
                size="lg"
              >
                {isLoading ? 'Stvaram račun...' : 'Stvori račun'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Već imaš račun?{' '}
            <Link 
              to="/login" 
              className="text-primary font-medium hover:text-primary/80 transition-colors"
            >
              Prijavi se
            </Link>
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
