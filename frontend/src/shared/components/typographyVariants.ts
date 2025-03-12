import { cva } from 'class-variance-authority'

export const typographyVariants = cva([], {
  defaultVariants: {
    variant: 'body_1',
  },
  variants: {
    variant: {
      header_1: ['font-bold', 'leading-[1.2]', 'text-[48px]'],
      header_2: ['font-bold', 'leading-[1.25]', 'text-[40px]'],
      header_3: ['font-bold', 'leading-[1.25]', 'text-[32px]'],
      header_4: ['font-bold', 'leading-[1.25]', 'text-[28px]'],
      header_5: ['font-semibold', 'leading-[1.3]', 'text-[24px]'],
      header_6: ['font-semibold', 'leading-[1.3]', 'text-[20px]'],
      body_1: ['font-light', 'leading-[1.35]', 'text-[18px]'],
      body_2: ['font-light', 'leading-[24px]', 'text-[16px]'],
      btn_links: ['font-light', 'leading-1', 'text-[14px]'],
      caption: ['font-light', 'leading-[1.3]', 'text-[14px]'],
    },
  },
})
