// ============================================
// GIFT REGISTRY HOOKS - React Query
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { GiftRegistry, GiftRegistryInsert, GiftRegistryUpdate } from '@/types/wedding.types'

// ============================================
// QUERY KEYS
// ============================================

export const giftRegistryKeys = {
  all: ['gift-registry'] as const,
  byWedding: (weddingId: string) => ['gift-registry', 'wedding', weddingId] as const,
}

// ============================================
// GET GIFT REGISTRY
// ============================================

export const useGiftRegistry = (weddingId: string) => {
  return useQuery({
    queryKey: giftRegistryKeys.byWedding(weddingId),
    queryFn: async (): Promise<GiftRegistry[]> => {
      const { data, error } = await supabase
        .from('gift_registry')
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
// CREATE GIFT REGISTRY ITEM
// ============================================

export const useCreateGiftRegistry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (item: GiftRegistryInsert): Promise<GiftRegistry> => {
      const { data, error } = await supabase
        .from('gift_registry')
        .insert(item)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: giftRegistryKeys.byWedding(data.wedding_id) })
    },
  })
}

// ============================================
// UPDATE GIFT REGISTRY ITEM
// ============================================

export const useUpdateGiftRegistry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: GiftRegistryUpdate }): Promise<GiftRegistry> => {
      const { data, error } = await supabase
        .from('gift_registry')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: giftRegistryKeys.byWedding(data.wedding_id) })
    },
  })
}

// ============================================
// DELETE GIFT REGISTRY ITEM
// ============================================

export const useDeleteGiftRegistry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, weddingId }: { id: string; weddingId: string }): Promise<void> => {
      const { error } = await supabase
        .from('gift_registry')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: giftRegistryKeys.byWedding(variables.weddingId) })
    },
  })
}

// ============================================
// REORDER GIFT REGISTRY ITEMS
// ============================================

export const useReorderGiftRegistry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ items, weddingId }: { items: { id: string; order_index: number }[]; weddingId: string }): Promise<void> => {
      const updates = items.map(item =>
        supabase
          .from('gift_registry')
          .update({ order_index: item.order_index })
          .eq('id', item.id)
      )

      const results = await Promise.all(updates)
      const errors = results.filter(r => r.error)
      
      if (errors.length > 0) {
        throw errors[0].error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: giftRegistryKeys.byWedding(variables.weddingId) })
    },
  })
}
