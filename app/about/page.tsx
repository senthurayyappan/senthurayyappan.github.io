import Image from 'next/image'
import Link from 'next/link'
import ComicPanel from '@/components/ComicPanel'

export const metadata = {
  title: 'About',
  description: 'About Senthur Raj Ayyappan',
}

export default function Page() {
  return (
    <div className="comic grid grid-cols-1 md:grid-cols-3 gap-2 h-full">
      {/* Header Panel */}
      <ComicPanel 
        className="col-span-1 md:col-span-3 h-full" 
        title="SENTHUR RAJ AYYAPPAN" 
        titlePosition="top-left"
        childrenClassName="p-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-3">
            <p>Ann Arbor, MI | imsenthur@gmail.com</p>
            <div className="flex gap-3">
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
        </div>
      </ComicPanel>
      
      {/* Experience Panel */}
      <ComicPanel 
        className="col-span-1 md:col-span-2 h-full" 
        title="EXPERIENCE" 
        titlePosition="top-left"
        childrenClassName="p-6"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-bold">Project Lead, Research Engineer | Neurobionics Lab, U-M</h3>
            <p className="text-sm text-gray-600">JUNE 2021 - PRESENT</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Leading the development of the Open-Source Leg (OSL) project</li>
              <li>Co-designed the version 2.0 of the Open-Source Bionic Leg</li>
              <li>Developed a python library for interfacing with the OSL hardware</li>
              <li>Developed a NextJS website from scratch for the OSL community</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold">Research Intern | DRDO/DEBEL Exoskeleton Project</h3>
            <p className="text-sm text-gray-600">MAY 2020 - JULY 2020</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Worked on the dynamics and simulation of a Powered Exoskeleton</li>
              <li>Analyzed and modeled various phases of the human gait cycle</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold">Research Intern | Robotics Lab, IIT Madras</h3>
            <p className="text-sm text-gray-600">DEC 2018 - JULY 2019</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Developed novel impedance controllers for bilateral teleoperation</li>
              <li>Proposed a methodology for quantitatively determining the desired dynamic parameters of an impedance-controlled robot</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold">Team Leader | Spider Tronix, R&D club of NIT Trichy</h3>
            <p className="text-sm text-gray-600">JULY 2017 - JUNE 2020</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Led a team of 41 self-motivated undergraduate students</li>
              <li>Worked on various research projects in the field of Robotics</li>
            </ul>
          </div>
        </div>
      </ComicPanel>
      
      {/* Education Panel */}
      <ComicPanel 
        className="col-span-1 h-full" 
        title="EDUCATION" 
        titlePosition="top-left"
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
        titlePosition="top-left"
        childrenClassName="p-6"
      >
        <div className="space-y-2">
          <p><span className="font-bold">Programming Language:</span> Python, C, C#, Embedded Linux, Javascript</p>
          <p><span className="font-bold">Design:</span> Solidworks, Blender, Fusion360, Onshape</p>
          <p><span className="font-bold">Other Packages:</span> ROS, Gazebo</p>
        </div>
      </ComicPanel>
      
      {/* Activities Panel */}
      <ComicPanel 
        className="col-span-1 h-full" 
        title="ACTIVITIES" 
        titlePosition="top-left"
        childrenClassName="p-6"
      >
        <div className="space-y-3">
          <p>Workshop on Autonomous Robots 2017, conducted a workshop on autonomous robots capable of solving a maze for over 300+ freshers.</p>
          <p>Volunteer at National Service Scheme (NSS), helped in the Plantation project in college where over 6400 saplings were planted.</p>
        </div>
      </ComicPanel>
    </div>
  )
}