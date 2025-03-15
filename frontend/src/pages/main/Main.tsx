import { MainComp } from '@features/main'
import { MainResponsive } from '@features/main/ui/main/MainResponsive'
import { withLayout } from '@shared/HOC'
import { useScreenWidth } from '@shared/hooks/useScreenWidth'

const MainPage = () => {
  const { isDesktop } = useScreenWidth()
  return isDesktop ? <MainComp /> : <MainResponsive />
}

export const Main = withLayout(MainPage)
