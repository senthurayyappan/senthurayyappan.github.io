import Image from 'next/image'
import Link from 'next/link'
import ComicPanel from '@/components/ComicPanel'

export const metadata = {
  title: 'About',
  description: 'About Senthur Raj Ayyappan',
}

const affiliations: { name: string; logo: string; url: string }[] = [
  { name: 'NIT Trichy', logo: '/nitt.png', url: 'https://www.nitt.edu/' },
  { name: 'IIT Madras', logo: '/iitm.png', url: 'https://www.iitm.ac.in/' },
  { name: 'DRDO', logo: '/drdo.png', url: 'https://www.drdo.gov.in/' },
  { name: 'NSF', logo: '/nsf.png', url: 'https://www.nsf.gov/' },
  {
    name: 'Michigan Robotics',
    logo: '/mrobotics.png',
    url: 'https://robotics.umich.edu/',
  },
  { name: 'RAI', logo: '/rai.jpg', url: 'https://rai-inst.com/' },
]

const skills: { label: string; value: string }[] = [
  {
    label: 'Languages',
    value: 'Python · C++ · Rust (Novice) · JS · TSX · Bash',
  },
  { label: 'Simulation', value: 'Gazebo · MuJoCo · CoppeliaSim' },
  { label: 'Design', value: 'Onshape · Solidworks · Fusion 360 · Blender' },
]

export default function Page() {
  return (
    <div className="comic grid grid-cols-2 md:grid-cols-3 gap-2 grid-rows-[minmax(200px,1fr)_minmax(200px,1fr)_auto_auto]">
      <ComicPanel
        className="col-span-2 row-span-2"
        imageSrc="/about/sa-header.jpg"
      >
        <div className="affiliations-strip">
          <span className="affiliations-label">Affiliations:</span>
          <div className="affiliations-logos">
            {affiliations.map(({ name, logo, url }) => (
              <Link
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="affiliations-logo"
                data-affiliation={name}
                aria-label={name}
                title={name}
              >
                <Image src={logo} alt={name} width={40} height={40} />
              </Link>
            ))}
          </div>
        </div>
      </ComicPanel>

      <ComicPanel
        className="col-span-2 md:col-span-1 row-span-2 h-full"
        title="Project Lead @ Open-Source Leg"
        imageSrc="/about/sa-main.jpg"
        titlePosition="top-right"
        href="https://www.opensourceleg.org/"
        description="An end-to-end open-source platform that makes prosthetics research more accessible."
      />

      <ComicPanel
        className="col-span-2 md:col-span-1 row-span-2 h-full"
        title="Consultant @ Robotics and AI Institute"
        titlePosition="top-right"
        imageSrc="/about/rai.jpg"
        href="https://rai-inst.com/"
        description="Worked on co-design of the next-generation Ultra-Mobility Vehicle (UMV)"
      />

      <ComicPanel
        className="col-span-2 md:col-span-1 row-span-1 h-full"
        title="Research Intern @ DRDO | DEBEL"
        imageSrc="/about/exo.jpg"
        imagePosition="0% 90%"
        titlePosition="top-right"
        href="https://www.drdo.gov.in/drdo/labs-and-establishments/defence-bio-engineering-electro-medical-laboratory-debel"
        description="Worked on 2D modeling and simulation of a lower-limb powered exoskeleton"
      />

      <ComicPanel
        className="col-span-2 md:col-span-1 row-span-1 h-full"
        title="Research Intern @ IIT Madras"
        imageSrc="/about/iitm.jpg"
        imagePosition="10% 0%"
        titlePosition="top-right"
        href="https://ed.iitm.ac.in/~robotics_lab/index.html"
        description="Developed a transformation-based approach to determine impedance parameters for teleoperated surgical robots"
      />

      <ComicPanel
        className="col-span-2 row-span-1 h-full"
        title="Team Lead @ Spider Tronix, NITT"
        imageSrc="/about/spider.jpg"
        imagePosition="0% 30%"
        titlePosition="top-right"
        href="https://spider.nitt.edu/"
        description="Led a team of around 30 self-motivated undergraduate students working on various robotics and machine learning projects"
      />

      <ComicPanel
        className="col-span-2 h-full"
        title="CGPA: 8.44/10.0"
        titlePosition="top-right"
        description="BTech in Production Engineering with a minor degree in CS"
        imageSrc="/about/nitt.jpg"
        imagePosition="0% 0%"
        href="https://www.nitt.edu/home/academics/departments/prod/"
      />

      <ComicPanel
        className="col-span-1"
        imageSrc="/projects/ballbot-main.jpg"
        title="Projects"
        titlePosition="bottom-right"
        href="/projects"
        newTab={false}
      />

      <ComicPanel
        className="row-span-1"
        imageSrc="/sa-publications.jpg"
        href="/publications"
        newTab={false}
      >
        <p
          className="speech"
          style={{ position: 'absolute', top: '5%', right: '5%' }}
        >
          Publications
        </p>
      </ComicPanel>

      <ComicPanel
        className="col-span-2"
        title="Skills"
        titlePosition="bottom-right"
        childrenClassName="p-6 md:p-10"
        imageSrc="/backgrounds/radial-lines.jpg"
      >
        <div className="bg-white/90 border-2 border-black p-4 md:p-5 max-w-md">
          <div className="flex flex-col gap-3">
            {skills.map(({ label, value }) => (
              <div key={label}>
                <span className="block text-[10px] font-mono uppercase tracking-[0.15em] text-black/60 mb-0.5">
                  {label}
                </span>
                <span className="block text-sm md:text-base font-medium text-black leading-snug">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ComicPanel>
    </div>
  )
}
