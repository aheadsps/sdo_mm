import { Main } from '@features/main'
import { withLayout } from '@shared/HOC'

const MainContent = () => {
  return <Main />
}

export const MainPage = withLayout(MainContent)
