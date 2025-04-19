//Responses типизация ответов с сервера

export type ProfileResponse = {
  id: number
  email: string
  first_name: string
  last_name: string
  date_commencement: string
  profession: number
  profile: Profile
  //UserProfile
}
export type CoversResponse = {
  count: number
  next: null
  previous: null
  results: CoverShort[]
}
export type CurrentCoversResponse = {
  count: number
  next: null
  previous: null
  results: CoverCurrent[]
}
export type EventsResponse = {
  count: number
  next: null
  previous: null
  results: EventShort[]
}
export type CoursesResponse = {
  count: number
  next: null
  previous: null
  results: CourseShort[]
}
export type LessonsResponse = {
  count: number
  next: null
  previous: null
  results: LessonShort[]
}
export type StepsResponse = {
  count: number
  next: null
  previous: null
  results: StepShort[]
}

// Типизация вложенности Covers/ CoversCurrent
export type EventCovered = {
  // В теле ответа НЕТ поля id!
  // id: number
  course: CourseCovered
  start_date: string
  end_date: string
  status: string
}
export type CoverShort = {
  event: EventCovered
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
export type CourseCovered = {
  id: number
  name: string
  description: string
  interval: string
  lessons: LessonCovered[]
  beginner: boolean
  image: string
  profession: Profession
  scorms: number[]
  experiences: number[]
  status: string
  is_scorm: boolean
  materials: Materials
  teacher: number
  create_date: string
  update_date: string
} & {
  user: number
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

// Типизация сокращённых сущностей (обычно вложены в responses, при получении листа)
export type EventShort = {
  id: number
  course: CourseShort
  start_date: string
  end_date: string
  status: string
}
export type CourseShort = {
  id: number
  name: string
  description: string
  interval: string
  lessons: LessonShort[]
  beginner: boolean
  image: string
  profession: number
  scorms: number[]
  experiences: number[]
  status: string
} & {
  materials: Materials
  teacher: number
  user: number
  is_scorm: boolean
  create_date: string
  update_date: string
}
export type LessonShort = {
  id: number
  name: string
  serial: number
  course: number
  start_date: string
  started: boolean
  steps: StepShort[]
  test_block: number
} & {
  teacher: number
}
export type StepShort = {
  id: number
  title: string
  content_text: string
  serial: number
  lesson: number
  attachments: number[]
} & {
  teacher: number
}

// Типизация развёрнутых сущностей (обычно получены через id)

export type Step = {
  title: string
  teacher: number
  content_text: string
  serial: number
  lesson: number
  attachments: Attachment[]
}
export type Lesson = {
  course: number
  id: number
  name: string
  resourse: string
  serial: number
  start_date: string
  started: boolean
  steps: Step[]
  teacher: number
  test_block: number
  version: string
} & {
  expanded: string
}
export type Scorm = {
  id: number
  teacher: number
  name: string
  course: number
  version: string
  resource: string
}
export type Course = {
  id: number
  teacher: number
  name: string
  description: string
  interval: string
  lessons: Lesson[]
  beginner: boolean
  create_date: string
  update_date: string
  image: string
  profession: Profession
  scorms: Scorm[]
  experiences: Experience[]
  status: string
  materials: Materials
  user: number
  is_scorm: boolean
}
export type Event = {
  // !! Получаем Event по id эвента, но в теле ответа id эвента нет!
  course: Course
  start_date: string
  end_date: string
  status: string
}

// Типизация вспомогательных сущностей (обычно вложены в развёрнутые)
export type Attachment = {
  id: number
  file: string
  file_type: string
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

export type Question = {
  id: number
  teacher: number
  text: string
  image: string
  test_block: number
  type_question: string
  check_automaty: boolean
  answers: Answer[]
}
export type TestBlock = {
  id: number
  end_date: string
  lesson: number
  max_score: number
  questions: Question[]
  user_story: Story[]
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
export type Files = {
  id: number
  file: string
  file_type: string
}
export type Materials = {
  id: number
  files: Files[]
}

//Типизация авторизации и профиля
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
export type LoginData = {
  email: string
  password: string
}
export type LoginResponse = {
  token: string
}
// export type UserProfile = {
//   phone: string
//   image: string
//   date_birthday: string
// }
