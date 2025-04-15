import { Button } from '@shared/components/button'
import { Select } from '@shared/components/select'
import { Input } from '@shared/components/text-field'
import { Typography } from '@shared/components/typography'
import clsx from 'clsx'
import { useRef, ChangeEvent, useState } from 'react'

import s from './addMaterials.module.scss'

export const AddMaterials = () => {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('Selected file:', file)
      setFileName(file.name)
    }
  }

  return (
    <div className={s.box}>
      <div className={s.action}>
        <Select placeholder="Выберите урок" className={s.select} border={s.selectStyle} />
        <Input className={s.inputTitle} placeholder="Название материала" />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".pdf,.docx,.pptx,.mp4,.mp3,.jpg,.png,.zip"
      />
      <Button variant="primary" className={s.btn} onClick={handleButtonClick}>
        Загрузить файл
      </Button>
      {fileName && <Typography variant="body_2">{fileName}</Typography>}
      <div className={s.content}>
        <p className={s.txt}>При загрузке материалов соблюдайте следующие ограничения:</p>
        <br></br>
        <p className={s.txt}>1. Разрешённые форматы: PDF, DOCX, PPTX, MP4, MP3, JPG, PNG</p>
        <br></br>
        <p className={s.txt}>2. Максимальный размер файла: 100 МБ</p>
        <br></br>
        <span className={clsx(s.txt, s.span)}>
          Если у вас возникли вопросы, обратитесь к администратору платформы
        </span>
      </div>
    </div>
  )
}
