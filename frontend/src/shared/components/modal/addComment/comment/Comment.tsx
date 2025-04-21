import { Typography } from '@shared/components/typography'

import s from './comment.module.scss'

export type Message = {
  id: number
  name: string
  date: string
  time: string
  txt: string
}
type Props = {
  data: Message
}

export const Comment = ({ data }: Props) => {
  return (
    <div className={s.commentBox}>
      <div className={s.headerBlock}>
        <p className={s.name}>{data.name}</p>
        <div className={s.dateBox}>
          <p className={s.date}>{data.date}</p>
          <p className={s.time}>{data.time}</p>
          <p></p>
        </div>
      </div>
      <Typography variant="body_2" children={data.txt} className={s.txt} />
    </div>
  )
}
