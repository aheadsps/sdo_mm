import { Typography, Button, Header } from '@shared/components'
import { NavLink } from 'react-router-dom'

import {
  LibraryIcon,
  MainIcon,
  SettingsEyeIcon,
  StudyIcon,
  NewsIcon,
  OpenedEyeIcon,
  ClosedEyeIcon,
  WebinarAndSupportIcon,
} from '@assets/icons'

import s from './auth.module.scss'

export const Auth = () => {
  return (
    <>
      <h2>Lorem ipsum dolor sit amet.</h2>
      <h3>Lorem ipsum dolor sit amet.</h3>
      <LibraryIcon color="blue" width={40} height={40} />
      <MainIcon color="green" width={40} height={40} />
      <StudyIcon color="white" width={40} height={40} />
      <SettingsEyeIcon color="pink" width={40} height={40} />
      <NewsIcon color="yellow" width={40} height={40} />
      <WebinarAndSupportIcon color="black" width={40} height={40} />
      <OpenedEyeIcon color="black" width={40} height={40} />
      <ClosedEyeIcon color="black" width={40} height={40} />
      <Typography variant={'header_1'} className={s.red}>
        Typography
      </Typography>
      <Typography variant={'header_2'} className={s.green}>
        Typography
      </Typography>
      <Typography variant={'header_3'}>Typography</Typography>
      <Typography variant={'header_4'}>Typography</Typography>
      <Typography variant={'header_5'}>Typography</Typography>
      <Typography variant={'header_6'}>Typography</Typography>
      <Typography variant={'body_1'}>Typography</Typography>
      <Typography variant={'body_2'}>Typography</Typography>
      <Typography variant={'btn_links'}>Typography</Typography>
      <Typography variant={'caption'}>Typography</Typography>
      <Header title="Корпоративный университет Транспортного комплекса" />
      <div style={{ marginTop: '200px', marginLeft: '200px' }}>
        <Button as={NavLink} to={'/'}>
          Hello Link
        </Button>
      </div>
    </>
  )
}
