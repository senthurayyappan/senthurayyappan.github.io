import Image from 'next/image'
import Link from 'next/link'
import ComicPanel from '@/components/ComicPanel'

export const metadata = {
  title: 'About',
  description: 'About Senthur Raj Ayyappan',
}

export default function Page() {
  return (
    <div className="comic grid grid-cols-2 md:grid-cols-3 gap-2 grid-rows-[minmax(200px,1fr)_minmax(200px,1fr)_auto_auto]">
      {/* Header Panel */}    
      <ComicPanel description="Senthur Ayyappan, PhD Student @ Neurobionics Lab, U-M" className='col-span-2 row-span-2' titlePosition='bottom-right' imageSrc='/about/sa-header.jpg' />

      <ComicPanel
        className="col-span-2 md:col-span-1 row-span-2 h-full" 
        title="Project Lead @ Open-Source Leg"
        imageSrc='/about/sa-main.jpg'
        titlePosition="top-right"
        href='https://www.opensourceleg.org/'
        description='An end-to-end open-source platform that makes prosthetics research more accessible.'
      >
      </ComicPanel>

      <ComicPanel className="col-span-2 md:col-span-3">
        <div className="about-copy">
          <p>
            I&rsquo;m currently a PhD student in Robotics at the University of
            Michigan, working with Professor Elliott Rouse in the Neurobionics
            Lab. My research focuses on robot codesign: how a robot&rsquo;s
            mechanical design and control policy can co-evolve inside simulation
            instead of being engineered one after the other.
          </p>
          <p>
            Before starting the PhD, I spent 2021 to 2025 leading the
            Open-Source Leg ecosystem, developing its version 2.0 hardware and
            the software stack used by more than 25 research groups worldwide.
            My work has moved between hardware, simulation, and control—from
            powered prostheses and exoskeletons to ballbots and parametric CAD
            tools for robot simulation.
          </p>
          <div className="about-affiliations" aria-label="Affiliations">
            <div className="about-affiliations-logos">
              {gymBadges.map((badge) => (
                <Link
                  key={badge.alt}
                  href={badge.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={badge.alt}
                  className={`about-affiliation-link ${badge.alt === 'NSF' ? 'about-affiliation-link--nsf' : ''}`}
                >
                  <Image src={badge.src} alt="" width={52} height={52} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ComicPanel>

      <ComicPanel 
        className="col-span-2 md:col-span-1 row-span-2 h-full" 
        title="Consultant @ Robotics and AI Institute"
        titlePosition="top-right"
        imageSrc='/about/rai.jpg'
        href='https://rai-inst.com/'
        description='Worked on co-design of the next-generation Ultra-Mobility Vehicle (UMV)'
      >
      </ComicPanel>

      <ComicPanel 
        className="col-span-2 md:col-span-1 row-span-1 h-full" 
        title="Research Intern @ DRDO | DEBEL"
        imageSrc='/about/exo.jpg'
        imagePosition='0% 90%'
        titlePosition="top-right"
        href='https://www.drdo.gov.in/drdo/labs-and-establishments/defence-bio-engineering-electro-medical-laboratory-debel'
        description='Worked on 2D modeling and simulation of a lower-limb powered exoskeleton'
      >
      </ComicPanel>

      <ComicPanel 
        className="col-span-2 md:col-span-1 row-span-1 h-full" 
        title="Research Intern @ IIT Madras"
        imageSrc='/about/iitm.jpg'
        imagePosition='10% 0%'
        titlePosition="top-right"
        href='https://ed.iitm.ac.in/~robotics_lab/index.html'
        description='Developed a transformation-based approach to determine impedance parameters for teleoperated surgical robots'
      >
      </ComicPanel>

      <ComicPanel 
        className="col-span-2 row-span-1 h-full" 
        title="Team Lead @ Spider Tronix, NITT"
        imageSrc='/about/spider.jpg'
        imagePosition='0% 30%'
        titlePosition="top-right"
        href='https://spider.nitt.edu/'
        description='Led a team of around 30 self-motivated undergraduate students working on various robotics and machine learning projects'
      >
      </ComicPanel>
      
      {/* Education Panel */}
      <ComicPanel 
        className="col-span-2 h-full" 
        title="CGPA: 8.44/10.0" 
        titlePosition="top-right"
        description='BTech in Production Engineering with a minor degree in CS'
        imageSrc='/about/nitt.jpg'
        imagePosition='0% 0%'
        href='https://www.nitt.edu/home/academics/departments/prod/'
      />
      
      <ComicPanel className="col-span-1" imageSrc="/projects/ballbot-main.jpg" title="Projects" titlePosition='bottom-right' href="/projects" newTab={false}/>

      <ComicPanel className='row-span-1' imageSrc="/sa-publications.jpg" href="/publications" newTab={false}>
          <p className="speech" style={{ position: 'absolute', top: '5%', right: '5%' }}>
            Publications
          </p>
      </ComicPanel>
      
      <ComicPanel 
        className="col-span-2" 
        title="Skills" 
        titlePosition="bottom-right"
        childrenClassName="p-6 md:p-12"
        imageSrc='/backgrounds/radial-lines.jpg'
      >
        <div className='flex flex-col gap-2'>
          <p className='bg-white p-1 border-2 border-black rounded-sm text-black'><span className="font-bold">Languages:</span> Python, C++, Rust (Novice), JS, TSX, Bash</p>
          <p className='bg-white p-1 border-2 border-black rounded-sm text-black'><span className="font-bold">Simulation:</span> Gazebo, MuJoCo, V-REP (now CoppeliaSim)</p>
          <p className='bg-white p-1 border-2 border-black rounded-sm text-black'><span className="font-bold">Design:</span> Onshape, Solidworks, Fusion360, Blender</p>
        </div>
      </ComicPanel>
    </div>
  )
}

const gymBadges = [
  { href: 'https://www.nitt.edu/', src: '/nitt.png', alt: 'NIT Trichy' },
  { href: 'https://www.iitm.ac.in/', src: '/iitm.png', alt: 'IIT Madras' },
  { href: 'https://www.drdo.gov.in/', src: '/drdo.png', alt: 'DRDO' },
  { href: 'https://www.nsf.gov/', src: '/nsf.png', alt: 'NSF' },
  { href: 'https://robotics.umich.edu/', src: '/mrobotics.png', alt: 'Michigan Robotics' },
  { href: 'https://www.rai-inst.com/', src: '/rai.jpg', alt: 'Robotics and AI Institute' },
]
