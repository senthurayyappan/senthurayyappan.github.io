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
        <div className='speech' style={{position: 'absolute', top: '10%', right: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <p className='font-bold'>Gym Badges</p>
          
          <div className="flex flex-col gap-2 justify-center py-4">
            <Link href="https://github.com/senthurayyappan" target="_blank" className="rounded-full border-4 border-transparent hover:border-black transition-colors">
              <Image src="/icons/github.png" alt="GitHub" width={32} height={32} />
            </Link>
            <Link href="https://www.linkedin.com/in/imsenthur/" target="_blank" className="rounded-full border-4 border-transparent hover:border-black transition-colors">
              <Image src="/icons/linkedin.png" alt="LinkedIn" width={32} height={32} />
            </Link>
            <Link href="https://www.instagram.com/senthurayyappan/" target="_blank" className="rounded-full border-4 border-transparent hover:border-black transition-colors">
              <Image src="/icons/instagram.png" alt="Instagram" width={32} height={32} />
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
        title="Research Intern @ DRDO | DEBEL"
        imageSrc='/about/exo.jpg'
        imagePosition='90% 40%'
        titlePosition="top-right"
        href='https://www.drdo.gov.in/drdo/labs-and-establishments/defence-bio-engineering-electro-medical-laboratory-debel'
        description='Worked on 2D modeling and simulation of a lower-limb powered exoskeleton'
      >
      </ComicPanel>

      <ComicPanel 
        className="col-span-2 row-span-1 h-full" 
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
        href='https://ed.iitm.ac.in/~robotics_lab/index.html'
        description='Led a team of around 30 self-motivated undergraduate students working on various robotics and machine learning projects'
      >
      </ComicPanel>
      
      {/* Education Panel */}
      <ComicPanel 
        className="col-span-1 h-full" 
        title="EDUCATION" 
        titlePosition="bottom-right"
        childrenClassName="p-6"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-bold">National Institute of Technology Tiruchirappalli</h3>
            <p>Bachelor of Technology, Production Engineering</p>
            <p className="text-sm text-gray-600">JULY 2016 - JUNE 2020</p>
            <p>Minor degree in Computer Science, CGPA: 8.44/10.0</p>
          </div>
          
          <div>
            <h3 className="font-bold">Maharishi International Residential School</h3>
            <p>Central Board of Secondary Education</p>
            <p className="text-sm text-gray-600">2013 - 2015</p>
            <p>Computer Science, Percentage: 92.6</p>
          </div>
        </div>
      </ComicPanel>
      
      {/* Skills Panel */}
      <ComicPanel 
        className="col-span-1 md:col-span-2 h-full" 
        title="SKILLS" 
        titlePosition="bottom-right"
        childrenClassName="p-6"
      >
        <div className="space-y-2">
          <p><span className="font-bold">Programming Language:</span> Python, C, C#, Embedded Linux, Javascript</p>
          <p><span className="font-bold">Design:</span> Solidworks, Blender, Fusion360, Onshape</p>
          <p><span className="font-bold">Other Packages:</span> ROS, Gazebo</p>
        </div>
      </ComicPanel>
      
    </div>
  )
}