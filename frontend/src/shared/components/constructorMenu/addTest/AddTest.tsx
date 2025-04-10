import { AddItemIcon } from '@assets/icons'
import { Button, Input, Textarea, ToggleInput } from '@shared/components'
import { useState } from 'react'
import { useEffect } from 'react'

import s from './add-test.module.scss'
import { TestItem } from './TestItem'

export const AddTest = () => {
  const [testItems, setTestItems] = useState([{ text: '', comment: '', isCorrect: false }])
  const [isOneCorrect, setIsOneCorrect] = useState(false)

  const onAddNewItem = () => {
    setTestItems((prev) => [...prev, { text: '', comment: '', isCorrect: false }])
  }

  const handleChange = (index: number, field: 'text' | 'comment', value: string) => {
    setTestItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const handleRadioChange = (index: number) => {
    setTestItems((prev) =>
      prev.map((item, i) => ({
        ...item,
        isCorrect: i === index,
      }))
    )
  }

  const handleCheckboxChange = (index: number) => {
    setTestItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isCorrect: !item.isCorrect } : item))
    )
  }

  useEffect(() => {
    if (isOneCorrect) {
      setTestItems((prev) => prev.map((item) => ({ ...item, isCorrect: false })))
    }
  }, [isOneCorrect])

  console.log(testItems)

  return (
    <div className={s.container}>
      <div className={s.textfieldBlock}>
        <Input placeholder="Заголовок" className={s.input} />
        <Textarea placeholder="Описание (не обязательно)" className={s.textarea} />
      </div>
      <div className={s.testItemsBlock}>
        {testItems.map((item, index) => (
          <TestItem
            key={index}
            index={index}
            text={item.text}
            comment={item.comment}
            onChange={handleChange}
            onRadioChange={handleRadioChange}
            isCorrect={item.isCorrect}
            onCheckboxChange={handleCheckboxChange}
            isOneCorrect={isOneCorrect}
          />
        ))}
      </div>
      <div className={s.addVariant}>
        <Button variant="primary" onClick={onAddNewItem}>
          <AddItemIcon />
        </Button>
        <Input placeholder="Добавить вариант ответа" className={s.input} />
      </div>
      <div className={s.toggles}>
        <ToggleInput setEnabled={setIsOneCorrect} enabled={isOneCorrect}>
          Один правильный ответ
        </ToggleInput>
      </div>
    </div>
  )
}
