import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Button } from '../button'

import s from './tabsButtons.module.scss'

type Props = {
  tabs: string[]
  activeTab: number
  setActiveTab: (activeTab: number) => void
  children?: ReactNode
} & ComponentPropsWithoutRef<'button'>

export const TabsButtons = ({ tabs, activeTab, setActiveTab, ...props }: Props) => {
  const counter = [0, 0, 3, 0]
  return (
    <div className={s.tabBox}>
      {tabs.map((tab, index) => {
        return (
          <div className={s.tabList} key={index}>
            <div className={counter[index] === 0 ? s.counterBox_hidden : s.counterBox}>
              <p className={s.counter}>{counter[index]}</p>
            </div>
            <Button
              key={index}
              className={s.tab}
              children={tab}
              variant={activeTab === index ? 'primary' : 'secondary'}
              onClick={() => setActiveTab(index)}
              {...props}
            />
          </div>
        )
      })}
    </div>
  )
}
