import { forwardRef, Ref, SVGProps } from 'react'

const YouTubeLogo = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      width="65"
      height="45"
      viewBox="0 0 65 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <g clip-path="url(#clip0_5407_18298)">
        <path
          d="M63.0865 7.01875C62.7195 5.66214 62.0034 4.42536 61.0096 3.43157C60.0159 2.43778 58.7791 1.72165 57.4226 1.3545C52.4561 0 32.4675 0 32.4675 0C32.4675 0 12.478 0.0409999 7.51155 1.3955C6.15492 1.76267 4.91816 2.47884 3.92441 3.47268C2.93066 4.46651 2.2146 5.70334 1.84755 7.06C0.345298 15.8845 -0.237452 29.331 1.8888 37.8025C2.25589 39.1591 2.97196 40.3959 3.96571 41.3897C4.95946 42.3835 6.1962 43.0996 7.5528 43.4668C12.5193 44.8213 32.5083 44.8213 32.5083 44.8213C32.5083 44.8213 52.497 44.8213 57.4633 43.4668C58.8199 43.0996 60.0567 42.3835 61.0505 41.3897C62.0443 40.3959 62.7604 39.1591 63.1275 37.8025C64.7121 28.9655 65.2003 15.5273 63.0865 7.01875Z"
          fill="#FF0000"
        />
        <path d="M26.1055 32.0152L42.6875 22.4107L26.1055 12.8062V32.0152Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_5407_18298">
          <rect width="64" height="45" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  )
)

export default YouTubeLogo
