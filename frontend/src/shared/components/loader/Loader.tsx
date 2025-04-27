import s from './loader.module.scss'

export const Loader = () => {
  return (
    <div className={s.box}>
      <span className={s.loader}></span>
    </div>
  )
}
