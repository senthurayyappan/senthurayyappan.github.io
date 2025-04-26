import ComicPanel from '@/components/ComicPanel'

const Projects = [
  {
    title: 'Open-Source Leg',
    description: 'Design and development of the Open-Source Leg v2.0: a modular powered prosthetic leg',
    href: 'https://cad.onshape.com/documents/3520551dd01cf402179e8687/w/87da2fb0a553b44a27833624/e/d9c95c04904f8d6a753006a4',
    imageSrc: '/projects/osl-v2.jpg',
    imagePosition: 'center center',
    className: 'col-span-2 row-span-2'
  },
  {
    title: 'onshape-robotics-toolkit',
    description: 'A python library to facilitate interaction with Onshape\'s REST API',
    href: 'https://github.com/neurobionics/onshape-robotics-toolkit',
    imageSrc: '/projects/ballbot-main.jpg',
    imagePosition: 'center center',
    className: 'col-span-1 row-span-2'
  },  
  {
    title: 'opensourceleg',
    description: 'A python software library for numerical computation, data acquisition, and control of lower-limb robotic prosthesis.',
    href: 'https://github.com/neurobionics/opensourceleg',
    imageSrc: '/projects/ballbot-main.jpg',
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
    title: 'anton',
    description: 'A generative design framework built with Blender and Taichi that facilitates design exploration using Narrow-Band Topology Optimization and uses implicit surfaces for mesh generation.',
    href: 'https://github.com/senthurayyappan/anton',
    imageSrc: '/projects/ballbot-main.jpg',
    imagePosition: 'center center',
    className: 'col-span-1 row-span-1'
  },
  {
    title: 'plotting-toolbox',
    description: 'A VSCode extension to visualize data from log files obtained from robots or simulations. It allows users to generate plots that you can interact with, customize, and save to use in your reports or for debugging purposes.',
    href: 'https://github.com/senthurayyappan/plotting-toolbox',
    imageSrc: '/projects/ballbot-main.jpg',
    imagePosition: 'center center',
    className: 'col-span-1 row-span-1'
  }
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
        </div>
    )
  }