import { useScreenWidth } from '@shared/hooks'

import { Textarea, Input } from '../text-field'
import { Typography, Variant } from '../typography'

type Props = {
  isEditMode: boolean
  title: string
  setTitle: (title: string) => void
  variant?: Variant
}
export const EditableText = ({ isEditMode, title, setTitle, variant = 'header_2' }: Props) => {
  const { isTablet } = useScreenWidth()
  return isEditMode ? (
    isTablet ? (
      <Textarea value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
    ) : (
      <Input value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
    )
  ) : (
    <Typography variant={variant}>{title}</Typography>
  )
}
