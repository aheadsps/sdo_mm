import Category from './Category'
import s from './library.module.scss'
import { Article } from './types'

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

export const formatDateString = (date: string): Date => {
  return new Date(date.split('.').reverse().join('-'))
}

export const displayCurrentArticles = (mode: string, articles: Article[]) => {
  if (mode === 'Все') {
    return [...articles].sort(
      (a, b) => formatDateString(b.date).getTime() - formatDateString(a.date).getTime()
    )
  }
  if (mode === 'Обновления') {
    return articles.filter((article) => isNew(article.date))
  }
  return articles.filter((article) => article.category === mode)
}
