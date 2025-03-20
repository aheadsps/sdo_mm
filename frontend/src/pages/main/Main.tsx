import { MainComp, MainResponsive } from '@features/main'
import { withLayout } from '@shared/HOC'
import { useScreenWidth } from '@shared/hooks'

const MainContent = () => {
  const { isDesktop } = useScreenWidth()
  return isDesktop ? <MainComp /> : <MainResponsive />
}

export const MainPage = withLayout(MainContent)
