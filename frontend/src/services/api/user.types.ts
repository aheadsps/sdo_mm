export type LoginData = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
}

export type UserProfile = {
  phone: string
  image: string
  date_birthday: string
}

export type ProfileResponse = {
  id: number
  email: string
  first_name: string
  last_name: string
  date_commencement: string
  profession: number
  profile: UserProfile
}

//todo: change the types
export type EventsResponse = {
  count: number
  next: null
  previous: null
  results: Event[]
}

export type Event = {
  course: Course
  done_lessons: number
  end_date: string
  favorite: boolean
  id: number
  start_date: string
  status: string
  user: number
}

export type Course = {
  beginner: boolean
  create_date: string
  description: string
  experiences: number[]
  id: number
  image: string
  lessons: Lesson[]
  name: string
  profession: number
  update_date: string
}

export type Lesson = {
  course: number
  id: number
  name: string
  steps: Step[]
  test_block: number
}

export type Step = {
  attachments: number[]
  content_text: string
  lesson: number
  serial: number
  title: string
}
