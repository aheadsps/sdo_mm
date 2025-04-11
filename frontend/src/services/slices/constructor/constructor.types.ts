export type AddedMaterial = 'text' | 'video' | 'image' | 'test' | 'module'

export type NewItem = {
  id?: number
  type: AddedMaterial
}

export type LessonBlock = {
  id: number
  title: string
  blockItems: NewItem[]
}
