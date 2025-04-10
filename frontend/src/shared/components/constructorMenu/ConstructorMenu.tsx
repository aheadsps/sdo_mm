import { Typography } from '../typography'
import { AddCard } from './addCard/AddCard'
import s from './constructorMenu.module.scss'
import { addTest } from './data'
import { ConstructorContent } from '@shared/components/constructorContent/ConstructorContent'
import { ConstructorCard } from '@shared/components/constructorCard/ConstructorCard'
import { CardActionsBar } from '@shared/components/cardActionsBar/CardActionsBar'

interface Props {
  setCurrentBlock: (node: React.ReactNode) => void
}

export const CMenu: React.FC<Props> = ({ setCurrentBlock }) => {
  return (
    <div className={s.container}>
      <div className={s.block}>
        <Typography variant="caption" className={s.title}>
          Теоретический материал
        </Typography>

        <AddCard onClick={() => setCurrentBlock(<ConstructorContent type="text" />)}>
          Добавить текст
        </AddCard>
        <AddCard onClick={() => setCurrentBlock(
          <ConstructorCard>
            <CardActionsBar description="Описание (не обязательно)" />
            <ConstructorContent type="video" />
          </ConstructorCard>
        )}>
          Добавить видео
        </AddCard>
        <AddCard onClick={() => setCurrentBlock(
          <ConstructorCard>
            <CardActionsBar description="Описание (не обязательно)" />
            <ConstructorContent type="image" />
          </ConstructorCard>)}>
          Добавить изображение
        </AddCard>
      </div>

      <div className={s.block}>
        <Typography variant="caption" className={s.title}>
          Интерактивные задания (добавить тест)
        </Typography>

        {addTest.map((test) => (
          <AddCard key={test.id} onClick={() => setCurrentBlock(<ConstructorContent type="text" title={test.title} />)}>
            {test.title}
          </AddCard>
        ))}
      </div>

      <div className={s.block}>
        <Typography variant="caption" className={s.title}>
          Структура курса
        </Typography>

        <AddCard onClick={() => setCurrentBlock(<ConstructorContent type="text" title="Новый модуль" />)}>
          Добавить модуль
        </AddCard>
      </div>
    </div>
  )
}
