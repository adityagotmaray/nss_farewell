import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nktdvuxppvjdtpjytrlh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdGR2dXhwcHZqZHRwanl0cmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDcyODYsImV4cCI6MjA5NDc4MzI4Nn0.Rdgm8178CEYYYRktHgJkSIR7Ud3s7BtetpAGgx_BENI' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)