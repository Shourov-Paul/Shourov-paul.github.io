import Image from 'next/image'

interface ServiceCardTypes {
  icon: string
  title: string
  shortDescription: string
}

const ServiceCard: React.FC<ServiceCardTypes> = ({ title, shortDescription, icon }) => {
  return (
    <div className="bg-secondary border-border flex flex-col items-center rounded-[14px] border p-5">
      <Image src={icon} alt={title} className="my-1 size-14" />
      <h5 className="text-accent mt-2 mb-5 text-center text-base font-semibold">{title}</h5>
      <div className="bg-primary text-primary-content my-4 h-[80px] w-full overflow-scroll rounded-2xl px-4 py-2">
        <p className="text-center text-[14px] font-normal md:text-base">{shortDescription}</p>
      </div>
    </div>
  )
}

export default ServiceCard
