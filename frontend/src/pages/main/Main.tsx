import { MainComp, MainResponsive } from '@features/main'
import { withLayout } from '@shared/HOC'
import { useScreenWidth } from '@shared/hooks'

const MainPage = () => {
  const { isDesktop } = useScreenWidth()
  return isDesktop ? <MainComp /> : <MainResponsive />
}

export const Main = withLayout(MainPage)
