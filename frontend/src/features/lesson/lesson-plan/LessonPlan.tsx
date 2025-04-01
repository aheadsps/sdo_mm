import { DropdownCard } from '@features/course'
import { Button } from '@shared/components'

import { LessonPlanItem } from './lesson-plan-item/LessonPlanItem'
import s from './lesson-plan.module.scss'

export const LessonPlan = () => {
  return (
    <DropdownCard title="План урока:" blocks="6 тем" className={s.drpdnContent}>
      <ul>
        <LessonPlanItem>1. Введение: Почему мы путаем слова?</LessonPlanItem>
        <LessonPlanItem>2. Ложные друзья: похожие, но разные</LessonPlanItem>
        <LessonPlanItem>3. Слова с несколькими значениями</LessonPlanItem>
        <LessonPlanItem>4. Слова, которые мы используем неправильно</LessonPlanItem>
        <LessonPlanItem>5. Как запоминать новые слова правильно?</LessonPlanItem>
        <LessonPlanItem>6. Заключение: Закрепляем знания</LessonPlanItem>
        <LessonPlanItem>7. Тестирование</LessonPlanItem>
      </ul>
      <Button variant="secondary" className={s.btn}>
        Материалы урока
      </Button>
    </DropdownCard>
  )
}
