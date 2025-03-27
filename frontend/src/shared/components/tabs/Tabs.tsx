import { Button, Typography } from '@shared/components'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, useState } from 'react'

import s from './tabs.module.scss'

export type Tab = {
  label: string
  content: React.ReactNode
}

type Props = {
  tabs: Tab[]
  variant: 'primary' | 'secondary'
} & ComponentPropsWithoutRef<'button'>

export const Tabs = ({ tabs, variant = 'primary', ...props }: Props) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className={s.tabs}>
      <div className={s.tabList}>
        {tabs.map((tab, index) => (
          <Button
            variant={variant}
            key={index}
            className={clsx(s.tab, activeTab === index && s.active)}
            onClick={() => setActiveTab(index)}
            {...props}
          >
            <Typography variant="header_6" className={s.tabText}>
              {tab.label}
            </Typography>
          </Button>
        ))}
      </div>
      <div className={s.tabContent}>{tabs[activeTab].content}</div>
    </div>
  )
}
