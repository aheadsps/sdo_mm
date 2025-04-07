import { Button, CMenu, Title } from '@shared/components'
import { withLayout } from '@shared/HOC'

import SettingsIcon from '@assets/icons/SettingsIcon'

import s from './constructorPage.module.scss'

const Constructor: React.FC = () => {
  // nullBtn, fstBtn, scndBtn,
  return (
    <div className={s.container}>
      <Title
        txt="Конструктор курса"
        btn0={<SettingsIcon />}
        btn1="Предпросмотр"
        btn2="Опубликовать"
        className={s.visible}
      />
      <aside>
        <CMenu />
      </aside>
      <main className={s.main}>
        <Button variant="primary" />
      </main>
    </div>
  )
}

export const ConstructorPage = withLayout(Constructor)
