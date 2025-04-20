import s from './assignments-check.module.scss'
import { students } from './data'
import Status from './Status'

export const statusColors = (stat: Status) => {
  switch (stat) {
    case Status.UNSERT:
      return s.statusUnsert
    case Status.REVIEWING:
      return s.statusReviewing
    case Status.DONE:
      return s.statusDone
    default:
      return ''
  }
}

export const getStatusTitle = (status: Status) => {
  return `${status} [${statusGroups[status].length}]`
}

export const statusGroups = {
  [Status.UNSERT]: students.filter((student) => student.status === Status.UNSERT),
  [Status.REVIEWING]: students.filter((student) => student.status === Status.REVIEWING),
  [Status.DONE]: students.filter((student) => student.status === Status.DONE),
}
