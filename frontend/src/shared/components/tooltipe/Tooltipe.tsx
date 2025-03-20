import { TooltipeCheckboxIcon } from '@assets/icons'

import s from './tooltipe.module.scss'

export const Tooltipe = () => {
  return (
    <div className={s.container}>
      <div className={s.titleBox}>
        <TooltipeCheckboxIcon />
      </div>
    </div>
  )
}
