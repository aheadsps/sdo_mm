import { AddItemIcon, ArrowDownIcon, ArrowUpIcon } from '@assets/icons'
import { LessonType } from '@services/api'
import { selectCourse } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Button } from '@shared/components'
import React, { useState } from 'react'

import { BlockHeader } from './block-header/BlockHeader'
import { optionsFormat } from './data'
import { ExpandedContent } from './expanded-content/ExpandedContent'
import { LessonContent } from './lesson-content/LessonContent'
import styles from './program.module.scss'

const columns = ['Уроки', 'Дата и время занятия', 'Формат']

export const Program: React.FC = () => {
  const [newLessonCount, setNewLessonCount] = useState<number[]>([])
  const [newTopicCount, setNewTopicCount] = useState<number[]>([])
  const currentCourse = useAppSelector(selectCourse)

  const courseLessons: LessonType[] = currentCourse.lessons.map((lesson) => ({
    ...lesson,
    expanded: false,
  }))
  const scorm = currentCourse.scorms
  console.log(scorm)

  const [lessons, setLessons] = useState(courseLessons)

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
        {lessons.length
          ? lessons.map((lesson) => (
              <div key={lesson.id} className={styles.lessonItem}>
                <LessonContent options={optionsFormat} lesson={lesson} />
                <Button
                  variant="primary"
                  className={styles.toggleButton}
                  onClick={() => toggleExpand(lesson.id)}
                >
                  {lesson.expanded ? 'Скрыть блоки' : 'Открыть блоки'}
                  {lesson.expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </Button>
                {lesson && lesson.expanded && (
                  <div className={styles.expandedContent}>
                    <ExpandedContent steps={lesson.steps} />
                    {newTopicCount.map((topic) => (
                      <div key={topic} className={styles.lessonItem}>
                        <LessonContent isExpandableContent options={optionsFormat} />
                      </div>
                    ))}
                    <button className={styles.addButton}>
                      <AddItemIcon height={'12px'} width={'12px'} onClick={onAddNewTopic} />
                    </button>
                  </div>
                )}
              </div>
            ))
          : scorm.map((item) => (
              <div key={item.id} className={styles.lessonItem}>
                <LessonContent options={optionsFormat} lesson={item} />
                <Button disabled={!!item} variant="primary" className={styles.toggleButton}>
                  'Открыть блоки'
                  <ArrowDownIcon />
                </Button>
              </div>
            ))}
        {newLessonCount.map((item) => (
          <div key={item} className={styles.lessonItem}>
            <LessonContent options={optionsFormat} />
          </div>
        ))}
      </div>
      <button className={styles.addButton}>
        <AddItemIcon height={'12px'} width={'12px'} onClick={onAddNewLesson} />
      </button>
    </div>
  )
}
