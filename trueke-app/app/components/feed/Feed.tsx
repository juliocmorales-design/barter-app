'use client'

import { useEffect, useState } from 'react'
import  supabase  from '@/app/lib/supabase'
import Header from './Header'
import FeaturedChains from './FeaturedChains'
import FeedGrid from './FeedGrid'

export default function Feed() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    setItems(data || [])
  }

  const filtered = items.filter(item => {
    const matchSearch =
      item.title?.toLowerCase().includes(search.toLowerCase())

    return matchSearch
  })

  return (
    <div>
      <Header onSearch={setSearch} onCategory={setCategory} />
      <FeaturedChains />
      <FeedGrid items={filtered} />
    </div>
  )
}