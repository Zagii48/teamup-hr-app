import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Phone,
  Key,
  Smartphone,
  User,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'phone' | 'otp'>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (name.trim().length < 2) {
      toast({
        title: "Greška",
        description: "Ime mora imati najmanje 2 znakova.",
        variant: "destructive"
      });
      return;
    }
    setStep('phone');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) throw error;

      setStep('otp');
      toast({
        title: "SMS kod poslan",
        description: `Kod je poslan na broj ${phone}`,
      });
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message || "Dogodila se greška prilikom slanja koda.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      toast({
        title: "Dobrodošao u TeamUp!",
        description: "Tvoj račun je uspješno kreiran.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message || "Neispravan kod. Pokušaj ponovo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') setStep('phone');
    else if (step === 'phone') setStep('details');
    else navigate(-1);
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
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
              {step === 'details' && 'Unesi svoje podatke'}
              {step === 'phone' && 'Potvrdi broj telefona'}
              {step === 'otp' && 'Unesi 6-znamenkasti kod'}
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${step === 'details' ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-2 h-2 rounded-full ${step === 'phone' ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-2 h-2 rounded-full ${step === 'otp' ? 'bg-primary' : 'bg-muted'}`} />
        </div>

        {/* Details Step */}
        {step === 'details' && (
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Tvoji podaci
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ime i prezime</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Marko Marković"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Kako te drugi igrači trebaju zvati?
                </p>
              </div>
              
              <Button 
                onClick={handleContinue}
                disabled={!name.trim()}
                className="w-full bg-gradient-primary text-white font-medium"
                size="lg"
              >
                Nastavi
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Phone Step */}
        {step === 'phone' && (
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Broj telefona
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Broj telefona</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+385 91 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="text-center text-lg"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Unesi broj u formatu +385...
                  </p>
                </div>
                
                <Button 
                  type="submit"
                  disabled={!phone || isLoading}
                  className="w-full bg-gradient-primary text-white font-medium"
                  size="lg"
                >
                  {isLoading ? 'Šalje se...' : 'Pošalji kod'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                SMS kod
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">6-znamenkasti kod</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    className="text-center text-2xl tracking-widest"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Kod poslan na {phone}
                  </p>
                </div>
                
                <Button 
                  type="submit"
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full bg-gradient-primary text-white font-medium"
                  size="lg"
                >
                  {isLoading ? 'Kreiram račun...' : 'Završi registraciju'}
                </Button>

                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => handleSendOtp({ preventDefault: () => {} } as React.FormEvent)}
                  disabled={isLoading}
                  className="w-full text-primary"
                  size="sm"
                >
                  Pošalji kod ponovo
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

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