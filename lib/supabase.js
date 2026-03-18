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
    .select('stat_date, district, is_presale, avg_unit_price, total_transactions, yoy_change_pct')
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

export async function searchTransactions({ city, keyword, isPresale, limit = 50, offset = 0 }) {
  let query = supabase
    .from('transactions')
    .select('id, district, tx_date_iso, is_presale, building_type, floor_area_m2, unit_price_ping, total_price_wan, address, project_name, floor, total_floors', { count: 'exact' })
    .order('tx_date_iso', { ascending: false })
    .range(offset, offset + limit - 1)

  if (city) query = query.eq('district', city)
  if (keyword) {
    query = query.or(`project_name.ilike.%${keyword}%,address.ilike.%${keyword}%`)
  }
  if (isPresale != null) query = query.eq('is_presale', isPresale)

  const { data, count, error } = await query
  if (error) throw error
  return { data, count }
}

// Helper: format stat_date as human-readable
export function formatStatDate(dateStr) {
  if (!dateStr || dateStr === '—') return '—'
  const parts = dateStr.split('-')
  if (parts.length < 2) return dateStr
  const year = parts[0]
  const month = parseInt(parts[1])
  return `${year} 年 ${month} 月`
}
