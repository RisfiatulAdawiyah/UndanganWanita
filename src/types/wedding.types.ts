// ============================================
// APPLICATION TYPES
// ============================================

import { Database } from './database.types'

// Extract types from database
export type Wedding = Database['public']['Tables']['weddings']['Row']
export type WeddingInsert = Database['public']['Tables']['weddings']['Insert']
export type WeddingUpdate = Database['public']['Tables']['weddings']['Update']

export type LoveStory = Database['public']['Tables']['love_stories']['Row']
export type LoveStoryInsert = Database['public']['Tables']['love_stories']['Insert']
export type LoveStoryUpdate = Database['public']['Tables']['love_stories']['Update']

export type GalleryPhoto = Database['public']['Tables']['gallery_photos']['Row']
export type GalleryPhotoInsert = Database['public']['Tables']['gallery_photos']['Insert']
export type GalleryPhotoUpdate = Database['public']['Tables']['gallery_photos']['Update']

export type RSVPResponse = Database['public']['Tables']['rsvp_responses']['Row']
export type RSVPResponseInsert = Database['public']['Tables']['rsvp_responses']['Insert']
export type RSVPResponseUpdate = Database['public']['Tables']['rsvp_responses']['Update']

export type GuestList = Database['public']['Tables']['guest_list']['Row']
export type GuestListInsert = Database['public']['Tables']['guest_list']['Insert']
export type GuestListUpdate = Database['public']['Tables']['guest_list']['Update']

export type GiftRegistry = Database['public']['Tables']['gift_registry']['Row']
export type GiftRegistryInsert = Database['public']['Tables']['gift_registry']['Insert']
export type GiftRegistryUpdate = Database['public']['Tables']['gift_registry']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// ============================================
// EXTENDED TYPES FOR FRONTEND
// ============================================

export interface WeddingWithRelations extends Wedding {
  love_stories?: LoveStory[]
  gallery_photos?: GalleryPhoto[]
  rsvp_responses?: RSVPResponse[]
  guest_list?: GuestList[]
  gift_registry?: GiftRegistry[]
}

// ============================================
// FORM TYPES
// ============================================

export interface RSVPFormData {
  guest_name: string
  attendance: 'yes' | 'no'
  number_of_guests: number
  message: string
  phone?: string
  email?: string
}

export interface GuestListFormData {
  name: string
  phone?: string
  address?: string
  category: string
  invitation_sent: boolean
  notes?: string
}

export interface GiftRegistryFormData {
  type: 'bank' | 'ewallet' | 'gift_item'
  account_name?: string
  account_number?: string
  bank_name?: string
  item_name?: string
  item_description?: string
  item_link?: string
}

export interface LoveStoryFormData {
  date: string
  title: string
  description: string
  icon: string
}

// ============================================
// ICON OPTIONS
// ============================================

export const LOVE_STORY_ICONS = [
  'heart',
  'sparkles',
  'star',
  'gift',
  'party-popper',
  'calendar',
  'message-circle',
  'camera',
  'ring'
] as const

export type LoveStoryIcon = typeof LOVE_STORY_ICONS[number]

// ============================================
// GUEST CATEGORIES
// ============================================

export const GUEST_CATEGORIES = [
  'keluarga',
  'teman',
  'kantor',
  'sekolah',
  'lainnya'
] as const

export type GuestCategory = typeof GUEST_CATEGORIES[number]

// ============================================
// BANK OPTIONS
// ============================================

export const BANK_OPTIONS = [
  'BCA',
  'Mandiri',
  'BNI',
  'BRI',
  'CIMB Niaga',
  'Permata',
  'Danamon',
  'BTN',
  'Maybank',
  'OCBC NISP',
  'Panin',
  'BSI (Bank Syariah Indonesia)',
  'Muamalat',
  'GoPay',
  'OVO',
  'Dana',
  'ShopeePay',
  'LinkAja',
  'Jenius',
  'Blu by BCA',
  'Jago',
  'SeaBank',
  'Lainnya'
] as const

export type BankOption = typeof BANK_OPTIONS[number]

// ============================================
// RSVP STATISTICS
// ============================================

export interface RSVPStats {
  total: number
  attending: number
  notAttending: number
  totalGuests: number
  attendanceRate: number
}

// ============================================
// DASHBOARD STATS
// ============================================

export interface DashboardStats {
  totalRSVP: number
  totalAttending: number
  totalGuests: number
  totalGuestList: number
  recentRSVPs: RSVPResponse[]
}
