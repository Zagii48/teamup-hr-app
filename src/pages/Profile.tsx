import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {MobileLayout} from '@/components/MobileLayout';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {Progress} from '@/components/ui/progress';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    User,
    Phone,
    Trophy,
    Calendar,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Trash2
} from 'lucide-react';
import {toast} from '@/hooks/use-toast';
import {ProfileData, useApi} from "@/api/client.ts";
import {Auth, useAuth} from "@/contexts/AuthContext.tsx";
import axios from "axios";


export default function Profile() {
    const auth = useAuth();
    const api = useApi();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await api.profile(auth.user.username);
                setProfile(response);
            } catch (error: unknown) {
                let message = "Dogodila se greška prilikom učitavanja profila.";

                if (axios.isAxiosError(error)) {
                    message = error.response?.data?.error || error.message || message;
                } else if (error instanceof Error) {
                    message = error.message || message;
                }

                toast({
                    title: "Greška",
                    description: message,
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [auth.user?.username, api]);

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

    const handleDataDeletion = async () => {
        setIsDeleting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast({
            title: "Zahtjev poslan",
            description: "Vaš zahtjev za brisanje podataka je poslan. Kontaktirat ćemo vas uskoro.",
        });
        setIsDeleting(false);
    };


    if (isLoading) {
        return (
            <MobileLayout>
                <div className="p-4 text-center">
                    <p>Učitavam...</p>
                </div>
            </MobileLayout>
        );
    }

    console.log(profile);

    const reliabilityBadge = getReliabilityBadge(profile.reliability);
    const ReliabilityIcon = reliabilityBadge.icon;


    return (
        <MobileLayout>
            <div className="p-4 space-y-6">
                {/* Header */}
                <div className="text-center pt-4">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Moj profil
                    </h1>
                </div>

                {/* User Info */}
                <Card className="bg-gradient-card shadow-card border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                    {profile.username.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-foreground">{profile.username}</h2>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Phone className="h-4 w-4 text-muted-foreground"/>
                                    <span className="text-muted-foreground">{profile.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Badge className={reliabilityBadge.variant}>
                                <ReliabilityIcon className="h-4 w-4 mr-2"/>
                                {profile.reliability}% {reliabilityBadge.text}
                            </Badge>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary">{profile.reliability}%</p>
                                <p className="text-xs text-muted-foreground">pouzdanost</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <Card className="bg-gradient-card shadow-card border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Trophy className="h-5 w-5"/>
                            <span>Statistika</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{profile.stats.totalSignups}</p>
                                <p className="text-xs text-muted-foreground">Ukupno prijava</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <p className="text-2xl font-bold text-success">{profile.stats.attended}</p>
                                <p className="text-xs text-muted-foreground">Dolazaka</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Pouzdanost</span>
                                <span
                                    className="text-sm font-medium text-foreground">{profile.stats.reliabilityPercentage}%</span>
                            </div>
                            <Progress value={profile.stats.reliabilityPercentage} className="h-2"/>
                        </div>

                        <div className="flex justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-success"/>
                                <span className="text-muted-foreground">{profile.stats.attended} dolazaka</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <XCircle className="h-4 w-4 text-destructive"/>
                                <span className="text-muted-foreground">{profile.stats.noShow} izostanaka</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Events */}
                <Card className="bg-gradient-card shadow-card border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5"/>
                            <span>Nedavni termini</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {profile.recentEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                                onClick={() => navigate(`/events/${event.id}`)}
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-foreground text-sm">{event.title}</p>
                                    <p className="text-xs text-muted-foreground">{event.date}</p>
                                    <p
                                        className="text-xs text-primary hover:underline cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/profile/${event.organizerId}`);
                                        }}
                                    >
                                        Organizator: {event.organizerName}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    {event.attended ? (
                                        <Badge className="bg-success/10 text-success">
                                            <CheckCircle className="h-3 w-3 mr-1"/>
                                            Došao
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-destructive/10 text-destructive">
                                            <XCircle className="h-3 w-3 mr-1"/>
                                            Izostao
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Data Deletion */}
                <Card className="bg-gradient-card shadow-card border-0">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="text-center">
                                <h3 className="font-medium text-foreground mb-2">Upravljanje podacima</h3>
                                <p className="text-sm text-muted-foreground">
                                    Možete zatražiti brisanje svojih osobnih podataka iz sustava.
                                </p>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline"
                                            className="w-full border-destructive text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4 mr-2"/>
                                        Zatraži brisanje podataka
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Brisanje podataka</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Jeste li sigurni da želite zatražiti brisanje svojih podataka?
                                            Ovaj postupak će pokrenuti proces trajnog brisanja svih vaših
                                            osobnih informacija iz sustava.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Odustani</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDataDeletion}
                                            disabled={isDeleting}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            {isDeleting ? 'Šaljem zahtjev...' : 'Potvrdi brisanje'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MobileLayout>
    );
}