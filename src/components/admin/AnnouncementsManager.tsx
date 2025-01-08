import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  is_active: boolean;
  created_at: string;
}

export const AnnouncementsManager = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("general");

  const { data: announcements, refetch } = useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('announcements')
        .insert([{ title, content, type }]);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Duyuru başarıyla oluşturuldu.",
      });

      setIsOpen(false);
      setTitle("");
      setContent("");
      setType("general");
      refetch();
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Hata",
        description: "Duyuru oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Duyuru durumu güncellendi.",
      });

      refetch();
    } catch (error) {
      console.error('Error toggling announcement:', error);
      toast({
        title: "Hata",
        description: "Duyuru güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Yeni Duyuru</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Duyuru Oluştur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Başlık"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="İçerik"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Duyuru Tipi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Genel</SelectItem>
                  <SelectItem value="maintenance">Bakım</SelectItem>
                  <SelectItem value="update">Güncelleme</SelectItem>
                  <SelectItem value="important">Önemli</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSubmit} className="w-full">
                Oluştur
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[400px] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements?.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell>{announcement.title}</TableCell>
                <TableCell>{announcement.type}</TableCell>
                <TableCell>
                  {new Date(announcement.created_at).toLocaleString('tr-TR')}
                </TableCell>
                <TableCell>
                  {announcement.is_active ? 'Aktif' : 'Pasif'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(announcement.id, announcement.is_active)}
                  >
                    {announcement.is_active ? 'Pasif Yap' : 'Aktif Yap'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};