import { CMenu, Title } from '@shared/components'
import { withLayout } from '@shared/HOC'

import SettingsIcon from '@assets/icons/SettingsIcon'

import s from './constructorPage.module.scss'

const Constructor: React.FC = () => {
  return (
    <div className={s.wrapper}>
      <Title
        txt="Конструктор курса"
        btn0={<SettingsIcon />}
        btn1="Предпросмотр"
        btn2="Опубликовать"
        className={s.visible}
      />
      <div className={s.container}>
        <aside>
          <CMenu />
        </aside>
        <main className={s.main}></main>
      </div>
    </div>
  )
}

export const ConstructorPage = withLayout(Constructor)
