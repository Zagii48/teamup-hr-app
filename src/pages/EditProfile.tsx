import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Camera,
  User,
  Upload,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock current user data
const mockCurrentUser = {
  id: '1',
  name: 'Ana Anić',
  avatar_url: null
};

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: mockCurrentUser.name,
    avatar_url: mockCurrentUser.avatar_url
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast({
        title: "Neispravna datoteka",
        description: "Molimo odaberite JPG, PNG ili WebP sliku.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Datoteka prevelika",
        description: "Slika mora biti manja od 2MB.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadProfileImage = async (file: File, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let avatarUrl = formData.avatar_url;

      // Upload new image if selected
      if (selectedFile) {
        const uploadedUrl = await uploadProfileImage(selectedFile, mockCurrentUser.id);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      // Here you would update the user profile in your database
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Profil ažuriran",
        description: "Vaše promjene su uspješno spremljene.",
      });

      navigate('/profile');
    } catch (error) {
      toast({
        title: "Greška",
        description: "Dogodila se greška pri spremanju profila.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentAvatarUrl = previewUrl || formData.avatar_url;

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
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">
              Uredi profil
            </h1>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Camera className="h-5 w-5" />
                Profilna slika
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={currentAvatarUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {formData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {selectedFile && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeSelectedFile}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-border text-foreground hover:bg-accent"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedFile ? 'Promijeni sliku' : 'Dodaj sliku'}
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <p className="text-xs text-muted-foreground text-center">
                  JPG, PNG ili WebP • Maksimalno 2MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5" />
                Osobni podaci
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Ime i prezime</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-card border-border text-foreground"
                  placeholder="Unesite ime i prezime"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-primary text-white font-medium"
            size="lg"
          >
            {isLoading ? 'Spremam promjene...' : 'Spremi promjene'}
          </Button>
        </form>
      </div>
    </MobileLayout>
  );
}