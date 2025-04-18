import { AddItemIcon, ArrowDownIcon, ArrowUpIcon } from '@assets/icons'
import { LessonType } from '@services/api'
import { selectCourse } from '@services/slices'
import { setCurrentLesson } from '@services/slices/constructor/constructorSlice'
import { useAppDispatch, useAppSelector } from '@services/store'
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
  const [newTopicCount, setNewTopicCount] = useState<Record<number, number[]>>({})
  const currentCourse = useAppSelector(selectCourse)
  const dispatch = useAppDispatch()

  const courseLessons: LessonType[] = currentCourse.lessons.map((lesson) => ({
    ...lesson,
    expanded: false,
  }))
  const scorm = currentCourse.scorms

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

  const onAddNewTopic = (lessonId: number) => {
    setNewTopicCount((prev) => {
      const currentTopics = prev[lessonId] || []
      return { ...prev, [lessonId]: [...currentTopics, currentTopics.length + 1] }
    })
  }
  const onConstructorButtonClick = (lessonId: number) => {
    const currentLesson = lessons.find((lesson) => lesson.id === lessonId)
    if (currentLesson) {
      dispatch(setCurrentLesson(currentLesson))
    }
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
                    <ExpandedContent
                      lessonId={lesson.id}
                      steps={lesson.steps}
                      onClick={() => onConstructorButtonClick(lesson.id)}
                    />
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
