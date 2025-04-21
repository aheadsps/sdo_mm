import { forwardRef, Ref, SVGProps } from 'react'

const ArticleIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <path d="M3 8H7V9H3V8ZM3 5.5H9V6.5H3V5.5ZM3 10.5H5.5V11.5H3V10.5Z" fill="#58151C" />
      <path
        d="M10.5 1.5H9V1C9 0.734784 8.89464 0.48043 8.70711 0.292893C8.51957 0.105357 8.26522 0 8 0H4C3.73478 0 3.48043 0.105357 3.29289 0.292893C3.10536 0.48043 3 0.734784 3 1V1.5H1.5C1.23478 1.5 0.98043 1.60536 0.792893 1.79289C0.605357 1.98043 0.5 2.23478 0.5 2.5V13C0.5 13.2652 0.605357 13.5196 0.792893 13.7071C0.98043 13.8946 1.23478 14 1.5 14H10.5C10.7652 14 11.0196 13.8946 11.2071 13.7071C11.3946 13.5196 11.5 13.2652 11.5 13V2.5C11.5 2.23478 11.3946 1.98043 11.2071 1.79289C11.0196 1.60536 10.7652 1.5 10.5 1.5ZM4 1H8V3H4V1ZM10.5 13H1.5V2.5H3V4H9V2.5H10.5V13Z"
        fill="#58151C"
      />
    </svg>
  )
)

export default ArticleIcon
