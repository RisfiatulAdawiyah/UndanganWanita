import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserWeddings } from "@/hooks/useWedding";
import { useLoveStories, useCreateLoveStory, useUpdateLoveStory, useDeleteLoveStory, useReorderLoveStories } from "@/hooks/useLoveStory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, GripVertical, Heart, Sparkles, Star, Gift, PartyPopper, Calendar, MessageCircle, Camera } from "lucide-react";
import { LoveStory, LoveStoryInsert } from "@/types/wedding.types";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

const iconMap = {
  heart: Heart,
  sparkles: Sparkles,
  star: Star,
  gift: Gift,
  "party-popper": PartyPopper,
  calendar: Calendar,
  "message-circle": MessageCircle,
  camera: Camera,
};

const iconOptions = [
  { value: "heart", label: "Heart", Icon: Heart },
  { value: "sparkles", label: "Sparkles", Icon: Sparkles },
  { value: "star", label: "Star", Icon: Star },
  { value: "gift", label: "Gift", Icon: Gift },
  { value: "party-popper", label: "Party", Icon: PartyPopper },
  { value: "calendar", label: "Calendar", Icon: Calendar },
  { value: "message-circle", label: "Message", Icon: MessageCircle },
  { value: "camera", label: "Camera", Icon: Camera },
];

const LoveStoryManagement = () => {
  const { user } = useAuth();
  const { data: weddings, isLoading: weddingsLoading } = useUserWeddings(user?.id || "");
  const wedding = weddings?.[0];
  
  const { data: stories, isLoading } = useLoveStories(wedding?.id || "");
  const createStory = useCreateLoveStory();
  const updateStory = useUpdateLoveStory();
  const deleteStory = useDeleteLoveStory();
  const reorderStory = useReorderLoveStories();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<LoveStory | null>(null);
  const [formData, setFormData] = useState<Partial<LoveStoryInsert>>({
    date: "",
    title: "",
    description: "",
    icon: "heart",
  });

  const handleOpenDialog = (story?: LoveStory) => {
    if (story) {
      setEditingStory(story);
      setFormData({
        date: story.date,
        title: story.title,
        description: story.description,
        icon: story.icon,
      });
    } else {
      setEditingStory(null);
      setFormData({
        date: "",
        title: "",
        description: "",
        icon: "heart",
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
      if (editingStory) {
        await updateStory.mutateAsync({
          id: editingStory.id,
          updates: formData,
        });
        toast.success("Love story updated");
      } else {
        await createStory.mutateAsync({
          wedding_id: wedding.id,
          ...formData,
        } as LoveStoryInsert);
        toast.success("Love story added");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save love story");
      console.error(error);
    }
  };

  const handleDelete = async (id: string, weddingId: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      await deleteStory.mutateAsync({ id, weddingId });
      toast.success("Love story deleted");
    } catch (error) {
      toast.error("Failed to delete love story");
      console.error(error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !stories || !wedding?.id) return;

    const items = Array.from(stories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      order_index: index,
    }));

    try {
      await reorderStory.mutateAsync({
        stories: updates,
        weddingId: wedding.id,
      });
      toast.success("Order updated");
    } catch (error) {
      toast.error("Failed to reorder stories");
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-2">Love Story Timeline</h1>
          <p className="font-body text-muted-foreground">Manage your love story events</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline Events</CardTitle>
          <CardDescription>
            Drag and drop to reorder events. They will appear in this order on your invitation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!stories || stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No love story events yet</p>
              <Button
                onClick={() => handleOpenDialog()}
                variant="outline"
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Event
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="love-stories">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {stories.map((story, index) => {
                      const IconComponent = iconMap[story.icon as keyof typeof iconMap] || Heart;
                      
                      return (
                        <Draggable key={story.id} draggableId={story.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`p-4 rounded-lg border border-border/50 bg-background transition-shadow ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mt-1 cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                                </div>
                                
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                  <IconComponent className="w-5 h-5 text-accent" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <p className="font-medium text-foreground">{story.title}</p>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(story.date).toLocaleDateString("id-ID", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </p>
                                      <p className="text-sm text-muted-foreground mt-2">
                                        {story.description}
                                      </p>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleOpenDialog(story)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(story.id, story.wedding_id)}
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStory ? "Edit" : "Add"} Love Story Event</DialogTitle>
            <DialogDescription>
              {editingStory ? "Update" : "Add new"} event to your love story timeline
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="First Meeting"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="We met at a coffee shop..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => {
                    const Icon = option.Icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createStory.isPending || updateStory.isPending}
                className="bg-accent hover:bg-accent/90"
              >
                {(createStory.isPending || updateStory.isPending) ? (
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

export default LoveStoryManagement;
