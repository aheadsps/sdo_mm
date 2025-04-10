import clsx from 'clsx'
import { ComponentPropsWithoutRef, ElementType } from 'react'

import s from './typography.module.scss'

export type Variant =
  | 'body_1'
  | 'header_1'
  | 'header_2'
  | 'header_3'
  | 'header_4'
  | 'header_5'
  | 'header_6'
  | 'body_2'
  | 'btn_links'
  | 'caption'

const typographyTags: Record<Variant, ElementType> = {
  header_1: 'h1',
  header_2: 'h2',
  header_3: 'h3',
  header_4: 'h4',
  header_5: 'h5',
  header_6: 'h6',
  body_1: 'p',
  body_2: 'p',
  btn_links: 'button',
  caption: 'span',
}

type Props = {
  variant: Variant
} & ComponentPropsWithoutRef<ElementType>

export const Typography = ({ className, variant = 'body_1', ...props }: Props) => {
  const Component = variant ? typographyTags[variant] : 'p'

  return <Component className={clsx(s[variant], className as string)} {...props} />
}
