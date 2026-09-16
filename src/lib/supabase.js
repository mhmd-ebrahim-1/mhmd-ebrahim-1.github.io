import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20 &&
    !supabaseUrl.includes('your-supabase-project')
  )
}

// Initialize Supabase Client with graceful fallback
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

/**
 * Upload a file to a Supabase storage bucket
 * @param {string} bucket - 'media' | 'projects' | 'certificates' | 'cv'
 * @param {string} path - destination path in bucket
 * @param {File|Blob} file - file to upload
 * @returns {Promise<{ url: string | null, error: any }>}
 */
export async function uploadStorageFile(bucket, path, file) {
  if (!supabase) {
    return { url: null, error: new Error('Supabase is not configured') }
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
      })

    if (error) throw error

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: publicUrlData.publicUrl, error: null }
  } catch (err) {
    return { url: null, error: err }
  }
}

/**
 * Delete a file from a Supabase storage bucket
 */
export async function deleteStorageFile(bucket, path) {
  if (!supabase) return { error: new Error('Supabase is not configured') }
  const { error } = await supabase.storage.from(bucket).remove([path])
  return { error }
}
