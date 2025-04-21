import { Input, Typography } from '@shared/components'
import { ChangeEvent, useState, KeyboardEvent, MouseEvent } from 'react'

import s from './lesson-content.module.scss'

type Props = {
  displayName: string
}
export const EditableTitle = ({ displayName }: Props) => {
  const [name, setName] = useState(displayName)
  const [isEditing, setIsEditing] = useState(!displayName ? true : false)

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
    }
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }

  const handleEditClick = (e: MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    setIsEditing(true)
  }

  return (
    <div className={s.title}>
      {isEditing ? (
        <Input
          placeholder="Введите тему"
          value={name}
          onChange={handleNameChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <Typography variant="body_2" onClick={handleEditClick}>
          {name || 'Введите тему'}
        </Typography>
      )}
    </div>
  )
}
