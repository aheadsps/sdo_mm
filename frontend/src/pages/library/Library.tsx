import { AiIcon, ArrowUpDownIcon, ArticleIcon, FilterIcon } from '@assets/icons'
import { Search, TabsButtons, Typography } from '@shared/components'
import { withLayout } from '@shared/HOC'
import clsx from 'clsx'
import { useState } from 'react'

import s from './library.module.scss'
import { isNew, categoryColors, formatDateString } from './libraryUtils'
import { articles } from './mockData'

const buttons: string[] = [
  'Все',
  'Обновления',
  'Популярные вопросы',
  'Навигация по платформе',
  'Обучение',
  'Поддержка',
]

const LibraryComp: React.FC = () => {
  const [mode, setMode] = useState<string>('Все')

  const displayCurrentArticles = () => {
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

  return (
    <>
      <div className={s.library}>
        <Typography variant="header_4" className={s.library__title}>
          База знаний
        </Typography>
        <div className={s.library__tabs}>
          <TabsButtons tabs={buttons} activeTab={mode} setActiveTab={setMode} />
        </div>
        <div className={s.library__toolbar}>
          <Search />
          <div className={s.library__icons}>
            <AiIcon width="24px" height="24px" className={s.library__icon} />
            <FilterIcon width="15px" height="16px" className={s.library__icon} />
            <ArrowUpDownIcon width="16px" height="16px" className={s.library__icon} />
          </div>
        </div>
        <div className={s.library__articles}>
          {displayCurrentArticles()?.length > 0 ? (
            displayCurrentArticles().map((article) => (
              <div key={article.id}>
                <div className={s.library__article}>
                  <div className={s.library__articleLeft}>
                    <ArticleIcon width="11px" height="14px" className={s.library__icon} />
                    {isNew(article.date) && (
                      <Typography variant="body_2" className={s.library__badge}>
                        Новое
                      </Typography>
                    )}
                    <Typography variant="body_1">{article.title}</Typography>
                  </div>
                  <div className={s.library__articleRight}>
                    <Typography className={s.library__date} variant="body_2">
                      {article.date}
                    </Typography>
                    {mode !== article.category && (
                      <Typography
                        variant="body_2"
                        className={clsx(s.library__category, categoryColors(article.category))}
                      >
                        {article.category}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Typography variant="body_1">Пока нет доступных статей.</Typography>
          )}
        </div>
      </div>
    </>
  )
}

export const Library = withLayout(LibraryComp)
