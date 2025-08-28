import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  User,
  Key,
  Smartphone
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAdmin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        navigate(decodeURIComponent(returnUrl));
      } else if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, navigate, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call our authentication function
      const { data, error } = await supabase.rpc('authenticate_user', {
        username_input: username,
        password_input: password
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('Neispravno korisničko ime ili lozinka');
      }

      // Create a mock session for our custom auth
      const userData = data[0];
      
      toast({
        title: "Uspješna prijava!",
        description: `Dobrodošao ${userData.full_name}!`,
      });

      // Handle redirect after successful login
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        navigate(decodeURIComponent(returnUrl));
      } else {
        // Let the useEffect in AuthContext handle admin vs regular user routing
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message || "Neispravno korisničko ime ili lozinka.",
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
            <h1 className="text-2xl font-bold text-foreground">Prijava</h1>
            <p className="text-muted-foreground">
              Unesi korisničko ime i lozinku
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Podaci za prijavu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Korisničko ime</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="mojnadimak"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="text-lg"
                />
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
              
              <Button 
                type="submit"
                disabled={!username || !password || isLoading}
                className="w-full bg-gradient-primary text-white font-medium"
                size="lg"
              >
                {isLoading ? 'Prijavljivam...' : 'Prijavi se'}
              </Button>
            </form>
          </CardContent>
        </Card>

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