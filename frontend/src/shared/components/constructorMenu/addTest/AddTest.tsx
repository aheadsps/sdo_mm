import { Input, InputRadio, Textarea, Typography } from '@shared/components'

import s from './add-test.module.scss'

export const AddTest = () => {
  return (
    <div className={s.container}>
      <div className={s.textfieldBlock}>
        <Input placeholder="Заголовок" className={s.input} />
        <Textarea placeholder="Описание (не обязательно)" className={s.textarea} />
      </div>
      <div className={s.testItemsBlock}>
        <div className={s.testItem}>
          <InputRadio />
          <Typography variant="body_2">Введите текст ответа</Typography>
        </div>
        <div className={s.testItem}>
          <InputRadio />
          <Typography variant="body_2">Введите текст ответа</Typography>
        </div>
      </div>
    </div>
  )
}
