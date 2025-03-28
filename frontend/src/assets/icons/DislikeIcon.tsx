import { forwardRef, SVGProps, Ref } from 'react'

const DislikeIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5.25" y="5.25" width="33.5" height="33.5" rx="16.75" fill="#DC3444" />
      <rect
        x="5.25"
        y="5.25"
        width="33.5"
        height="33.5"
        rx="16.75"
        stroke="#F8F9FA"
        stroke-width="0.5"
        ref={ref}
        {...props}
      />
      <g clipPath="url(#clip0_5334_16480)">
        <path
          d="M21.9999 17.748L21.2829 17.011C19.5999 15.281 16.5139 15.878 15.3999 18.053C14.8769 19.076 14.7589 20.553 15.7139 22.438C16.6339 24.253 18.5479 26.427 21.9999 28.795C25.4519 26.427 27.3649 24.253 28.2859 22.438C29.2409 20.552 29.1239 19.076 28.5999 18.053C27.4859 15.878 24.3999 15.28 22.7169 17.01L21.9999 17.748ZM21.9999 30C6.66689 19.868 17.2789 11.96 21.8239 16.143C21.8839 16.198 21.9429 16.255 21.9999 16.314C22.0563 16.2551 22.115 16.1984 22.1759 16.144C26.7199 11.958 37.3329 19.867 21.9999 30Z"
          fill="#F8F9FA"
        />
      </g>
      <defs>
        <clipPath id="clip0_5334_16480">
          <rect width="16" height="16" fill="white" transform="translate(14 15)" />
        </clipPath>
      </defs>
    </svg>
  )
)

export default DislikeIcon
