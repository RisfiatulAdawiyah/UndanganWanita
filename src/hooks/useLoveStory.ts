// ============================================
// LOVE STORY HOOKS - React Query
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { LoveStory, LoveStoryInsert, LoveStoryUpdate } from '@/types/wedding.types'

// ============================================
// QUERY KEYS
// ============================================

export const loveStoryKeys = {
  all: ['love-stories'] as const,
  byWedding: (weddingId: string) => ['love-stories', 'wedding', weddingId] as const,
}

// ============================================
// GET LOVE STORIES
// ============================================

export const useLoveStories = (weddingId: string) => {
  return useQuery({
    queryKey: loveStoryKeys.byWedding(weddingId),
    queryFn: async (): Promise<LoveStory[]> => {
      const { data, error } = await supabase
        .from('love_stories')
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
// CREATE LOVE STORY
// ============================================

export const useCreateLoveStory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (story: LoveStoryInsert): Promise<LoveStory> => {
      const { data, error } = await (supabase as any)
        .from('love_stories')
        .insert(story)
        .select()
        .single()

      if (error) throw error
      return data as LoveStory
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: loveStoryKeys.byWedding(data.wedding_id) })
    },
  })
}

// ============================================
// UPDATE LOVE STORY
// ============================================

export const useUpdateLoveStory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: LoveStoryUpdate }): Promise<LoveStory> => {
      const { data, error } = await (supabase as any)
        .from('love_stories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as LoveStory
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: loveStoryKeys.byWedding(data.wedding_id) })
    },
  })
}

// ============================================
// DELETE LOVE STORY
// ============================================

export const useDeleteLoveStory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, weddingId }: { id: string; weddingId: string }): Promise<void> => {
      const { error } = await supabase
        .from('love_stories')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: loveStoryKeys.byWedding(variables.weddingId) })
    },
  })
}

// ============================================
// REORDER LOVE STORIES
// ============================================

export const useReorderLoveStories = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ stories, weddingId }: { stories: { id: string; order_index: number }[]; weddingId: string }): Promise<void> => {
      const updates = stories.map(story =>
        (supabase as any)
          .from('love_stories')
          .update({ order_index: story.order_index })
          .eq('id', story.id)
      )

      const results = await Promise.all(updates)
      const errors = results.filter(r => r.error)
      
      if (errors.length > 0) {
        throw errors[0].error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: loveStoryKeys.byWedding(variables.weddingId) })
    },
  })
}

