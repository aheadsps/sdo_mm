import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'rsuite/dist/rsuite.min.css'
import './index.css'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

import { router } from './routes/router'
import { store } from './services'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
