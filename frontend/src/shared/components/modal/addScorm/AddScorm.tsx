import { useCreateCourseMutation } from '@services/api/courses.api.ts'
import { Button, Input } from '@shared/components'
import { ChangeEvent, useRef, useState } from 'react'

import s from './addScorm.module.scss'

export const AddScorm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [courseName, setCourseName] = useState<string>('')
  const [createCourse, { isLoading }] = useCreateCourseMutation()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setFile(selectedFile || null)
  }
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newCourseName = e.target.value
    setCourseName(newCourseName)
  }
  const handleSubmit = async () => {
    if (!file) {
      alert('Выберите файл')
      return
    }
    if (!courseName) {
      alert('Укажите название курса')
      return
    }

    const formData = new FormData()

    formData.append('name', courseName)
    formData.append('experiences', '2')

    try {
      await createCourse(formData).unwrap()
      alert('Курс успешно загружен!')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.log(error)
      alert('Проверьте заполнение всех полей')
    }
  }

  return (
    <div className={s.box}>
      <Input className={s.inputTitle} placeholder="Название курса" onChange={handleNameChange} />
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
