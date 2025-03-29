import { forwardRef, Ref, SVGProps } from 'react'

const ArrowRightIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      width="8"
      height="15"
      viewBox="0 0 8 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <path
        d="M1.3335 12.8333L6.66683 7.49996L1.3335 2.16663"
        stroke="currentColor"
        stroke-width="2.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
)

export default ArrowRightIcon
