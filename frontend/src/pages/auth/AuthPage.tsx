import { AuthForm } from '@features/auth'
import { Header, ImageComponent } from '@shared/components'

import styles from './authpage.module.scss'

export const AuthPage: React.FC = () => {
  return (
    <div className={styles.authPage__container}>
      <Header />
      <AuthForm />
      <ImageComponent className={styles.authPage__image} src="/img/img_tmp/bg_train.png" />
    </div>
  )
}
