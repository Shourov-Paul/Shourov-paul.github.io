import {
  JavaScriptIcon,
  TypescriptIcon,
  ReactIcon,
  NextjsIcon,
  NodejsIcon,
  ExpressjsIcon,
  NestjsIcon,
  SocketIcon,
  ArduinoIDEIcon,
  KIcadIcon,
  Fusion360Icon,
  PythonIcon,
  AdobePremeierProIcon
} from '@/utils/icons'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Skills & Proficiency | Shourov Paul',
  description: 'A breakdown of my technical skills, domain expertise, and tool proficiencies.',
}

interface SkillItem {
  name: string
  Icon: any
  level: string // "Advanced" | "Intermediate" | "Familiar"
  percentage: number // for the progress bar
}

interface SkillCategory {
  title: string
  skills: SkillItem[]
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    skills: [
      { name: 'JavaScript', Icon: JavaScriptIcon, level: 'Advanced', percentage: 92 },
      { name: 'TypeScript', Icon: TypescriptIcon, level: 'Advanced', percentage: 88 },
      { name: 'Python', Icon: PythonIcon, level: 'Intermediate', percentage: 78 },
    ],
  },
  {
    title: 'Full-Stack Web Development',
    skills: [
      { name: 'Next.js', Icon: NextjsIcon, level: 'Advanced', percentage: 90 },
      { name: 'React.js', Icon: ReactIcon, level: 'Advanced', percentage: 92 },
      { name: 'Node.js', Icon: NodejsIcon, level: 'Advanced', percentage: 85 },
      { name: 'Express.js', Icon: ExpressjsIcon, level: 'Advanced', percentage: 85 },
      { name: 'Nest.js', Icon: NestjsIcon, level: 'Intermediate', percentage: 75 },
      { name: 'Socket.io', Icon: SocketIcon, level: 'Intermediate', percentage: 80 },
    ],
  },
  {
    title: 'Embedded Systems, Robotics & CAD',
    skills: [
      { name: 'Arduino IDE', Icon: ArduinoIDEIcon, level: 'Advanced', percentage: 95 },
      { name: 'KiCad (PCB Design)', Icon: KIcadIcon, level: 'Advanced', percentage: 88 },
      { name: 'Fusion 360 (3D CAD)', Icon: Fusion360Icon, level: 'Advanced', percentage: 85 },
    ],
  },
  {
    title: 'Creative Tools & Others',
    skills: [
      { name: 'Premiere Pro', Icon: AdobePremeierProIcon, level: 'Intermediate', percentage: 75 },
    ],
  },
]

export default function SkillsPage() {
  return (
    <main className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem] min-h-[70vh]">
      <div className="mb-12">
        <SectionHeading
          title="Skills & Expertise"
          subtitle="A detailed breakdown of my technical stack and proficiency levels."
        />
      </div>

      <div className="space-y-12">
        {skillCategories.map((category) => (
          <div key={category.title} className="space-y-6">
            <h3 className="text-xl font-bold text-accent border-b border-border/40 pb-2 tracking-wide uppercase">
              {category.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.skills.map((skill) => {
                const { Icon } = skill
                return (
                  <div
                    key={skill.name}
                    className="group border border-border bg-secondary rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/5 flex items-center gap-5"
                  >
                    <div className="p-3 bg-primary border border-border rounded-xl group-hover:border-accent/40 group-hover:shadow-[0_0_15px_rgba(24,242,229,0.1)] transition-all duration-300 shrink-0">
                      <Image src={Icon} alt={skill.name} className="w-10 h-10 object-contain text-primary-content group-hover:text-accent transition-colors duration-300" />
                    </div>

                    <div className="flex-grow space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral text-base group-hover:text-accent transition-colors duration-300">
                          {skill.name}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          skill.level === 'Advanced'
                            ? 'bg-accent/10 border-accent/20 text-accent'
                            : 'bg-[#5565e8]/10 border-[#5565e8]/20 text-[#5565e8]'
                        }`}>
                          {skill.level}
                        </span>
                      </div>

                      {/* Custom Progress Bar */}
                      <div className="w-full h-2 bg-primary border border-border/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <a
          href="/"
          className="text-accent hover:text-white transition-colors duration-300 font-semibold"
        >
          ← Back to Homepage
        </a>
      </div>
    </main>
  )
}
