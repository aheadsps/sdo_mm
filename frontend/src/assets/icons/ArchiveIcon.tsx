import { forwardRef, Ref, SVGProps } from 'react'

const ArchiveIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <mask
        id="mask0_6004_52572"
        // style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="12"
        y="12"
        width="16"
        height="16"
      >
        <rect x="12" y="12" width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_6004_52572)">
        <path
          d="M17.3328 22.6666H25.3328V14.6666H23.9994V19.3333L22.3328 18.3333L20.6661 19.3333V14.6666H17.3328V22.6666ZM17.3328 23.9999C16.9661 23.9999 16.6522 23.8694 16.3911 23.6083C16.13 23.3471 15.9994 23.0333 15.9994 22.6666V14.6666C15.9994 14.2999 16.13 13.986 16.3911 13.7249C16.6522 13.4638 16.9661 13.3333 17.3328 13.3333H25.3328C25.6994 13.3333 26.0133 13.4638 26.2744 13.7249C26.5355 13.986 26.6661 14.2999 26.6661 14.6666V22.6666C26.6661 23.0333 26.5355 23.3471 26.2744 23.6083C26.0133 23.8694 25.6994 23.9999 25.3328 23.9999H17.3328ZM14.6661 26.6666C14.2994 26.6666 13.9855 26.536 13.7244 26.2749C13.4633 26.0138 13.3328 25.6999 13.3328 25.3333V15.9999H14.6661V25.3333H23.9994V26.6666H14.6661Z"
          fill="#58151C"
        />
      </g>
    </svg>
  )
)

export default ArchiveIcon
