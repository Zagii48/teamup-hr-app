import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MobileLayout>
      <div className="p-4 flex items-center justify-center min-h-[80vh]">
        <Card className="bg-gradient-card shadow-card border-0 w-full max-w-sm">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-2">404</h1>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Stranica nije pronađena
            </h2>
            <p className="text-muted-foreground mb-6">
              Stranica koju tražite ne postoji ili je premještena.
            </p>
            <Button 
              onClick={() => window.location.href = "/"}
              className="bg-gradient-primary text-white w-full"
              size="lg"
            >
              <Home className="h-4 w-4 mr-2" />
              Povratak na početnu
            </Button>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default NotFound;
