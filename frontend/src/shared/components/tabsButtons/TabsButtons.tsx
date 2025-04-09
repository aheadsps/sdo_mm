import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Button } from '../button'

import s from './tabsButtons.module.scss'

type Props = {
  tabs: string[]
  activeTab: string
  setActiveTab: (activeTab: string) => void
  children?: ReactNode
} & ComponentPropsWithoutRef<'button'>

export const TabsButtons = ({ tabs, activeTab, setActiveTab, ...props }: Props) => {
  return (
    <div className={s.tabBox}>
      {tabs.map((tab) => {
        return (
          <div className={s.tabList} key={tab}>
            <Button
              key={tab}
              className={s.tab}
              children={tab}
              variant={activeTab === tab ? 'primary' : 'secondary'}
              onClick={() => setActiveTab(tab)}
              {...props}
            />
          </div>
        )
      })}
    </div>
  )
}
