import { Offcanvas } from '../offcanvas/Offcanvas'
import { Textarea } from '../text-field/Textarea'

import s from './ai.module.scss'
import { AiDescription } from './AiDescription'

import { SendIcon } from '@/assets/icons'

type Props = {
  isOpen: boolean
  close: () => void
}

export const AiComponent = ({ isOpen, close }: Props) => {
  return (
    <Offcanvas isOpen={isOpen} close={close} title="Ваш персональный помощник">
      <AiDescription />
      <div className={s.aiTextarea}>
        <Textarea placeholder="Введите текст" className={s.textarea} />
        <SendIcon width={'13px'} height={'13px'} className={s.textareaIcon} />
      </div>
    </Offcanvas>
  )
}
