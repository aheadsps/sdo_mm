interface ImageProps {
  src: string
  alt?: string
  className?: string
}

export const ImageComponent: React.FC<ImageProps> = ({ src, alt = 'Image', className }) => {
  return <img src={src} alt={alt} className={className} />
}
