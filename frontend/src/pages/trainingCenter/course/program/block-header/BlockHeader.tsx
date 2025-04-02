import s from './block-header.module.scss'

type Props = {
  columns: string[]
}
export const BlockHeader = ({ columns }: Props) => {
  return (
    <div className={s.header}>
      {columns.map((column, index) => (
        <div key={index} className={s.headerItem}>
          {column}
        </div>
      ))}
    </div>
  )
}
