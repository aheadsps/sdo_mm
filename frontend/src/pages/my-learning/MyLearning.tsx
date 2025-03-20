/* eslint-disable prettier/prettier */
import { Button } from '@shared/components'
import { Tooltipe } from '@shared/components/tooltipe/Tooltipe'
import { withLayout } from '@shared/HOC/withLayout/withLayout'
import { useState } from 'react'

import s from './myLearning.module.scss'

const MyLearningComp = () => {
  const [mode, setMode] = useState('Назначенные курсы')
  const [openTooltipe, isOpenTooltipe] = useState(true);

  const buttons = [
    'Назначенные курсы',
    'Просроченные курсы',
    'Избранные курсы',
    'Завершённые курсы',
  ]

  return (<>
    {openTooltipe && <Tooltipe />}
    <main className={s.container}>
      <div className={s.headBox}>
        <div className={s.btnBox}>
          {buttons.map((btn, index) => {
            return (
              <Button
              className={s.btn}
                key={index}
                children={btn}
                variant={mode === btn ? 'primary' : 'secondary'}
                onClick={() => setMode(btn)}
              />
            )
          })}
        </div>
        <Button
          children="ИИ"
          variant={mode === 'ИИ' ? 'primary' : 'secondary'}
          onClick={() => setMode('ИИ')}
        />
      </div>
    </main>
    </>
  )
}

export const MyLearning = withLayout(MyLearningComp)
