import SettingsIcon from '@assets/icons/SettingsIcon'
import { CMenu, Title } from '@shared/components'
import { Header } from '@shared/components'
import { ReactNode, useState } from 'react'

import { BlockDropdown } from './block-dropdown/BlockDropdown'
import s from './constructorPage.module.scss'

type AddedMaterial = 'text' | 'video' | 'image' | 'test'

export type NewItem = {
  type: AddedMaterial
  description?: string[]
  layout: ReactNode
}

export const ConstructorPage: React.FC = () => {
  const [newItems, setNewItem] = useState<NewItem[]>([])

  return (
    <>
      <Header />
      <div className={s.constructorWrapper}>
        <div className={s.wrapper}>
          <Title
            txt="Конструктор курса"
            btn0={<SettingsIcon />}
            btn1="Предпросмотр"
            btn2="Опубликовать"
            className={s.visible}
          />
          <div className={s.container}>
            <CMenu setNewItem={setNewItem} />
            <main className={s.main}>
              <BlockDropdown newItems={newItems} isActiveBlock />
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
