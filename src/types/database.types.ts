// ============================================
// DATABASE TYPES - Auto-generated from Supabase
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      weddings: {
        Row: {
          id: string
          user_id: string
          slug: string
          groom_name: string
          groom_full_name: string | null
          groom_father: string | null
          groom_mother: string | null
          bride_name: string
          bride_full_name: string | null
          bride_father: string | null
          bride_mother: string | null
          wedding_date: string
          akad_date: string | null
          akad_end: string | null
          akad_venue: string | null
          akad_address: string | null
          akad_maps_url: string | null
          akad_maps_embed: string | null
          resepsi_date: string | null
          resepsi_end: string | null
          resepsi_venue: string | null
          resepsi_address: string | null
          resepsi_maps_url: string | null
          resepsi_maps_embed: string | null
          main_verse_arabic: string | null
          main_verse_transliteration: string | null
          main_verse_translation: string | null
          main_verse_reference: string | null
          quote_verse_arabic: string | null
          quote_verse_translation: string | null
          quote_verse_reference: string | null
          cover_image_url: string | null
          hero_image_url: string | null
          primary_color: string
          accent_color: string
          music_url: string | null
          is_published: boolean
          show_gift_registry: boolean
          show_guest_list: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          groom_name: string
          groom_full_name?: string | null
          groom_father?: string | null
          groom_mother?: string | null
          bride_name: string
          bride_full_name?: string | null
          bride_father?: string | null
          bride_mother?: string | null
          wedding_date: string
          akad_date?: string | null
          akad_end?: string | null
          akad_venue?: string | null
          akad_address?: string | null
          akad_maps_url?: string | null
          akad_maps_embed?: string | null
          resepsi_date?: string | null
          resepsi_end?: string | null
          resepsi_venue?: string | null
          resepsi_address?: string | null
          resepsi_maps_url?: string | null
          resepsi_maps_embed?: string | null
          main_verse_arabic?: string | null
          main_verse_transliteration?: string | null
          main_verse_translation?: string | null
          main_verse_reference?: string | null
          quote_verse_arabic?: string | null
          quote_verse_translation?: string | null
          quote_verse_reference?: string | null
          cover_image_url?: string | null
          hero_image_url?: string | null
          primary_color?: string
          accent_color?: string
          music_url?: string | null
          is_published?: boolean
          show_gift_registry?: boolean
          show_guest_list?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          groom_name?: string
          groom_full_name?: string | null
          groom_father?: string | null
          groom_mother?: string | null
          bride_name?: string
          bride_full_name?: string | null
          bride_father?: string | null
          bride_mother?: string | null
          wedding_date?: string
          akad_date?: string | null
          akad_end?: string | null
          akad_venue?: string | null
          akad_address?: string | null
          akad_maps_url?: string | null
          akad_maps_embed?: string | null
          resepsi_date?: string | null
          resepsi_end?: string | null
          resepsi_venue?: string | null
          resepsi_address?: string | null
          resepsi_maps_url?: string | null
          resepsi_maps_embed?: string | null
          main_verse_arabic?: string | null
          main_verse_transliteration?: string | null
          main_verse_translation?: string | null
          main_verse_reference?: string | null
          quote_verse_arabic?: string | null
          quote_verse_translation?: string | null
          quote_verse_reference?: string | null
          cover_image_url?: string | null
          hero_image_url?: string | null
          primary_color?: string
          accent_color?: string
          music_url?: string | null
          is_published?: boolean
          show_gift_registry?: boolean
          show_guest_list?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      love_stories: {
        Row: {
          id: string
          wedding_id: string
          date: string
          title: string
          description: string
          icon: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          date: string
          title: string
          description: string
          icon?: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          date?: string
          title?: string
          description?: string
          icon?: string
          order_index?: number
          created_at?: string
        }
      }
      gallery_photos: {
        Row: {
          id: string
          wedding_id: string
          image_url: string
          alt_text: string | null
          order_index: number
          span_class: string
          created_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          image_url: string
          alt_text?: string | null
          order_index?: number
          span_class?: string
          created_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          image_url?: string
          alt_text?: string | null
          order_index?: number
          span_class?: string
          created_at?: string
        }
      }
      rsvp_responses: {
        Row: {
          id: string
          wedding_id: string
          guest_name: string
          attendance: 'yes' | 'no'
          number_of_guests: number
          message: string | null
          phone: string | null
          email: string | null
          ip_address: string | null
          submitted_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          guest_name: string
          attendance: 'yes' | 'no'
          number_of_guests?: number
          message?: string | null
          phone?: string | null
          email?: string | null
          ip_address?: string | null
          submitted_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          guest_name?: string
          attendance?: 'yes' | 'no'
          number_of_guests?: number
          message?: string | null
          phone?: string | null
          email?: string | null
          ip_address?: string | null
          submitted_at?: string
        }
      }
      guest_list: {
        Row: {
          id: string
          wedding_id: string
          name: string
          phone: string | null
          address: string | null
          category: string
          invitation_sent: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          name: string
          phone?: string | null
          address?: string | null
          category?: string
          invitation_sent?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          name?: string
          phone?: string | null
          address?: string | null
          category?: string
          invitation_sent?: boolean
          notes?: string | null
          created_at?: string
        }
      }
      gift_registry: {
        Row: {
          id: string
          wedding_id: string
          type: 'bank' | 'ewallet' | 'gift_item'
          account_name: string | null
          account_number: string | null
          bank_name: string | null
          item_name: string | null
          item_description: string | null
          item_link: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          type: 'bank' | 'ewallet' | 'gift_item'
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          item_name?: string | null
          item_description?: string | null
          item_link?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          type?: 'bank' | 'ewallet' | 'gift_item'
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          item_name?: string | null
          item_description?: string | null
          item_link?: string | null
          order_index?: number
          created_at?: string
        }
      }
    }
  }
}
