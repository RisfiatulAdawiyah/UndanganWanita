// ============================================
// GALLERY HOOKS - React Query
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, uploadFile, deleteFile } from '@/lib/supabase'
import { GalleryPhoto, GalleryPhotoInsert, GalleryPhotoUpdate } from '@/types/wedding.types'

// ============================================
// QUERY KEYS
// ============================================

export const galleryKeys = {
  all: ['gallery'] as const,
  byWedding: (weddingId: string) => ['gallery', 'wedding', weddingId] as const,
}

// ============================================
// GET GALLERY PHOTOS
// ============================================

export const useGalleryPhotos = (weddingId: string) => {
  return useQuery({
    queryKey: galleryKeys.byWedding(weddingId),
    queryFn: async (): Promise<GalleryPhoto[]> => {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: !!weddingId,
  })
}

// ============================================
// UPLOAD PHOTO
// ============================================

export const useUploadPhoto = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      weddingId, 
      file, 
      altText, 
      spanClass 
    }: { 
      weddingId: string
      file: File
      altText?: string
      spanClass?: string
    }): Promise<GalleryPhoto> => {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${weddingId}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const imageUrl = await uploadFile('wedding-images', fileName, file)

      // Create database record
      const { data, error } = await supabase
        .from('gallery_photos')
        .insert({
          wedding_id: weddingId,
          image_url: imageUrl,
          alt_text: altText || file.name,
          span_class: spanClass || '',
        })
        .select()
        .single()

      if (error) {
        // Cleanup uploaded file if database insert fails
        await deleteFile('wedding-images', fileName).catch(() => {})
        throw error
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.byWedding(data.wedding_id) })
    },
  })
}

// ============================================
// UPDATE PHOTO
// ============================================

export const useUpdatePhoto = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: GalleryPhotoUpdate }): Promise<GalleryPhoto> => {
      const { data, error } = await supabase
        .from('gallery_photos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.byWedding(data.wedding_id) })
    },
  })
}

// ============================================
// DELETE PHOTO
// ============================================

export const useDeletePhoto = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, weddingId, imageUrl }: { id: string; weddingId: string; imageUrl: string }): Promise<void> => {
      // Delete from database
      const { error } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Extract file path from URL and delete from storage
      try {
        const urlParts = imageUrl.split('/wedding-images/')
        if (urlParts.length > 1) {
          const filePath = urlParts[1]
          await deleteFile('wedding-images', filePath)
        }
      } catch (e) {
        // Ignore storage deletion errors
        console.error('Failed to delete file from storage:', e)
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.byWedding(variables.weddingId) })
    },
  })
}

// ============================================
// REORDER PHOTOS
// ============================================

export const useReorderPhotos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ photos, weddingId }: { photos: { id: string; order_index: number }[]; weddingId: string }): Promise<void> => {
      const updates = photos.map(photo =>
        supabase
          .from('gallery_photos')
          .update({ order_index: photo.order_index })
          .eq('id', photo.id)
      )

      const results = await Promise.all(updates)
      const errors = results.filter(r => r.error)
      
      if (errors.length > 0) {
        throw errors[0].error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.byWedding(variables.weddingId) })
    },
  })
}
