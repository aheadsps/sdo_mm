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
  className?: string
} & ComponentPropsWithoutRef<'button'>

export const Tabs = ({ tabs, variant = 'primary', className, ...props }: Props) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <div className={clsx(s.tabList, className)}>
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
    </>
  )
}
