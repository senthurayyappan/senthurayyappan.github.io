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
      <ComicPanel description="Senthur Ayyappan, Research Engineer @ Neurobionics Lab, U-M" className='col-span-2 row-span-2' titlePosition='bottom-right' imageSrc='/about/header.jpg'>
        <div className='speech' style={{position: 'absolute', top: '8%', right: '5%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <p className='font-bold'>Gym Badges</p>
          
          <div className="grid grid-cols-3 grid-rows-2 gap-2 p-2">
            <Link href="https://www.nitt.edu/" target="_blank" className="rounded-full panel-button">
              <Image src="/nitt.png" alt="LinkedIn" width={48} height={48} className='p-1'/>
            </Link>
            <Link href="https://www.iitm.ac.in/" target="_blank" className="rounded-full panel-button">
              <Image src="/iitm.png" alt="IIT Madras" width={48} height={48} className='p-1'/>
            </Link>
            <Link href="https://www.drdo.gov.in/" target="_blank" className="rounded-full panel-button">
              <Image src="/drdo.png" alt="DRDO" width={48} height={48} className='p-1'/>
            </Link>
            <Link href="https://www.nsf.gov/" target="_blank" className="rounded-full panel-button">
              <Image src="/nsf.png" alt="NSF" width={48} height={48} />
            </Link>            
            <Link href="https://robotics.umich.edu/" target="_blank" className="panel-button">
              <Image src="/mrobotics.png" alt="Michigan Robotics" width={48} height={48} className='p-1'/>
            </Link>
            <Link href="https://www.rai-inst.com/" target="_blank" className="panel-button">
              <Image src="/rai.jpg" alt="RAI" width={48} height={48} className='p-1'/>
            </Link>             
          </div>
        </div>
      </ComicPanel>

      <ComicPanel 
        className="col-span-1 row-span-2 h-full" 
        title="Project Lead @ Open-Source Leg"
        imageSrc='/about/sa-main.jpg'
        titlePosition="top-right"
        href='https://www.opensourceleg.org/'
        description='An end-to-end open-source platform that makes prosthetics research more accessible.'
      >
      </ComicPanel>

      <ComicPanel 
        className="col-span-1 row-span-2 h-full" 
        title="Consultant @ Robotics and AI Institute"
        titlePosition="top-right"
        imageSrc='/about/umv.webp'
        href='https://www.opensourceleg.org/'
        description='Worked on co-design of the next-generation Ultra-Mobility Vehicle (UMV)'
      >
      </ComicPanel>

      <ComicPanel 
        className="col-span-1 row-span-1 h-full" 
        title="Research Intern @ DRDO | DEBEL"
        imageSrc='/about/exo.jpg'
        imagePosition='0% 90%'
        titlePosition="top-right"
        href='https://www.drdo.gov.in/drdo/labs-and-establishments/defence-bio-engineering-electro-medical-laboratory-debel'
        description='Worked on 2D modeling and simulation of a lower-limb powered exoskeleton'
      >
      </ComicPanel>

      <ComicPanel 
        className="col-span-1 row-span-1 h-full" 
        title="Research Intern @ IIT Madras"
        imageSrc='/about/iitm.jpg'
        imagePosition='0% 15%'
        titlePosition="top-right"
        href='https://ed.iitm.ac.in/~robotics_lab/index.html'
        description='Proposed a novel methodology for determining impedance parameters for teleoperated surgical robots'
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
        className="col-span-1 h-full" 
        title="Education" 
        titlePosition="top-right"
        childrenClassName="p-12"
        description='National Institute of Technology, Tiruchirappalli (NITT)'
      >
        <div className='flex flex-col gap-0'>
            <p>BTech, Production Engineering</p>
            <p>Minor degree in CS</p>
            <p className='font-bold'>CGPA: 8.44/10.0</p>         
        </div>
      </ComicPanel>
      
      <ComicPanel imageSrc="sa-publications.jpg" href="/publications">
          <p className="speech" style={{ position: 'absolute', top: '5%', right: '5%' }}>
            Publications
          </p>
      </ComicPanel>
      
      <ComicPanel className="col-span-1 md:row-span-2" imageSrc="/projects/ballbot-main.jpg" title="Projects" titlePosition='bottom-right' href="/projects"/>

      {/* Skills Panel */}
      <ComicPanel 
        className="col-span-1 md:col-span-2 h-full" 
        title="Skills" 
        titlePosition="bottom-right"
        childrenClassName="p-12"
      >
        <div className='flex flex-col gap-2'>
          <p><span className="font-bold">Programming Languages:</span> Python, C++, Rust (Novice), C#, Javascript, TSX</p>
          <p><span className="font-bold">Design:</span> Onshape, Solidworks, Fusion360, Blender</p>
          <p><span className="font-bold">Simulation / Visualization:</span> Gazebo, MuJoCo, V-REP (CoppeliaSim), Rviz</p>
        </div>
      </ComicPanel>
      
    </div>
  )
}