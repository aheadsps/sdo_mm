import AuthForm from '@features/AuthForm/AuthForm'
import Header from '@shared/components/Header/Header'
import ImageComponent from '@shared/components/img/ImageComponent'

import styles from '../AuthPage/authpage.module.scss'

const AuthPage: React.FC = () => {
  return (
    <div className={styles.authPage__container}>
      <Header />
      <div className={styles.authPage__content}>
        <AuthForm />
      </div>
      <div className={styles.authPage__img}>
        <div className={styles.authPage__img__content}>
        <ImageComponent className={styles.authPage__image} src="/img/img_tmp/bg_train.png" />
        </div>
      </div>
    </div>
  )
}

export default AuthPage
