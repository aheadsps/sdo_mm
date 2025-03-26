import { Button } from '@shared/components'
import { ComponentPropsWithoutRef, useState } from 'react'

import s from './tabsButtons.module.scss'

// export type Tab = {
//   label: string
//   //   content: React.ReactNode
// }

type Props = {
  tabs: string[]
  //   variant: 'primary' | 'secondary'
  //   children: React.ReactNode
} & ComponentPropsWithoutRef<'button'>

export const TabsButtons = ({ tabs, ...props }: Props) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    //  <div className={s.box}>
    <div className={s.tabBox}>
      {tabs.map((tab, index) => {
        return (
          <div className={s.tabList} key={index}>
            {/* <div className={counter[index] === 0 ? s.counterBox_hidden : s.counterBox}>
                <p className={s.counter}>{counter[index]}</p>
              </div> */}
            <Button
              className={s.tab}
              children={tab}
              //  variant={variant}
              variant={activeTab === index ? 'primary' : 'secondary'}
              key={index}
              //  className={clsx(s.tab, activeTab === index && s.active)}
              onClick={() => setActiveTab(index)}
              {...props}
              //  onClick={() => setMode(tab)}
            />
          </div>
        )
      })}
    </div>
  )
}
