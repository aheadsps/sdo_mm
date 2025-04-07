import { forwardRef, Ref, SVGProps } from 'react'

const ArrowUpIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <path
        d="M9 5L5 1L1 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
)

export default ArrowUpIcon
