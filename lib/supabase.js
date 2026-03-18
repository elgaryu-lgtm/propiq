import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Market Stats helpers ─────────────────────────────────────────────────────

export async function getLatestCityStats() {
  const { data, error } = await supabase
    .from('market_stats')
    .select('district, is_presale, avg_unit_price, total_transactions, yoy_change_pct, stat_date')
    .eq('stat_date', await getLatestStatDate())
    .in('district', ['臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市'])
    .order('district')
  if (error) throw error
  return data
}

export async function getLatestStatDate() {
  const { data, error } = await supabase
    .from('market_stats')
    .select('stat_date')
    .order('stat_date', { ascending: false })
    .limit(1)
    .single()
  if (error) throw error
  return data.stat_date
}

export async function getPriceTrend(cities, months = 24) {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)
  const cutoffStr = cutoff.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('market_stats')
    .select('stat_date, district, is_presale, avg_unit_price, total_transactions')
    .in('district', cities)
    .gte('stat_date', cutoffStr)
    .order('stat_date', { ascending: true })
  if (error) throw error
  return data
}

export async function getAllCityStats(months = 24) {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)
  const cutoffStr = cutoff.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('market_stats')
    .select('stat_date, district, iq_presale, avg_unit_price, total_transactions, yoy_change_pct')
    .gte('stat_date', cutoffStr)
    .order('stat_date', { ascending: true })
  if (error) throw error
  return data
}

export async function getTotalTransactions() {
  const { count, error } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count
}
