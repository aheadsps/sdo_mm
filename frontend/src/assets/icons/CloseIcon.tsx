import { forwardRef, SVGProps, Ref } from 'react'

const CloseIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
    >
      <path
        d="M6.66699 7.16669L17.3337 17.8334M6.66699 17.8334L17.3337 7.16669"
        stroke="#58151C"
        stroke-width="2.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
)

export default CloseIcon
