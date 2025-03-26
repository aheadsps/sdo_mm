import styles from './authpage.module.scss'

import { AuthForm } from '@/features'
import { ImageComponent, Header } from '@/shared/components'

export const AuthPage: React.FC = () => {
  return (
    <div className={styles.authPage__container}>
      <Header />
      <AuthForm />
      <ImageComponent className={styles.authPage__image} src="/img/img_tmp/bg_train.png" />
    </div>
  )
}
