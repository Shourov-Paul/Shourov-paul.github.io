import { useEffect } from 'react'
import { CloseIcon } from '@/utils/icons'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-xl bg-transparent shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors z-10">
                    <CloseIcon className="size-6" />
                </button>
                {children}
            </div>
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    )
}

export default Modal
