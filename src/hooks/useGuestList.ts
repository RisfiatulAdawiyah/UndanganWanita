// ============================================
// GUEST LIST HOOKS - React Query
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { GuestList, GuestListInsert, GuestListUpdate } from '@/types/wedding.types'

// ============================================
// QUERY KEYS
// ============================================

export const guestListKeys = {
  all: ['guest-list'] as const,
  byWedding: (weddingId: string) => ['guest-list', 'wedding', weddingId] as const,
}

// ============================================
// GET GUEST LIST
// ============================================

export const useGuestList = (weddingId: string) => {
  return useQuery({
    queryKey: guestListKeys.byWedding(weddingId),
    queryFn: async (): Promise<GuestList[]> => {
      const { data, error } = await supabase
        .from('guest_list')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!weddingId,
  })
}

// ============================================
// CREATE GUEST
// ============================================

export const useCreateGuest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (guest: GuestListInsert): Promise<GuestList> => {
      const { data, error } = await supabase
        .from('guest_list')
        .insert(guest)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: guestListKeys.byWedding(data.wedding_id) })
    },
  })
}

// ============================================
// UPDATE GUEST
// ============================================

export const useUpdateGuest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: GuestListUpdate }): Promise<GuestList> => {
      const { data, error } = await supabase
        .from('guest_list')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: guestListKeys.byWedding(data.wedding_id) })
    },
  })
}

// ============================================
// DELETE GUEST
// ============================================

export const useDeleteGuest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, weddingId }: { id: string; weddingId: string }): Promise<void> => {
      const { error } = await supabase
        .from('guest_list')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: guestListKeys.byWedding(variables.weddingId) })
    },
  })
}

// ============================================
// BULK DELETE GUESTS
// ============================================

export const useBulkDeleteGuests = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ids, weddingId }: { ids: string[]; weddingId: string }): Promise<void> => {
      const { error } = await supabase
        .from('guest_list')
        .delete()
        .in('id', ids)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: guestListKeys.byWedding(variables.weddingId) })
    },
  })
}

// ============================================
// EXPORT GUEST LIST TO CSV
// ============================================

export const exportGuestListToCSV = (guests: GuestList[], filename: string = 'guest-list.csv') => {
  const headers = ['No', 'Nama', 'Telepon', 'Alamat', 'Kategori', 'Undangan Terkirim', 'Catatan']
  
  const rows = guests.map((guest, index) => [
    index + 1,
    guest.name,
    guest.phone || '-',
    guest.address || '-',
    guest.category,
    guest.invitation_sent ? 'Ya' : 'Belum',
    guest.notes || '-',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ============================================
// IMPORT GUEST LIST FROM CSV
// ============================================

export const parseGuestListCSV = (csvText: string): Omit<GuestListInsert, 'wedding_id'>[] => {
  const lines = csvText.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
    
    return {
      name: values[1] || '',
      phone: values[2] !== '-' ? values[2] : null,
      address: values[3] !== '-' ? values[3] : null,
      category: values[4] || 'lainnya',
      invitation_sent: values[5] === 'Ya',
      notes: values[6] !== '-' ? values[6] : null,
    }
  }).filter(guest => guest.name) // Filter out empty rows
}
