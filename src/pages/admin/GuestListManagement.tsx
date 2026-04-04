import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserWeddings } from "@/hooks/useWedding";
import { useGuestList, useCreateGuest, useUpdateGuest, useDeleteGuest } from "@/hooks/useGuestList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, Users, Download, Search } from "lucide-react";
import { GuestList, GuestListInsert, GUEST_CATEGORIES } from "@/types/wedding.types";

const GuestListManagement = () => {
  const { user } = useAuth();
  const { data: weddings, isLoading: weddingsLoading } = useUserWeddings(user?.id || "");
  const wedding = weddings?.[0];
  
  const { data: guests, isLoading } = useGuestList(wedding?.id || "");
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestList | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [formData, setFormData] = useState<Partial<GuestListInsert>>({
    name: "",
    phone: "",
    address: "",
    category: "keluarga",
    invitation_sent: false,
    notes: "",
  });

  const handleOpenDialog = (guest?: GuestList) => {
    if (guest) {
      setEditingGuest(guest);
      setFormData({
        name: guest.name,
        phone: guest.phone || "",
        address: guest.address || "",
        category: guest.category,
        invitation_sent: guest.invitation_sent,
        notes: guest.notes || "",
      });
    } else {
      setEditingGuest(null);
      setFormData({
        name: "",
        phone: "",
        address: "",
        category: "keluarga",
        invitation_sent: false,
        notes: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wedding?.id) {
      toast.error("Wedding not found");
      return;
    }

    try {
      if (editingGuest) {
        await updateGuest.mutateAsync({
          id: editingGuest.id,
          updates: formData,
        });
        toast.success("Guest updated");
      } else {
        await createGuest.mutateAsync({
          wedding_id: wedding.id,
          ...formData,
        } as GuestListInsert);
        toast.success("Guest added");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save guest");
      console.error(error);
    }
  };

  const handleDelete = async (id: string, weddingId: string) => {
    if (!confirm("Are you sure you want to delete this guest?")) return;

    try {
      await deleteGuest.mutateAsync({ id, weddingId });
      toast.success("Guest deleted");
    } catch (error) {
      toast.error("Failed to delete guest");
      console.error(error);
    }
  };

  const handleExportCSV = () => {
    if (!guests || guests.length === 0) {
      toast.error("No guests to export");
      return;
    }

    const headers = ["Name", "Phone", "Address", "Category", "Invitation Sent", "Notes"];
    const rows = guests.map(guest => [
      guest.name,
      guest.phone || "",
      guest.address || "",
      guest.category,
      guest.invitation_sent ? "Yes" : "No",
      guest.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guest-list-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Guest list exported");
  };

  if (weddingsLoading || isLoading) {
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

  const filteredGuests = guests?.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guest.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || guest.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const stats = {
    total: guests?.length || 0,
    sent: guests?.filter(g => g.invitation_sent).length || 0,
    keluarga: guests?.filter(g => g.category === "keluarga").length || 0,
    teman: guests?.filter(g => g.category === "teman").length || 0,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-2">Guest List</h1>
          <p className="font-body text-muted-foreground">Manage your wedding guest list</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => handleOpenDialog()} className="bg-accent hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Guest
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Guests</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Invitations Sent</CardDescription>
            <CardTitle className="text-3xl">{stats.sent}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Keluarga</CardDescription>
            <CardTitle className="text-3xl">{stats.keluarga}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Teman</CardDescription>
            <CardTitle className="text-3xl">{stats.teman}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {GUEST_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Invitation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No guests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGuests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">{guest.name}</TableCell>
                      <TableCell className="text-muted-foreground">{guest.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {guest.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {guest.invitation_sent ? (
                          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                            Sent
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Not Sent</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenDialog(guest)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(guest.id, guest.wedding_id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingGuest ? "Edit" : "Add"} Guest</DialogTitle>
            <DialogDescription>
              {editingGuest ? "Update" : "Add new"} guest to your wedding list
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+62 812 3456 7890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GUEST_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="invitation_sent"
                checked={formData.invitation_sent}
                onCheckedChange={(checked) => setFormData({ ...formData, invitation_sent: checked as boolean })}
              />
              <Label htmlFor="invitation_sent" className="cursor-pointer">
                Invitation sent
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createGuest.isPending || updateGuest.isPending}
                className="bg-accent hover:bg-accent/90"
              >
                {(createGuest.isPending || updateGuest.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestListManagement;
