import s from './loader.module.scss'

const Loader = () => {
  return (
    <div className={s.box}>
      <span className={s.loader}></span>
    </div>
  )
}

export default Loader
