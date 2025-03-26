import { Main } from '@/features'
import { withLayout } from '@/shared/HOC'

const MainContent = () => {
  return <Main />
}

export const MainPage = withLayout(MainContent)
