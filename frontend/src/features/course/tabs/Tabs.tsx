import { Button, Typography } from '@shared/components'
import clsx from 'clsx'
import React, { useState } from 'react'

import s from './tabs.module.scss'

interface Tab {
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className={s.tabs}>
      <div className={s.tabList}>
        {tabs.map((tab, index) => (
          <Button
            variant="secondary"
            key={index}
            className={clsx(s.tab, { [s.active]: activeTab === index })}
            onClick={() => setActiveTab(index)}
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
