import { AuthForm } from '@features/auth'
import { Header, ImageComponent } from '@shared/components'

import styles from './authpage.module.scss'

export const AuthPage: React.FC = () => {
  return (
    <div className={styles.authPage__container}>
      <Header />
      <div className={styles.authPage__content}>
        <AuthForm />
      </div>
      <div className={styles.authPage__img}>
        <div className={styles.authPage__img__content}>
          <ImageComponent src="/img/img_tmp/bg_train.png" />
        </div>
      </div>
    </div>
  )
}
