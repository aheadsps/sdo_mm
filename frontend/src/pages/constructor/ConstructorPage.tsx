import { withLayout } from '@shared/HOC'

import s from './constructorPage.module.scss'

const Constructor: React.FC = () => {
  return <div className={s.container}></div>
}

export const ConstructorPage = withLayout(Constructor)
