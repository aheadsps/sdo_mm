import { AddItemIcon, ArrowDownIcon, ArrowUpIcon } from '@assets/icons'
import { Lesson } from '@services/api'
import { selectCourse } from '@services/slices'
import {
  selectCurrentLessons,
  setCurrentLessons,
} from '@services/slices/constructor/constructorSlice'
import { useAppDispatch, useAppSelector } from '@services/store'
import { Button } from '@shared/components'
import { useState, FC } from 'react'

import { BlockHeader } from './block-header/BlockHeader'
import { optionsFormat } from './data'
import { ExpandedContent } from './expanded-content/ExpandedContent'
import { LessonContent } from './lesson-content/LessonContent'
import styles from './program.module.scss'

const columns = ['Уроки', 'Дата и время занятия', 'Формат']

export const Program: FC = () => {
  const [newLessonCount, setNewLessonCount] = useState<number[]>([])
  const [newTopicCount, setNewTopicCount] = useState<Record<number, number[]>>({})

  const currentCourse = useAppSelector(selectCourse)
  const lessons = useAppSelector(selectCurrentLessons)

  const dispatch = useAppDispatch()

  const toggleExpand = (id: number) => {
    if (!currentCourse.is_scorm) {
      dispatch(setCurrentLessons({ lessons, id }))
    }
  }

  const onAddNewLesson = () => {
    setNewLessonCount((prev) => [...prev, prev.length + 1])
  }

  const onAddNewTopic = (lessonId: number) => {
    setNewTopicCount((prev) => {
      const currentTopics = prev[lessonId] || []
      return { ...prev, [lessonId]: [...currentTopics, currentTopics.length + 1] }
    })
  }

  return (
    <div className={styles.container}>
      <BlockHeader columns={columns} />
      <div className={styles.list}>
        {lessons.map((lesson) => (
          <div key={lesson.id} className={styles.lessonItem}>
            <LessonContent options={optionsFormat} lesson={lesson} />
            <Button
              disabled={currentCourse.is_scorm}
              variant="primary"
              className={styles.toggleButton}
              onClick={() => toggleExpand(lesson.id)}
            >
              {lesson.expanded ? 'Скрыть блоки' : 'Открыть блоки'}
              {lesson.expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </Button>
            {lesson && lesson.expanded && (
              <div className={styles.expandedContent}>
                <ExpandedContent lessonId={lesson.id} steps={lesson.steps} />
                {(newTopicCount[lesson.id] || []).map((topic) => (
                  <div key={topic} className={styles.lessonItem}>
                    <LessonContent isExpandableContent options={optionsFormat} />
                  </div>
                ))}
                <button className={styles.addButton}>
                  <AddItemIcon
                    height={'12px'}
                    width={'12px'}
                    onClick={() => onAddNewTopic(lesson.id)}
                  />
                </button>
              </div>
            )}
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
