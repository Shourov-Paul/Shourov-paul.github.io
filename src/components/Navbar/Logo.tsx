import Image from 'next/image'
import logo from '../../app/favicon.ico'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

const Logo = ({ width = 40, height = 40, className = 'object-contain' }: LogoProps) => {
  return (
    <Image
      src={logo}
      alt="SHOUROV PAUL Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}

export default Logo
