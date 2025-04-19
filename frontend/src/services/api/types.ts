import { NewItem } from '@services/slices/constructor/constructor.types'

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

//user
export type EventsResponse = {
  count: number
  next: null
  previous: null
  results: Event[]
}
export type LessonsResponse = [
  {
    id: number
    name: string
    serial: number
    start_date: string
    started: boolean
    course: number
    steps: Step[]
    test_block: number
  },
]
export type Event = {
  id: number
  course: Course
  done_lessons: number
  end_date: string
  favorite: boolean
  start_date: string
  status: string
  user: number
}

export type Attachments = {
  id: number
  file: string
  file_type: string
}

export type Answer = {
  id: number
  question: number
  text: string
}

export type TestQuestion = {
  id: number
  image: string | null
  text: string
  answers: Answer[]
}

export type TestBlock = {
  id: number
  lesson: number
  user_story: string[] //??? data type
  questions: TestQuestion[]
}

export type Step = {
  attachments: Attachments[]
  content_text: string
  id: number
  lesson: number
  serial: number
  teacher: number
  title: string
} & {
  blockItems: NewItem[]
}

export type LessonType = {
  course: number
  id: number
  name: string
  resource: string | null //????
  serial: number
  start_date: string
  started: boolean
  steps: Step[]
  teacher: number
  test_block: number
  version: string | null //???
} & {
  expanded: boolean
}

export type CourseVeiw = {
  beginner: boolean
  create_date: string
  description: string
  experiences: number[] // to fix, it is an array of objects
  id: number
  image: string | null
  interval: string
  is_scorm: boolean
  lessons: LessonType[]
  materials: object //???
  name: string
  profession: { id: number; en_name: string; ru_name: string }
  status: string
  teacher: number
  update_date: string
}

/* export type LessonType = {
  course: number
  id: number
  name: string
  serial: number
  steps: Step[]
  test_block: TestBlock
} & {
  expanded: boolean
} */
/* export type Lesson = {
  id: number
  course: number
  serial: number
  name: string
  steps: Step[]
  test_block: number
} */

/* export type Step = {
  id: number
  title: string
  content_text: string
  lesson: number
  serial: number
  attachments: number[]
} */

// Admin
export type CoursesResponse = {
  count: number
  next: null
  previous: null
  results: Course[]
}
// export type CourseResponse = {
//   results: CourseVeiw
// }

/* export type CourseVeiw = {
  beginer: boolean
  create_date: string
  description: string
  experiences: number[]
  id: number
  image: string
  lessons: LessonType[]
  name: string
  profession: number
  update_date: string
  scorms: Scorm[]
  lesson_story: number[]
} */

export type Course = {
  id: number
  name: string
  create_date: string
  update_date: string
  description: string
  lessons: LessonType[]
  beginer: boolean
  image: string
  profession: number
  scorms: number[]
  experiences: number[]
}

export type Scorm = {
  id: number
  name: string
  course: number
  version: string
  resource: string
}

// - SCORM 1.0
// - SCORM 1.1
// - SCORM 1.2
// - 2004 1st Edition
// - 2004 2nd Edition
// - 2004 3rd Edition
// - 2004 4th Edition

// export type Lesson = {
//   course: number
//   id: number
//   name: string
//   steps: Step[]
//   test_block: number
// }

// export type Step = {
//   attachments: number[]
//   content_text: string
//   lesson: number
//   serial: number
//   title: string
// }

//Covers

export type CoversResponse = {
  count: number
  next: null
  previous: null
  results: Course[]
}

export type Covers = {
  id: number
  //...
}

// export type Lesson = {
//   course: number
//   id: number
//   name: string
//   steps: Step[]
//   test_block: number
// }

// export type Step = {
//   id: number
//   title: string
//   content_text: string
//   lesson: number
//   serial: number
//   attachments: number[]
// }

// //admin
// export type CoursesResponse = {
//   count: number
//   next: null
//   previous: null
//   results: Course[]
// }
// // export type CourseResponse = {
// //   results: CourseVeiw
// // }

// export type CourseVeiw = {
//   beginer: boolean
//   create_date: string
//   description: string
//   experiences: number[]
//   id: number
//   image: string
//   lessons: Lesson[]
//   name: string
//   profession: number
//   update_date: string
//   scorms: Scorm[]
//   lesson_story: number[]
// }

// export type Course = {
//   id: number
//   name: string
//   create_date: string
//   update_date: string
//   description: string
//   lessons: Lesson[]
//   beginer: boolean
//   image: string
//   profession: number
//   scorms: number[]
//   experiences: number[]
// }

// export type Scorm = {
//   id: number
//   name: string
//   version: string
//   // - SCORM 1.0
//   // - SCORM 1.1
//   // - SCORM 1.2
//   // - 2004 1st Edition
//   // - 2004 2nd Edition
//   // - 2004 3rd Edition
//   // - 2004 4th Edition
//   index: string
// }

// //Covers

// export type CoversResponse = {
//   count: number
//   next: null
//   previous: null
//   results: Course[]
// }
// //export type  Event: {
// //    course: CourseVeiw
// //    start_date: string
// //    end_date: string
// //    status: string
// //  }
// //export type Course: {
// // id: number
// // user: number
// // name: string
// // description: string
// // interval: string
// //lessons: lesson[]
// // beginer: boolean
// // image: string
// // profession: number
// // scorms: number[],
// // experiences: number[]
// // status: ['archive']

// //  }

// //export type Lesson: {
// //   id: number
// //   name: string
// //   serial: number
// //   start_date: string
// //   started: boolean
// //   course: number
// //   steps: step[]
// //   test_block: number
// // }

// //export type Step: {
// //  id: number
// //  title: string
// //  content_text: string
// //  lesson: number
// //  serial: number
// //  attachments: number[]
// //         }

// export type Cover = {
//   id: number
//   event: {
//     course: CourseVeiw
//     start_date: string
//     end_date: string
//     status: string
//   }
//   user: number
//   procent: number
//   favorite: boolean
//   status: ''
// }
