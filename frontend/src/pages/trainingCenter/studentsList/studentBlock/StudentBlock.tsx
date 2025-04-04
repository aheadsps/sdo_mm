import { Button, ProgressBar } from '@shared/components'

import s from './studentBlock.module.scss'
import { BasketIcon } from '@assets/icons'

export const StudentBlock = () => {
  return (
    <div className={s.box}>
      <div className={s.name}>Кузнецов Евгений Андреевич</div>
      <div className={s.progress}>
        <ProgressBar progress={40} total={100} />
      </div>
      <div className={s.btns}>
        <Button variant="secondary" className={s.btn}>
          <BasketIcon width={'40px'} height={'40px'} />
        </Button>
        <Button variant="primary" className={s.btn_prim} />
      </div>
    </div>
  )
}
