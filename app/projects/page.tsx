import ComicPanel from '@/components/ComicPanel'
import Image from 'next/image'

const Projects = [
  {
    title: 'Open-Source Leg',
    description: 'An end-to-end open-source powered robotic leg for prosthetics research',
    href: 'https://cad.onshape.com/documents/3520551dd01cf402179e8687/w/87da2fb0a553b44a27833624/e/d9c95c04904f8d6a753006a4',
    imageSrc: '/projects/osl-v2.jpg',
    imagePosition: 'center center',
    className: 'col-span-2 row-span-2'
  },
  {
    title: 'onshape-robotics-toolkit',
    description: 'A python library to facilitate interaction with Onshape\'s REST API and to export CAD assemblies to URDF/MJCFs',
    href: 'https://github.com/neurobionics/onshape-robotics-toolkit',
    imageSrc: '/about/rai.jpg',
    imagePosition: 'center center',
    className: 'col-span-1 row-span-2'
  },
  {
    title: 'anton',
    description: 'An open-source generative design framework built with Python, Taichi, and Blender',
    href: 'https://github.com/senthurayyappan/anton',
    imageSrc: '/projects/anton.jpg',
    imagePosition: 'center center',
    className: 'col-span-1 row-span-1'
  },     
  {
    title: 'robot-ci',
    description: 'A CI/CD tool to build an up-to-date operating system/image for single board computers that can be used headless/GUI-less to control autonomous / remote robotic systems.',
    href: 'https://github.com/neurobionics/robot-ci',
    imageSrc: '/projects/robot-ci.jpg',
    imagePosition: 'top center',
    className: 'col-span-2 row-span-1'
  },
  {
    title: 'ROB311',
    description: 'A robot with 3 wheels that can balance on top of a basketball for the inaugural Robotics Undergraduate Curriculum at Michigan Robotics.',
    href: 'https://github.com/michiganrobotics/rob311',
    imageSrc: '/projects/ballbot-main.jpg',
    imagePosition: 'center center',
    className: 'col-span-2 row-span-2'
  },   
  {
    title: 'arboc',
    description: 'A garden variety hyper-redundant underwater snake robot',
    href: 'https://github.com/senthurayyappan/Arboc',
    imageSrc: '/projects/arboc.jpg',
    imagePosition: 'center center',
    className: 'col-span-1 row-span-1'
  },
  {
    title: 'ibex',
    description: 'Robot with a dynamic wheelbase and an adaptive thrust based friction optimization mechanism',
    href: 'https://ieeexplore.ieee.org/document/9196571',
    imageSrc: '/projects/ibex.jpg',
    imagePosition: 'center center',
    className: 'col-span-1 row-span-1'
  },
  {
    title: 'oslsim',
    description: 'A ROS package that provides the necessary interfaces to simulate the Open-source leg (OSL) in Gazebo',
    href: 'https://github.com/senthurayyappan/oslsim',
    imageSrc: '/projects/oslsim.jpg',
    imagePosition: 'center center',
    className: 'col-span-1 row-span-1'
  },
  {
    title: 'import-G-code',
    description: 'Imports G-code files into Blender 2.80+ as a collection of layers which can then be animated or exported',
    href: 'https://github.com/senthurayyappan/import-G-code',
    imageSrc: '/projects/gcode.jpg',
    imagePosition: 'center center',
    className: 'col-span-1 row-span-1'
  },

]
export const metadata = {
    title: 'Projects',
    description: 'Look at my projects',
  }

  export default function Page() {
    return (       
        <div className="comic grid grid-cols-2 md:grid-cols-3 gap-2 grid-rows-[minmax(200px,1fr)_minmax(200px,1fr)_auto_auto]">
          {Projects.map((project, index) => (
            <ComicPanel 
              key={index}
              title={project.title}
              titlePosition='top-right'
              description={project.description}
              href={project.href}
              imageSrc={project.imageSrc}
              imagePosition={project.imagePosition}
              className={project.className}
            />
          ))}
          <ComicPanel 
            className="col-span-1" 
            childrenClassName="p-6 md:p-12"
            imageSrc='/backgrounds/radial-lines.jpg'
            href='https://github.com/senthurayyappan'
          >
            <div className='flex flex-col gap-4 items-center'>
              <span className='text-2xl bg-white p-2 ps-4 pb-4 border-2 font-bold text-[var(--accent)]'>For more projects, check out my GitHub account :)</span>
              <Image src='/icons/github.png' alt='GitHub' width={100} height={100} />
            </div>
          </ComicPanel>          
        </div>
    )
  }