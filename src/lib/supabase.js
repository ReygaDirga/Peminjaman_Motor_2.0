import { createClient } from '@supabase/supabase-js'

// 🔑 Ganti ini pake URL & anon key project lu sendiri
const supabaseUrl = 'https://blhwiajolezsemeiolvj.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsaHdpYWpvbGV6c2VtZWlvbHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NDA2MzUsImV4cCI6MjA3NTQxNjYzNX0.m5TzCqRxPg1Fqan1_tIbgE8VCGX8hMWzU5_Apd5PBNQ' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
