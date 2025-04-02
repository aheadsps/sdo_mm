import { Button } from '@shared/components'
import React, { useState } from 'react'

import { AddItemIcon, ArrowDownIcon, ArrowUpIcon } from '@assets/icons'

import { BlockHeader } from './block-header/BlockHeader'
import { ExpandedContent } from './exanded-content/ExpandedContent'
import { LessonContent } from './lesson-content/LessonContent'
import styles from './program.module.scss'

export type Lesson = {
  id: number
  title: string
  dateTime: string
  format: string
  expanded: boolean
}

const options = [
  {
    id: 1,
    value: 'Cat',
  },
  {
    id: 2,
    value: 'Dog',
  },
  {
    id: 3,
    value: 'Apple',
  },
]

const lessonsData: Lesson[] = [
  {
    id: 1,
    title: 'Введение в безопасность: основные риски при работе с электроинструментом',
    dateTime: '07.06.2025, 12:47',
    format: 'Онлайн',
    expanded: false,
  },
  {
    id: 2,
    title: 'Средства индивидуальной защиты: как минимизировать травмы',
    dateTime: '10.06.2025, 03:05',
    format: 'Онлайн',
    expanded: false,
  },
]

const columns = ['Уроки', 'Дата и время занятия', 'Формат']

export const Program: React.FC = () => {
  const [lessons, setLessons] = useState(lessonsData)
  const [newItemCount, setNewItemCount] = useState<number[]>([])

  const toggleExpand = (id: number) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === id ? { ...lesson, expanded: !lesson.expanded } : lesson
      )
    )
  }

  const onAddNewItem = () => {
    setNewItemCount((prev) => [...prev, prev.length + 1])
  }

  return (
    <div className={styles.container}>
      <BlockHeader columns={columns} />
      <div className={styles.list}>
        {lessons.map((lesson) => (
          <div key={lesson.id} className={styles.lessonItem}>
            <LessonContent optionsDate={options} optionsFormat={options} lesson={lesson} />
            <Button
              variant="primary"
              className={styles.toggleButton}
              onClick={() => toggleExpand(lesson.id)}
            >
              {lesson.expanded ? 'Скрыть блоки' : 'Открыть блоки'}
              {lesson.expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </Button>
            {lesson.expanded && (
              <div className={styles.expandedContent}>
                <ExpandedContent />
              </div>
            )}
          </div>
        ))}
        {newItemCount.map((item) => (
          <div key={item} className={styles.lessonItem}>
            <LessonContent />
          </div>
        ))}
      </div>
      <button className={styles.addButton}>
        <AddItemIcon height={'12px'} width={'12px'} onClick={onAddNewItem} />
      </button>
    </div>
  )
}
