import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserWeddings } from "@/hooks/useWedding";
import { useGiftRegistry, useCreateGiftRegistry, useUpdateGiftRegistry, useDeleteGiftRegistry } from "@/hooks/useGiftRegistry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, CreditCard, Wallet, Gift as GiftIcon } from "lucide-react";
import { GiftRegistry, GiftRegistryInsert, BANK_OPTIONS } from "@/types/wedding.types";

const GiftRegistryManagement = () => {
  const { user } = useAuth();
  const { data: weddings, isLoading: weddingsLoading } = useUserWeddings(user?.id || "");
  const wedding = weddings?.[0];
  
  const { data: giftItems, isLoading } = useGiftRegistry(wedding?.id || "");
  const createGift = useCreateGiftRegistry();
  const updateGift = useUpdateGiftRegistry();
  const deleteGift = useDeleteGiftRegistry();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GiftRegistry | null>(null);
  const [formData, setFormData] = useState<Partial<GiftRegistryInsert>>({
    type: "bank",
    account_name: "",
    account_number: "",
    bank_name: "",
    item_name: "",
    item_description: "",
    item_link: "",
  });

  const handleOpenDialog = (item?: GiftRegistry) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        type: item.type,
        account_name: item.account_name || "",
        account_number: item.account_number || "",
        bank_name: item.bank_name || "",
        item_name: item.item_name || "",
        item_description: item.item_description || "",
        item_link: item.item_link || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        type: "bank",
        account_name: "",
        account_number: "",
        bank_name: "",
        item_name: "",
        item_description: "",
        item_link: "",
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
      if (editingItem) {
        await updateGift.mutateAsync({
          id: editingItem.id,
          updates: formData,
        });
        toast.success("Gift registry updated");
      } else {
        await createGift.mutateAsync({
          wedding_id: wedding.id,
          ...formData,
        } as GiftRegistryInsert);
        toast.success("Gift registry added");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save gift registry");
      console.error(error);
    }
  };

  const handleDelete = async (id: string, weddingId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteGift.mutateAsync({ id, weddingId });
      toast.success("Gift registry deleted");
    } catch (error) {
      toast.error("Failed to delete gift registry");
      console.error(error);
    }
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

  const bankItems = giftItems?.filter(item => item.type === "bank") || [];
  const ewalletItems = giftItems?.filter(item => item.type === "ewallet") || [];
  const giftItemsList = giftItems?.filter(item => item.type === "gift_item") || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-2">Gift Registry</h1>
          <p className="font-body text-muted-foreground">Manage bank accounts, e-wallets, and gift items</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bank Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              Bank Accounts
            </CardTitle>
            <CardDescription>{bankItems.length} accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bankItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No bank accounts</p>
            ) : (
              bankItems.map((item) => (
                <div key={item.id} className="p-3 rounded-lg border border-border/50 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.bank_name}</p>
                      <p className="text-xs text-muted-foreground">{item.account_name}</p>
                      <p className="text-xs font-mono mt-1">{item.account_number}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id, item.wedding_id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* E-Wallets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-accent" />
              E-Wallets
            </CardTitle>
            <CardDescription>{ewalletItems.length} wallets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ewalletItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No e-wallets</p>
            ) : (
              ewalletItems.map((item) => (
                <div key={item.id} className="p-3 rounded-lg border border-border/50 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.bank_name}</p>
                      <p className="text-xs text-muted-foreground">{item.account_name}</p>
                      <p className="text-xs font-mono mt-1">{item.account_number}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id, item.wedding_id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Gift Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GiftIcon className="w-5 h-5 text-accent" />
              Gift Items
            </CardTitle>
            <CardDescription>{giftItemsList.length} items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {giftItemsList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No gift items</p>
            ) : (
              giftItemsList.map((item) => (
                <div key={item.id} className="p-3 rounded-lg border border-border/50 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.item_name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.item_description}</p>
                      {item.item_link && (
                        <a
                          href={item.item_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline mt-1 inline-block"
                        >
                          View Link
                        </a>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id, item.wedding_id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit" : "Add"} Gift Registry</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update" : "Add new"} bank account, e-wallet, or gift item
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Account</SelectItem>
                  <SelectItem value="ewallet">E-Wallet</SelectItem>
                  <SelectItem value="gift_item">Gift Item</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.type === "bank" || formData.type === "ewallet") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bank_name">{formData.type === "bank" ? "Bank Name" : "E-Wallet Name"}</Label>
                  <Select
                    value={formData.bank_name}
                    onValueChange={(value) => setFormData({ ...formData, bank_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {BANK_OPTIONS.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_name">Account Name</Label>
                  <Input
                    id="account_name"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    id="account_number"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    placeholder="1234567890"
                    required
                  />
                </div>
              </>
            )}

            {formData.type === "gift_item" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="item_name">Item Name</Label>
                  <Input
                    id="item_name"
                    value={formData.item_name}
                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                    placeholder="Kitchen Set"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item_description">Description</Label>
                  <Textarea
                    id="item_description"
                    value={formData.item_description}
                    onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
                    placeholder="Complete kitchen set with..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item_link">Link (Optional)</Label>
                  <Input
                    id="item_link"
                    value={formData.item_link}
                    onChange={(e) => setFormData({ ...formData, item_link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createGift.isPending || updateGift.isPending}
                className="bg-accent hover:bg-accent/90"
              >
                {(createGift.isPending || updateGift.isPending) ? (
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

export default GiftRegistryManagement;
