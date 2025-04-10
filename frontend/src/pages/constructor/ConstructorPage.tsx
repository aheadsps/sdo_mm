import SettingsIcon from '@assets/icons/SettingsIcon'
import { CMenu, Title } from '@shared/components'
import { Card } from '@shared/components/card'
import { Typography } from '@shared/components/typography'
import { useState } from 'react'

// import { Tooltipe } from '@shared/components/tooltipe'
import { withLayout } from '@shared/HOC'
// import { useToggle } from '@shared/hooks'

import s from './constructorPage.module.scss'


const Constructor: React.FC = () => {
  const [currentBlock, setCurrentBlock] = useState<React.ReactNode | null>(null)
  // const { isOpen: isTooltipeOpen, close: closeTooltipe } = useToggle(true)
  return (
    <div className={s.wrapper}>
      {/* {isTooltipeOpen && (
        <Tooltipe
          txt="Вы можете добавлять блоки в любом порядке, создавая курс под свои нужды"
          close={closeTooltipe}
          className="s.span"
        />
      )} */}
      <Title
        txt="Конструктор курса"
        btn0={<SettingsIcon />}
        btn1="Предпросмотр"
        btn2="Опубликовать"
        className={s.visible}
      />
      <div className={s.container}>
        <aside>
          <CMenu setCurrentBlock={setCurrentBlock} />
        </aside>
        <main className={s.main}>
          {!currentBlock && (
            <>
              <Card>
                <Typography variant="header_2">Добавьте блоки в курс</Typography>
                <Typography variant="caption">Выберите нужный элемент из меню слева и начните создание</Typography>
              </Card>
            </>
          )}

          {currentBlock}

        </main>
      </div>
    </div>
  )
}

export const ConstructorPage = withLayout(Constructor)
