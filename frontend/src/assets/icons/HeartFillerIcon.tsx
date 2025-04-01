import { forwardRef, Ref, SVGProps } from 'react'

const HeartFilledIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <rect x="0.25" y="0.25" width="33.5" height="33.5" rx="16.75" fill="#DC3444" />
      <rect
        x="0.25"
        y="0.25"
        width="33.5"
        height="33.5"
        rx="16.75"
        stroke="#F8F9FA"
        strokeWidth="0.5"
      />
      <g clipPath="url(#clip0_1070_41528)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.9998 11.3141C21.4378 6.75205 32.5338 14.7351 16.9998 25.0001C1.46578 14.7361 12.5618 6.75205 16.9998 11.3141Z"
          fill="#F8F9FA"
        />
      </g>
      <defs>
        <clipPath id="clip0_1070_41528">
          <rect width="16" height="16" fill="white" transform="translate(9 10)" />
        </clipPath>
      </defs>
    </svg>
  )
)

export default HeartFilledIcon
