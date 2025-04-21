import { useState, useRef, ChangeEvent } from 'react'

export const useFileUpload = () => {
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

  return { fileName, fileInputRef, handleButtonClick, handleFileChange }
}
