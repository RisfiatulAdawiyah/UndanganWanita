// ============================================
// RSVP HOOKS - React Query
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { RSVPResponse, RSVPResponseInsert, RSVPStats } from '@/types/wedding.types'

// ============================================
// QUERY KEYS
// ============================================

export const rsvpKeys = {
  all: ['rsvp'] as const,
  byWedding: (weddingId: string) => ['rsvp', 'wedding', weddingId] as const,
  stats: (weddingId: string) => ['rsvp', 'stats', weddingId] as const,
}

// ============================================
// GET RSVP RESPONSES (Admin)
// ============================================

export const useRSVPResponses = (weddingId: string) => {
  return useQuery({
    queryKey: rsvpKeys.byWedding(weddingId),
    queryFn: async (): Promise<RSVPResponse[]> => {
      const { data, error } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('submitted_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!weddingId,
  })
}

// ============================================
// GET RSVP STATISTICS
// ============================================

export const useRSVPStats = (weddingId: string) => {
  return useQuery({
    queryKey: rsvpKeys.stats(weddingId),
    queryFn: async (): Promise<RSVPStats> => {
      const { data, error } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('wedding_id', weddingId)

      if (error) throw error

      const responses = data || []
      const attending = responses.filter(r => r.attendance === 'yes')
      const totalGuests = attending.reduce((sum, r) => sum + r.number_of_guests, 0)

      return {
        total: responses.length,
        attending: attending.length,
        notAttending: responses.filter(r => r.attendance === 'no').length,
        totalGuests,
        attendanceRate: responses.length > 0 ? (attending.length / responses.length) * 100 : 0,
      }
    },
    enabled: !!weddingId,
  })
}

// ============================================
// SUBMIT RSVP (Public)
// ============================================

export const useSubmitRSVP = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (rsvp: RSVPResponseInsert): Promise<RSVPResponse> => {
      // Get IP address (optional)
      let ipAddress = null
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        ipAddress = ipData.ip
      } catch (e) {
        // Ignore IP fetch errors
      }

      const { data, error } = await supabase
        .from('rsvp_responses')
        .insert({
          ...rsvp,
          ip_address: ipAddress,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: rsvpKeys.byWedding(data.wedding_id) })
      queryClient.invalidateQueries({ queryKey: rsvpKeys.stats(data.wedding_id) })
    },
  })
}

// ============================================
// DELETE RSVP (Admin)
// ============================================

export const useDeleteRSVP = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, weddingId }: { id: string; weddingId: string }): Promise<void> => {
      const { error } = await supabase
        .from('rsvp_responses')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rsvpKeys.byWedding(variables.weddingId) })
      queryClient.invalidateQueries({ queryKey: rsvpKeys.stats(variables.weddingId) })
    },
  })
}

// ============================================
// EXPORT RSVP TO CSV
// ============================================

export const exportRSVPToCSV = (responses: RSVPResponse[], filename: string = 'rsvp-responses.csv') => {
  const headers = ['No', 'Nama', 'Kehadiran', 'Jumlah Tamu', 'Pesan', 'Telepon', 'Email', 'Waktu Submit']
  
  const rows = responses.map((response, index) => [
    index + 1,
    response.guest_name,
    response.attendance === 'yes' ? 'Hadir' : 'Tidak Hadir',
    response.number_of_guests,
    response.message || '-',
    response.phone || '-',
    response.email || '-',
    new Date(response.submitted_at).toLocaleString('id-ID'),
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
