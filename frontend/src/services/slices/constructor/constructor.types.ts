import { ReactNode } from 'react'

export type AddedMaterial = 'text' | 'video' | 'image' | 'test'

export type NewItem = {
  id: number
  type: AddedMaterial
  description?: string[]
  layout: ReactNode
}

export type LessonBlock = {
  id: number
  title: string
  blockItems: NewItem[]
}
