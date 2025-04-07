import { Button } from '@shared/components/button'
import { Select } from '@shared/components/select'
import { Input } from '@shared/components/text-field'

import s from './addMaterials.module.scss'

export const AddMaterials = () => {
  return (
    <div className={s.box}>
      <div className={s.action}>
        <Select placeholder="Выберите урок" className={s.select} border={s.selectStyle} />
        <Input className={s.inputTitle} placeholder="Название материала" />
      </div>
      <Button variant="primary" children="Загрузить файл" className={s.btn} />
      <div className={s.content}></div>
    </div>
  )
}
