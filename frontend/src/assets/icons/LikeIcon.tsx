import { forwardRef, SVGProps, Ref } from 'react'

const LikeIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
    >
      <rect x="5.25" y="5.25" width="33.5" height="33.5" rx="16.75" fill="#DC3444" />
      <rect
        x="5.25"
        y="5.25"
        width="33.5"
        height="33.5"
        rx="16.75"
        stroke="#F8F9FA"
        strokeWidth="0.5"
      />
      <g clipPath="url(#clip0_5322_15994)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M21.9998 16.3141C26.4378 11.7521 37.5338 19.7351 21.9998 30.0001C6.46578 19.7361 17.5618 11.7521 21.9998 16.3141Z"
          fill="#F8F9FA"
        />
      </g>
      <defs>
        <clipPath id="clip0_5322_15994">
          <rect width="16" height="16" fill="white" transform="translate(14 15)" />
        </clipPath>
      </defs>
    </svg>
  )
)

export default LikeIcon
