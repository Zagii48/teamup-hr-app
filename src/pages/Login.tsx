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
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
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
        title: "Uspješna prijava!",
        description: "Dobrodošao u TeamUp aplikaciju.",
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

  return (
    <MobileLayout>
      <div className="p-4 space-y-6 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => step === 'otp' ? setStep('phone') : navigate(-1)}
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
            <h1 className="text-2xl font-bold text-foreground">Prijava</h1>
            <p className="text-muted-foreground">
              {step === 'phone' 
                ? 'Unesi svoj broj telefona' 
                : 'Unesi 6-znamenkasti kod'
              }
            </p>
          </div>
        </div>

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
                  {isLoading ? 'Provjeravam...' : 'Potvrdi kod'}
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

        {/* Register Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Nemaš račun?{' '}
            <Link 
              to="/register" 
              className="text-primary font-medium hover:text-primary/80 transition-colors"
            >
              Registriraj se
            </Link>
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}