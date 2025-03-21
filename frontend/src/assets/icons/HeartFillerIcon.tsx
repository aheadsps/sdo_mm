import { forwardRef, Ref, SVGProps } from 'react'

const HeartFilledIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <g clip-path="url(#clip0_5708_3373)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.99978 1.31405C12.4378 -3.24795 23.5338 4.73505 7.99978 15.0001C-7.53422 4.73605 3.56178 -3.24795 7.99978 1.31405Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_5708_3373">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
)

export default HeartFilledIcon
