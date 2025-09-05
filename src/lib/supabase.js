import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Database helper functions
export const db = {
  // User operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('userId', userId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Legal guides operations
  async getLegalGuides(state, language = 'en') {
    const { data, error } = await supabase
      .from('legal_guides')
      .select('*')
      .eq('state', state)
      .eq('language', language)
    
    if (error) throw error
    return data
  },

  async getLegalGuide(guideId) {
    const { data, error } = await supabase
      .from('legal_guides')
      .select('*')
      .eq('guideId', guideId)
      .single()
    
    if (error) throw error
    return data
  },

  // Recording operations
  async saveRecording(recordingData) {
    const { data, error } = await supabase
      .from('interaction_recordings')
      .insert([recordingData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserRecordings(userId) {
    const { data, error } = await supabase
      .from('interaction_recordings')
      .select('*')
      .eq('userId', userId)
      .order('timestamp', { ascending: false })
    
    if (error) throw error
    return data
  },

  async deleteRecording(recordingId) {
    const { error } = await supabase
      .from('interaction_recordings')
      .delete()
      .eq('recordingId', recordingId)
    
    if (error) throw error
    return true
  },

  // Storage operations
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return data
  },

  async getFileUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}
