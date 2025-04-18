export type Attachment = {
  id: number
  file: string
  file_type: string
}
export type Step = {
  title: string
  teacher: number
  content_text: string
  serial: number
  lesson: number
  attachments: Attachment[]
}
export type StepShort = {
  id: number
  title: string
  teacher: number
  content_text: string
  serial: number
  lesson: number
  attachments: number[]
}
export type Story = {
  id: number
  user: number
  lesson: number
  date_opened: string
  answer: number
}
export type Answer = {
  id: number
  text: string
  correct: boolean
  weight: number
  question: number
}

export type Question = [
  {
    id: number
    teacher: number
    text: string
    image: string
    test_block: number
    type_question: string
    check_automaty: boolean
    answers: Answer[]
  },
]
export type TestBlock = {
  id: number
  end_date: string
  lesson: number
  max_score: number
  questions: Question[]
  user_story: Story[]
}
export type Lesson = {
  id: number
  teacher: number
  name: string
  serial: number
  course: number
  start_date: string
  started: boolean
  steps: Step[]
  test_block: TestBlock
}
export type LessonShort = {
  id: number
  teacher: number
  name: string
  serial: number
  course: number
  start_date: string
  started: boolean
  steps: StepShort[]
  test_block: number
}
export type Profession = {
  id: number
  en_name: string
  ru_name: string
}
export type Experience = {
  id: number
  years: number
}
export type Scorm = {
  id: number
  teacher: number
  name: string
  course: number
  version: string
  resource: string
}
export type Files = {
  id: number
  file: string
  file_type: string
}
export type Materials = {
  id: number
  files: Files[]
}
export type Course = {
  id: number
  teacher: number
  name: string
  description: string
  interval: string
  lessons: Lesson[]
  beginer: boolean
  create_date: string
  update_date: string
  image: string
  profession: Profession
  scorms: Scorm[]
  experiences: Experience[]
  materials: Materials
  status: string
  is_scorm: boolean
}
export type CourseShort = {
  id: number
  teacher: number
  name: string
  description: string
  interval: string
  lessons: LessonShort[]
  beginner: boolean
  image: string
  profession: number
  //   scorms: number[] | boolean
  experiences: number[]
  materials: Materials
  status: string
} & {
  is_scorm: boolean
}
export type LessonCovered = {
  course: number
  id: number
  name: string
  resourse: string
  serial: number
  start_date: string
  started: false
  steps: StepShort[]
  teacher: number
  test_block: number
  version: string
}
export type CourseCovered = {
  beginner: boolean
  create_date: string
  description: string
  experiences: number[]
  id: number
  image: string
  interval: null
  is_scorm: boolean
  lessons: LessonCovered[]
  materials: Materials
  name: string
  profession: Profession
  status: string
  teacher: number
  update_date: string
}
export type EventShort = {
  id: number
  course: CourseShort
  start_date: string
  end_date: string
  status: string
}
export type EventCovered = {
  id: number
  course: CourseCovered
  start_date: string
  end_date: string
  status: string
}

export type CoverShort = {
  id: number
  event: Event
  user: number
  procent: number
  favorite: boolean
  status: string
}
export type CoverCurrent = {
  id: number
  event: EventCovered
  user: number
  procent: number
  favorite: boolean
  status: string
}

//Auth
export type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  password: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  last_login: string
  profession: Profession
  date_commencement: string
}
//ProfileResponse?
export type Profile = {
  id: number
  user: User
  phone: string
  image: string
  date_birthday: string
}

//auth
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

export type CoversResponse = {
  count: number
  next: null
  previous: null
  results: Event[] //Short
}

export type CurrentCoversResponse = {
  count: number
  next: null
  previous: null
  results: CoverCurrent[]
}
export type CoursesResponse = {
  count: number
  next: null
  previous: null
  results: CourseShort[]
}
export type EventsResponse = {
  count: number
  next: null
  previous: null
  results: EventShort[]
}
