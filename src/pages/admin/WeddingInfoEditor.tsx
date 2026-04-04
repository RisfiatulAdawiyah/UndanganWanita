import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserWeddings, useUpdateWedding } from "@/hooks/useWedding";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Save, Heart, Calendar, MapPin, BookOpen, Music, Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const WeddingInfoEditor = () => {
  const { user } = useAuth();
  const { data: weddings, isLoading } = useUserWeddings(user?.id || "");
  const updateWedding = useUpdateWedding();
  
  const wedding = weddings?.[0];
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const [formData, setFormData] = useState({
    groom_name: "",
    groom_full_name: "",
    groom_father: "",
    groom_mother: "",
    bride_name: "",
    bride_full_name: "",
    bride_father: "",
    bride_mother: "",
    wedding_date: "",
    akad_date: "",
    akad_end: "",
    akad_venue: "",
    akad_address: "",
    akad_maps_url: "",
    resepsi_date: "",
    resepsi_end: "",
    resepsi_venue: "",
    resepsi_address: "",
    resepsi_maps_url: "",
    main_verse_arabic: "",
    main_verse_transliteration: "",
    main_verse_translation: "",
    main_verse_reference: "",
    quote_verse_arabic: "",
    quote_verse_translation: "",
    quote_verse_reference: "",
    music_url: "",
  });

  // Update form data when wedding data is loaded
  useEffect(() => {
    if (wedding) {
      setFormData({
        groom_name: wedding.groom_name || "",
        groom_full_name: wedding.groom_full_name || "",
        groom_father: wedding.groom_father || "",
        groom_mother: wedding.groom_mother || "",
        bride_name: wedding.bride_name || "",
        bride_full_name: wedding.bride_full_name || "",
        bride_father: wedding.bride_father || "",
        bride_mother: wedding.bride_mother || "",
        wedding_date: wedding.wedding_date || "",
        akad_date: wedding.akad_date || "",
        akad_end: wedding.akad_end || "",
        akad_venue: wedding.akad_venue || "",
        akad_address: wedding.akad_address || "",
        akad_maps_url: wedding.akad_maps_url || "",
        resepsi_date: wedding.resepsi_date || "",
        resepsi_end: wedding.resepsi_end || "",
        resepsi_venue: wedding.resepsi_venue || "",
        resepsi_address: wedding.resepsi_address || "",
        resepsi_maps_url: wedding.resepsi_maps_url || "",
        main_verse_arabic: wedding.main_verse_arabic || "",
        main_verse_transliteration: wedding.main_verse_transliteration || "",
        main_verse_translation: wedding.main_verse_translation || "",
        main_verse_reference: wedding.main_verse_reference || "",
        quote_verse_arabic: wedding.quote_verse_arabic || "",
        quote_verse_translation: wedding.quote_verse_translation || "",
        quote_verse_reference: wedding.quote_verse_reference || "",
        music_url: wedding.music_url || "",
      });
    }
  }, [wedding]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'video/mp4'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|mp4)$/i)) {
      toast.error("Please upload MP3 or MP4 file only");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploadingMusic(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${wedding?.id || 'temp'}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Delete old music file if exists
      if (formData.music_url) {
        try {
          const oldFileName = formData.music_url.split('/').pop();
          if (oldFileName) {
            await supabase.storage.from('wedding-music').remove([oldFileName]);
          }
        } catch (error) {
          console.error('Error deleting old music:', error);
        }
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('wedding-music')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('wedding-music')
        .getPublicUrl(data.path);

      // Update form data
      setFormData(prev => ({ ...prev, music_url: publicUrl }));
      toast.success("Music uploaded successfully");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload music");
    } finally {
      setIsUploadingMusic(false);
    }
  };

  const handleRemoveMusic = async () => {
    if (!formData.music_url) return;

    try {
      // Delete from storage
      const fileName = formData.music_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('wedding-music').remove([fileName]);
      }
      
      // Clear form data
      setFormData(prev => ({ ...prev, music_url: "" }));
      toast.success("Music removed");
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to remove music");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wedding?.id) {
      toast.error("Wedding not found");
      return;
    }

    try {
      await updateWedding.mutateAsync({
        id: wedding.id,
        updates: formData,
      });
      toast.success("Wedding info updated successfully");
    } catch (error) {
      toast.error("Failed to update wedding info");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No wedding found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground mb-2">Wedding Information</h1>
        <p className="font-body text-muted-foreground">Edit your wedding details and information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Groom Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Groom Information
            </CardTitle>
            <CardDescription>Information about the groom</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groom_name">Groom Name (Short)</Label>
                <Input
                  id="groom_name"
                  value={formData.groom_name}
                  onChange={(e) => handleChange("groom_name", e.target.value)}
                  placeholder="Ahmad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groom_full_name">Full Name</Label>
                <Input
                  id="groom_full_name"
                  value={formData.groom_full_name}
                  onChange={(e) => handleChange("groom_full_name", e.target.value)}
                  placeholder="Ahmad Rizki Pratama, S.Kom"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groom_father">Father's Name</Label>
                <Input
                  id="groom_father"
                  value={formData.groom_father}
                  onChange={(e) => handleChange("groom_father", e.target.value)}
                  placeholder="Bapak Suryanto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groom_mother">Mother's Name</Label>
                <Input
                  id="groom_mother"
                  value={formData.groom_mother}
                  onChange={(e) => handleChange("groom_mother", e.target.value)}
                  placeholder="Ibu Siti Aminah"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bride Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent fill-accent" />
              Bride Information
            </CardTitle>
            <CardDescription>Information about the bride</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bride_name">Bride Name (Short)</Label>
                <Input
                  id="bride_name"
                  value={formData.bride_name}
                  onChange={(e) => handleChange("bride_name", e.target.value)}
                  placeholder="Siti"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bride_full_name">Full Name</Label>
                <Input
                  id="bride_full_name"
                  value={formData.bride_full_name}
                  onChange={(e) => handleChange("bride_full_name", e.target.value)}
                  placeholder="Siti Nurhaliza, S.Pd"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bride_father">Father's Name</Label>
                <Input
                  id="bride_father"
                  value={formData.bride_father}
                  onChange={(e) => handleChange("bride_father", e.target.value)}
                  placeholder="Bapak Abdullah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bride_mother">Mother's Name</Label>
                <Input
                  id="bride_mother"
                  value={formData.bride_mother}
                  onChange={(e) => handleChange("bride_mother", e.target.value)}
                  placeholder="Ibu Fatimah"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wedding Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Wedding Date
            </CardTitle>
            <CardDescription>Main wedding date for countdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="wedding_date">Wedding Date</Label>
              <Input
                id="wedding_date"
                type="date"
                value={formData.wedding_date}
                onChange={(e) => handleChange("wedding_date", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Akad Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Akad Nikah Details
            </CardTitle>
            <CardDescription>Ceremony details and location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="akad_date">Date</Label>
                <Input
                  id="akad_date"
                  type="date"
                  value={formData.akad_date}
                  onChange={(e) => handleChange("akad_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="akad_end">Time</Label>
                <Input
                  id="akad_end"
                  value={formData.akad_end}
                  onChange={(e) => handleChange("akad_end", e.target.value)}
                  placeholder="08:00 - 10:00 WIB"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="akad_venue">Venue Name</Label>
              <Input
                id="akad_venue"
                value={formData.akad_venue}
                onChange={(e) => handleChange("akad_venue", e.target.value)}
                placeholder="Masjid Al-Ikhlas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="akad_address">Address</Label>
              <Textarea
                id="akad_address"
                value={formData.akad_address}
                onChange={(e) => handleChange("akad_address", e.target.value)}
                placeholder="Jl. Raya Bogor No. 123, Jakarta Timur"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="akad_maps_url">Google Maps URL</Label>
              <Input
                id="akad_maps_url"
                value={formData.akad_maps_url}
                onChange={(e) => handleChange("akad_maps_url", e.target.value)}
                placeholder="https://maps.app.goo.gl/xxxxx or https://www.google.com/maps/..."
              />
              <p className="text-xs text-muted-foreground">
                Paste any Google Maps link (will be displayed in iframe and button)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resepsi Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Reception Details
            </CardTitle>
            <CardDescription>Reception details and location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resepsi_date">Date</Label>
                <Input
                  id="resepsi_date"
                  type="date"
                  value={formData.resepsi_date}
                  onChange={(e) => handleChange("resepsi_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resepsi_end">Time</Label>
                <Input
                  id="resepsi_end"
                  value={formData.resepsi_end}
                  onChange={(e) => handleChange("resepsi_end", e.target.value)}
                  placeholder="11:00 - 14:00 WIB"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resepsi_venue">Venue Name</Label>
              <Input
                id="resepsi_venue"
                value={formData.resepsi_venue}
                onChange={(e) => handleChange("resepsi_venue", e.target.value)}
                placeholder="Gedung Serbaguna Al-Hikmah"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resepsi_address">Address</Label>
              <Textarea
                id="resepsi_address"
                value={formData.resepsi_address}
                onChange={(e) => handleChange("resepsi_address", e.target.value)}
                placeholder="Jl. Raya Bogor No. 123, Jakarta Timur"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resepsi_maps_url">Google Maps URL</Label>
              <Input
                id="resepsi_maps_url"
                value={formData.resepsi_maps_url}
                onChange={(e) => handleChange("resepsi_maps_url", e.target.value)}
                placeholder="https://maps.app.goo.gl/xxxxx or https://www.google.com/maps/..."
              />
              <p className="text-xs text-muted-foreground">
                Paste any Google Maps link (will be displayed in iframe and button)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quran Verse */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Quran Verse
            </CardTitle>
            <CardDescription>Main Quran verse for the invitation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="main_verse_arabic">Arabic Text</Label>
              <Textarea
                id="main_verse_arabic"
                value={formData.main_verse_arabic}
                onChange={(e) => handleChange("main_verse_arabic", e.target.value)}
                placeholder="وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا"
                rows={3}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="main_verse_transliteration">Transliteration</Label>
              <Textarea
                id="main_verse_transliteration"
                value={formData.main_verse_transliteration}
                onChange={(e) => handleChange("main_verse_transliteration", e.target.value)}
                placeholder="Wa min ayatihi an khalaqa lakum min anfusikum azwajan..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="main_verse_translation">Translation</Label>
              <Textarea
                id="main_verse_translation"
                value={formData.main_verse_translation}
                onChange={(e) => handleChange("main_verse_translation", e.target.value)}
                placeholder="And among His signs is that He created for you mates from among yourselves..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="main_verse_reference">Reference</Label>
              <Input
                id="main_verse_reference"
                value={formData.main_verse_reference}
                onChange={(e) => handleChange("main_verse_reference", e.target.value)}
                placeholder="QS. Ar-Rum: 21"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quote */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Quote Section
            </CardTitle>
            <CardDescription>Inspirational quote for the invitation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quote_verse_arabic">Quote Arabic Text</Label>
              <Textarea
                id="quote_verse_arabic"
                value={formData.quote_verse_arabic}
                onChange={(e) => handleChange("quote_verse_arabic", e.target.value)}
                placeholder="Love is not about how many days, months, or years you have been together..."
                rows={3}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote_verse_translation">Quote Translation</Label>
              <Textarea
                id="quote_verse_translation"
                value={formData.quote_verse_translation}
                onChange={(e) => handleChange("quote_verse_translation", e.target.value)}
                placeholder="Translation of the quote..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote_verse_reference">Quote Reference</Label>
              <Input
                id="quote_verse_reference"
                value={formData.quote_verse_reference}
                onChange={(e) => handleChange("quote_verse_reference", e.target.value)}
                placeholder="Source or author"
              />
            </div>
          </CardContent>
        </Card>

        {/* Background Music */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5 text-accent" />
              Background Music
            </CardTitle>
            <CardDescription>Add background music to your wedding invitation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!formData.music_url ? (
              <div className="space-y-3">
                <Label htmlFor="music_file">Upload Music File</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploadingMusic}
                    onClick={() => document.getElementById('music_file')?.click()}
                    className="w-full"
                  >
                    {isUploadingMusic ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose MP3 or MP4 File
                      </>
                    )}
                  </Button>
                  <input
                    id="music_file"
                    type="file"
                    accept=".mp3,.mp4,audio/mpeg,audio/mp3,audio/mp4,video/mp4"
                    onChange={handleMusicUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 10MB. Supported formats: MP3, MP4
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Label>Current Music</Label>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                  <Music className="w-4 h-4 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Background Music</p>
                    <p className="text-xs text-muted-foreground truncate">{formData.music_url.split('/').pop()}</p>
                  </div>
                  <audio controls className="h-8">
                    <source src={formData.music_url} type={formData.music_url.endsWith('.mp4') ? 'audio/mp4' : 'audio/mpeg'} />
                  </audio>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveMusic}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploadingMusic}
                  onClick={() => document.getElementById('music_file')?.click()}
                >
                  {isUploadingMusic ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Replace Music
                    </>
                  )}
                </Button>
                <input
                  id="music_file"
                  type="file"
                  accept=".mp3,.mp4,audio/mpeg,audio/mp3,audio/mp4,video/mp4"
                  onChange={handleMusicUpload}
                  className="hidden"
                />
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Tips:</h4>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>Use instrumental or romantic music for best experience</li>
                <li>Keep file size under 10MB for faster loading</li>
                <li>Music will auto-play when guests open the invitation</li>
                <li>Guests can pause/play using the button on the website</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={updateWedding.isPending}
            className="bg-accent hover:bg-accent/90"
          >
            {updateWedding.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WeddingInfoEditor;
