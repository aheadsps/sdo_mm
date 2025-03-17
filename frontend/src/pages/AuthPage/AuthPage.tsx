import AuthForm from '@features/AuthForm/AuthForm'
import Header from '@shared/components/Header/Header'
import ImageComponent from '@shared/components/img/ImageComponent'

const AuthPage: React.FC = () => {
  return (
    <>
      <Header />
      <AuthForm />
      <ImageComponent src="/img/img_tmp/bg_train.png" className="custom-image"/>
    </>
  )
}

export default AuthPage
