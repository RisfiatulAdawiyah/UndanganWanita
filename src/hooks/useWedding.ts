// ============================================
// WEDDING HOOKS - React Query
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Wedding, WeddingInsert, WeddingUpdate, WeddingWithRelations } from '@/types/wedding.types'
import { Database } from '@/types/database.types'

// ============================================
// QUERY KEYS
// ============================================

export const weddingKeys = {
  all: ['weddings'] as const,
  bySlug: (slug: string) => ['weddings', 'slug', slug] as const,
  byId: (id: string) => ['weddings', 'id', id] as const,
  userWeddings: (userId: string) => ['weddings', 'user', userId] as const,
}

// ============================================
// GET WEDDING BY SLUG (Public)
// ============================================

export const useWeddingBySlug = (slug: string) => {
  return useQuery({
    queryKey: weddingKeys.bySlug(slug),
    queryFn: async (): Promise<WeddingWithRelations | null> => {
      const { data, error } = await supabase
        .from('weddings')
        .select(`
          *,
          love_stories (*),
          gallery_photos (*),
          gift_registry (*)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }

      return data
    },
    enabled: !!slug,
  })
}

// ============================================
// GET WEDDING BY ID (Admin)
// ============================================

export const useWeddingById = (id: string) => {
  return useQuery({
    queryKey: weddingKeys.byId(id),
    queryFn: async (): Promise<WeddingWithRelations | null> => {
      const { data, error } = await supabase
        .from('weddings')
        .select(`
          *,
          love_stories (*),
          gallery_photos (*),
          gift_registry (*),
          guest_list (*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        throw error
      }

      return data
    },
    enabled: !!id,
  })
}

// ============================================
// GET USER WEDDINGS
// ============================================

export const useUserWeddings = (userId: string) => {
  return useQuery({
    queryKey: weddingKeys.userWeddings(userId),
    queryFn: async (): Promise<Wedding[]> => {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

// ============================================
// CREATE WEDDING
// ============================================

export const useCreateWedding = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (wedding: WeddingInsert): Promise<Wedding> => {
      const { data, error } = await (supabase
        .from('weddings')
        .insert as any)(wedding)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: weddingKeys.userWeddings(data.user_id) })
    },
  })
}

// ============================================
// UPDATE WEDDING
// ============================================

export const useUpdateWedding = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: WeddingUpdate }): Promise<Wedding> => {
      const { data, error } = await (supabase
        .from('weddings')
        .update as any)(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: weddingKeys.byId(data.id) })
      queryClient.invalidateQueries({ queryKey: weddingKeys.bySlug(data.slug) })
      queryClient.invalidateQueries({ queryKey: weddingKeys.userWeddings(data.user_id) })
    },
  })
}

// ============================================
// DELETE WEDDING
// ============================================

export const useDeleteWedding = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('weddings')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: weddingKeys.all })
    },
  })
}

// ============================================
// CHECK SLUG AVAILABILITY
// ============================================

export const useCheckSlug = () => {
  return useMutation({
    mutationFn: async (slug: string): Promise<boolean> => {
      const { data, error } = await supabase
        .from('weddings')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()

      if (error) throw error
      return !data // true if available
    },
  })
}
