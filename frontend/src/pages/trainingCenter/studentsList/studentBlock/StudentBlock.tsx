import { Button, ProgressBar } from '@shared/components'

import { BasketIcon, WebinarAndSupportIcon } from '@assets/icons'

import s from './studentBlock.module.scss'

export const StudentBlock = () => {
  return (
    <div className={s.box}>
      <div className={s.name}>Кузнецов Евгений Андреевич</div>
      <div className={s.progress}>
        <p className={s.progress__txt}>20 из 100%</p>
        <ProgressBar
          progress={40}
          total={100}
          progressBarClassName={s.bar}
          progressIndicatorClassName={s.indicator}
        />
      </div>
      <div className={s.btns}>
        <Button variant="secondary" className={s.btn}>
          <BasketIcon width={'40px'} height={'40px'} />
        </Button>
        <Button variant="primary" className={s.btn}>
          <WebinarAndSupportIcon width={'24px'} height={'24px'} />
        </Button>
      </div>
    </div>
  )
}
