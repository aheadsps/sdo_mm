import { forwardRef, Ref, SVGProps } from 'react'

const VideoIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      width="14" height="17" viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <path d="M1 2.93462V16.0621C1.00115 16.3311 1.09022 16.5945 1.25716 16.8225C1.42409 17.0505 1.66225 17.2341 1.94476 17.3525C2.22726 17.471 2.54287 
      17.5196 2.85597 17.4929C3.16907 17.4661 3.4672 17.3651 3.71671 17.2012L14.3501 10.1324C14.5608 9.992 14.7295 9.81082 14.8423 9.60378C14.9551 9.39674 
      15.0087 9.16976 14.9988 8.94153C14.989 8.71329 14.9158 8.49033 14.7854 8.291C14.655 8.09166 14.4711 7.92165 14.2488 7.79496L3.61539 1.73718C3.36154 
      1.59455 3.06737 1.51311 2.7639 1.50145C2.46043 1.4898 2.1589 1.54836 1.89111 1.67097C1.62332 1.79357 1.39919 1.97568 1.24235 2.19808C1.08552 2.42048
       1.00179 2.67494 1 2.93462Z" stroke="#58151C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  )
)

export default VideoIcon
