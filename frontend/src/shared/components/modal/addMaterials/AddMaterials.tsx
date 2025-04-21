import { useCreateCourseMutation } from '@services/api/courses.api.ts'
import { Button } from '@shared/components'
import { ChangeEvent, useRef, useState } from 'react'

import s from './addMaterials.module.scss'

export const AddMaterials = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [createCourse, { isLoading }] = useCreateCourseMutation()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setFile(selectedFile || null)
  }

  const handleSubmit = async () => {
    if (!file) {
      alert('Выберите файл')
      return
    }

    const formData = new FormData()

    formData.append('name', 'Default Course Name')
    formData.append('experiences', '2')

    try {
      await createCourse(formData).unwrap()
      alert('Курс успешно загружен!')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      alert('Проверьте заполнение всех полей')
    }
  }

  return (
    <div className={s.box}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".zip" hidden />

      {file && <div>Выбран файл: {file.name} </div>}
      <div className={s.flex}>
        <Button
          variant="primary"
          className={s.btn}
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          Выбрать ZIP
        </Button>

        <Button
          variant="primary"
          className={s.btn}
          onClick={handleSubmit}
          disabled={!file || isLoading}
        >
          {isLoading ? 'Загрузка...' : 'Создать курс'}
        </Button>
      </div>
    </div>
  )
}
