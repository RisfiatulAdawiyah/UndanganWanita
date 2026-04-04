// ============================================
// AUTHENTICATION HOOKS
// ============================================

import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, signIn, signUp, signOut } from '@/lib/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// ============================================
// AUTH STATE
// ============================================

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
  }
}

// ============================================
// SIGN IN
// ============================================

export const useSignIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await signIn(email, password)
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}

// ============================================
// SIGN UP
// ============================================

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      fullName 
    }: { 
      email: string
      password: string
      fullName: string
    }) => {
      const result = await signUp(email, password, fullName)
      
      // Create profile
      if (result.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: result.user.id,
            full_name: fullName,
          })

        if (profileError) throw profileError
      }

      return result
    },
  })
}

// ============================================
// SIGN OUT
// ============================================

export const useSignOut = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      return await signOut()
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

// ============================================
// GET USER PROFILE
// ============================================

export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

// ============================================
// UPDATE PROFILE
// ============================================

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      userId, 
      fullName, 
      phone 
    }: { 
      userId: string
      fullName?: string
      phone?: string
    }) => {
      const updates: any = {}
      if (fullName !== undefined) updates.full_name = fullName
      if (phone !== undefined) updates.phone = phone

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] })
    },
  })
}

// ============================================
// RESET PASSWORD
// ============================================

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
    },
  })
}

// ============================================
// UPDATE PASSWORD
// ============================================

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
    },
  })
}
