import { useState, useRef, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { Upload, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserWeddings } from "@/hooks/useWedding";
import { useGalleryPhotos, useUploadPhoto, useUpdatePhoto, useDeletePhoto, useReorderPhotos } from "@/hooks/useGallery";
import { toast } from "sonner";

const GalleryManagement = () => {
  const { user } = useAuth();
  const { data: weddings = [] } = useUserWeddings(user?.id || "");
  const wedding = weddings[0];
  const { data: photos = [], isLoading } = useGalleryPhotos(wedding?.id || "");
  const uploadPhoto = useUploadPhoto();
  const updatePhoto = useUpdatePhoto();
  const deletePhoto = useDeletePhoto();
  const reorderPhotos = useReorderPhotos();

  const [orderedPhotos, setOrderedPhotos] = useState(photos);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update ordered photos when data changes
  useEffect(() => {
    setOrderedPhotos(photos);
  }, [photos]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !wedding) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }

      try {
        await uploadPhoto.mutateAsync({
          weddingId: wedding.id,
          file,
          altText: file.name,
        });
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    });

    await Promise.all(uploadPromises);
    setUploading(false);
    toast.success("Photos uploaded successfully");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (photoId: string, imageUrl: string) => {
    if (!wedding) return;
    
    if (confirm("Are you sure you want to delete this photo?")) {
      try {
        await deletePhoto.mutateAsync({
          id: photoId,
          weddingId: wedding.id,
          imageUrl,
        });
        toast.success("Photo deleted successfully");
      } catch (error) {
        toast.error("Failed to delete photo");
      }
    }
  };

  const handleReorder = async () => {
    if (!wedding) return;

    const updates = orderedPhotos.map((photo, index) => ({
      id: photo.id,
      order_index: index,
    }));

    try {
      await reorderPhotos.mutateAsync({
        photos: updates,
        weddingId: wedding.id,
      });
      toast.success("Photo order updated");
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const toggleSpan = async (photoId: string, currentSpan: string) => {
    if (!wedding) return;

    const newSpan = currentSpan === 'row-span-2' ? '' : 'row-span-2';
    
    try {
      await updatePhoto.mutateAsync({
        id: photoId,
        updates: { span_class: newSpan },
      });
      toast.success("Photo size updated");
    } catch (error) {
      toast.error("Failed to update photo");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-foreground mb-2">Gallery Management</h1>
          <p className="font-body text-muted-foreground">
            Upload and manage your wedding photos
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !wedding}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-primary-foreground hover:bg-accent/90 transition-colors rounded-xl font-body text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Photos"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Info */}
      <motion.div
        className="glass-card rounded-xl p-6 border-accent/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <ImageIcon className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-body text-sm font-medium text-foreground mb-1">Upload Guidelines</h3>
            <ul className="font-body text-xs text-muted-foreground space-y-1">
              <li>• Maximum file size: 5MB per image</li>
              <li>• Supported formats: JPG, PNG, WebP</li>
              <li>• Recommended resolution: 1920x1080 or higher</li>
              <li>• Drag photos to reorder them</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <motion.div
          className="glass-card rounded-xl p-12 border-accent/10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-xl text-foreground mb-2">No Photos Yet</h3>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Upload your first wedding photo to get started
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-accent text-primary-foreground hover:bg-accent/90 transition-colors rounded-xl font-body text-sm"
          >
            Upload Photos
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-muted-foreground">
              {photos.length} photo{photos.length !== 1 ? 's' : ''}
            </p>
            {orderedPhotos.length > 0 && (
              <button
                onClick={handleReorder}
                disabled={reorderPhotos.isPending}
                className="px-4 py-2 text-sm font-body text-accent hover:bg-accent/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {reorderPhotos.isPending ? "Saving..." : "Save Order"}
              </button>
            )}
          </div>

          <Reorder.Group
            axis="y"
            values={orderedPhotos}
            onReorder={setOrderedPhotos}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {orderedPhotos.map((photo) => (
              <Reorder.Item
                key={photo.id}
                value={photo}
                className="glass-card rounded-xl overflow-hidden border-accent/10 group cursor-move"
              >
                <div className="relative aspect-video">
                  <img
                    src={photo.image_url}
                    alt={photo.alt_text || 'Wedding photo'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 left-2">
                      <GripVertical className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button
                        onClick={() => toggleSpan(photo.id, photo.span_class || '')}
                        disabled={updatePhoto.isPending}
                        className="p-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                        title="Toggle large size"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id, photo.image_url)}
                        disabled={deletePhoto.isPending}
                        className="p-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {photo.span_class === 'row-span-2' && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-accent/90 text-primary-foreground text-xs font-body rounded">
                      Large
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-body text-xs text-muted-foreground truncate">
                    {photo.alt_text || 'Untitled'}
                  </p>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
