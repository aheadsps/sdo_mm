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
  date_commencement: string
  profession: number
  profile: UserProfile
}

//todo: change the types
export type EventsResponse = {
  count: number
  next: null
  previous: null
  results: string[]
}
