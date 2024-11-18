import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type ShoppingItem = {
  id: string
  title: string
  completed: boolean
  created_at: string
}

export function useShoppingItems() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addItem(title: string) {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .insert([{ title }])
        .select()
        .single()

      if (error) throw error
      setItems(prev => [data, ...prev])
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  async function toggleItem(id: string, completed: boolean) {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .update({ completed })
        .eq('id', id)

      if (error) throw error
      setItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, completed } : item
        )
      )
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  return { items, loading, addItem, toggleItem }
}