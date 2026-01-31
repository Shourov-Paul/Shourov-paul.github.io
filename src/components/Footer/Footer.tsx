import Link from 'next/link'
import Logo from '../Navbar/Logo'

const Footer = () => {
  return (
    <footer className="bg-secondary relative flex flex-col items-center justify-center gap-4 overflow-hidden px-4 py-8 md:px-14">
      <a href="/" className="flex items-center gap-2">
        <Logo width={30} height={24} />
        <span className="text-neutral hover:text-accent text-lg font-bold transition-colors duration-300">
          SHOUROV PAUL
        </span>
      </a>

      <p className="text-tertiary-content text-xs text-center">
        © {new Date().getFullYear()} — Copyright All Rights reserved
      </p>
    </footer>
  )
}

export default Footer
