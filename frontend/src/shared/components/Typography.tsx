import { VariantProps } from 'class-variance-authority'
import { ComponentPropsWithoutRef, ElementType } from 'react'

import { cn } from '../utils/cn.ts'

import { typographyVariants } from './typographyVariants.ts'

export type Variant = NonNullable<VariantProps<typeof typographyVariants>['variant']>

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

type Props = ComponentPropsWithoutRef<ElementType> &
  VariantProps<typeof typographyVariants> & {
    className?: string
  }

export const Typography = ({ className, variant = 'body_1', ...props }: Props) => {
  const Component = variant ? typographyTags[variant] : 'p'

  return <Component className={cn(typographyVariants({ variant }), className)} {...props} />
}
