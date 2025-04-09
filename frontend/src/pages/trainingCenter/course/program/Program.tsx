import { AddItemIcon, ArrowDownIcon, ArrowUpIcon } from '@assets/icons'
import { Button } from '@shared/components'
import React, { useState } from 'react'

import { BlockHeader } from './block-header/BlockHeader'
import { lessonsData, options } from './data'
import { ExpandedContent } from './expanded-content/ExpandedContent'
import { LessonContent } from './lesson-content/LessonContent'
import styles from './program.module.scss'

const columns = ['Уроки', 'Дата и время занятия', 'Формат']

export const Program: React.FC = () => {
  const [lessons, setLessons] = useState(lessonsData)
  const [newLessonCount, setNewLessonCount] = useState<number[]>([])
  const [newTopicCount, setNewTopicCount] = useState<number[]>([])

  const toggleExpand = (id: number) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === id ? { ...lesson, expanded: !lesson.expanded } : lesson
      )
    )
  }

  const onAddNewLesson = () => {
    setNewLessonCount((prev) => [...prev, prev.length + 1])
  }

  const onAddNewTopic = () => {
    setNewTopicCount((prev) => [...prev, prev.length + 1])
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
                {newTopicCount.map((topic) => (
                  <div key={topic} className={styles.lessonItem}>
                    <LessonContent isExpandableContent optionsFormat={options} />
                  </div>
                ))}
                <button className={styles.addButton}>
                  <AddItemIcon height={'12px'} width={'12px'} onClick={onAddNewTopic} />
                </button>
              </div>
            )}
          </div>
        ))}
        {newLessonCount.map((item) => (
          <div key={item} className={styles.lessonItem}>
            <LessonContent optionsFormat={options} />
          </div>
        ))}
      </div>
      <button className={styles.addButton}>
        <AddItemIcon height={'12px'} width={'12px'} onClick={onAddNewLesson} />
      </button>
    </div>
  )
}
