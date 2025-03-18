interface ImageProps {
  src: string
  alt?: string
  className?: string
}

const ImageComponent: React.FC<ImageProps> = ({ src, alt = 'Image', className }) => {
  return <img src={src} alt={alt} className={className} />
}

export default ImageComponent
