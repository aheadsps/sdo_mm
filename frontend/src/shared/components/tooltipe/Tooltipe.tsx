import s from './tooltipe.module.scss'

import { CloseIcon, TooltipeCheckboxIcon } from '@/assets/icons'

type Props = {
  close: () => void
}
export const Tooltipe = ({ close }: Props) => {
  return (
    <div className={s.tooltipe}>
      <div className={s.tooltipe__topBox}>
        <TooltipeCheckboxIcon />
        <div className={s.tooltipe__rightBox} onClick={close}>
          <p className={s.tooltipe__txt}>12 секунд назад</p>
          <CloseIcon />
        </div>
      </div>
      <div className={s.tooltipe__bottomBox}>
        Курс добавлен в избранное! Теперь ты легко найдёшь его в своём профиле.
      </div>
    </div>
  )
}
