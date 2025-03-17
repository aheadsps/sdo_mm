import { useState, useEffect } from 'react'

export const useScreenWidth = () => {
  const [width, setWidth] = useState(window.innerWidth)

  const isTablet = width <= 1024
  const isMobile = width < 768
  const isDesktop = width >= 1350

  useEffect(() => {
    const onWindowResize = () => setWidth(window.innerWidth)

    window.addEventListener('resize', onWindowResize)

    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
  }, [])

  return { isMobile, isTablet, isDesktop }
}
