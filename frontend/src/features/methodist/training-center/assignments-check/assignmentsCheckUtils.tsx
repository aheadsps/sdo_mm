import { DoneIcon, ReviewingIcon, UnsertIcon } from '@assets/icons'

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

export const statusIcon = (stat: Status) => {
  switch (stat) {
    case Status.UNSERT:
      return <UnsertIcon width="16px" height="16px" className={s.library__icon} />
    case Status.REVIEWING:
      return <ReviewingIcon width="16px" height="16px" className={s.library__icon} />
    case Status.DONE:
      return <DoneIcon width="16px" height="16px" className={s.library__icon} />
    default:
      return ''
  }
}
