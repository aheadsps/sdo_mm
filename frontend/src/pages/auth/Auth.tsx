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

import { Typography } from '../../shared/components/Typography'
import { cn } from '../../shared/utils/cn.ts'

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
      <Typography variant={'header_1'}>Typography</Typography>
      <Typography variant={'header_2'}>Typography</Typography>
      <Typography variant={'header_3'}>Typography</Typography>
      <Typography variant={'header_4'}>Typography</Typography>
      <Typography variant={'header_5'}>Typography</Typography>
      <Typography variant={'header_6'}>Typography</Typography>
      <Typography variant={'body_1'} className={'moscow-sans'}>
        Typography
      </Typography>
      <Typography variant={'body_2'} className={cn('moscow-sans', 'text-blue-200')}>
        Typography
      </Typography>
      <Typography variant={'btn_links'} className={'moscow-sans'}>
        Typography
      </Typography>
      <Typography variant={'caption'} className={'moscow-sans'}>
        Typography
      </Typography>
    </>
  )
}
