import { forwardRef, Ref, SVGProps } from 'react'

const DoubleIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      width="11"
      height="12"
      viewBox="0 0 11 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <path
        d="M9.5748 9.9001H3.7248C3.463 9.9001 3.23505 9.80305 3.04095 9.60895C2.84685 9.41486 2.7498 9.1869 2.7498 8.9251V1.1251C2.7498 0.863295
         2.84685 0.635344 3.04095 0.441247C3.23505 0.247149 3.463 0.150101 3.7248 0.150101H7.9498L10.5498 2.7501V8.9251C10.5498 9.1869 10.4528 9.41486
          10.2587 9.60895C10.0646 9.80305 9.83661 9.9001 9.5748 9.9001ZM7.2998 3.4001V1.1251H3.7248V8.9251H9.5748V3.4001H7.2998ZM1.7748 11.8501C1.513 
          11.8501 1.28505 11.7531 1.09095 11.559C0.896853 11.3649 0.799805 11.1369 0.799805 10.8751V3.4001H1.7748V10.8751H7.9498V11.8501H1.7748Z"
        fill="#58151C"
      />
    </svg>
  )
)

export default DoubleIcon
