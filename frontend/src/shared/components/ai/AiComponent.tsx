import { Offcanvas } from '../offcanvas/Offcanvas'
import { Textarea } from '../text-field/Textarea'

import s from './ai.module.scss'
import { AiDescription } from './AiDescription'

import { SendIcon } from '@/assets/icons'

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const AiComponent = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Offcanvas isOpen={isOpen} setIsOpen={setIsOpen} title="Ваш персональный помощник">
      <AiDescription />
      <div className={s.aiTextarea}>
        <Textarea placeholder="Введите текст" className={s.textarea} />
        <SendIcon width={'13px'} height={'13px'} className={s.textareaIcon} />
      </div>
    </Offcanvas>
  )
}
