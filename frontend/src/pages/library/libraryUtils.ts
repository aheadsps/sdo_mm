import Category from './Category'
import s from './library.module.scss'

export const categoryColors = (cat: Category) => {
  switch (cat) {
    case Category.STUDY:
      return s.categoryStudy
    case Category.SUPPORT:
      return s.categorySupport
    case Category.NAVIGATION:
      return s.categoryNavigation
    case Category.QUESTIONS:
      return s.categoryQuestions
    default:
      return ''
  }
}

export const isNew = (date: string) => {
  const [day, month, year] = date.split('.').map(Number)
  const dt = new Date(year, month - 1, day)
  return (new Date().getTime() - dt.getTime()) / (1000 * 60 * 60 * 24) <= 7
}
