import ComicPanel from '@/components/ComicPanel'

const Projects = [
  {
    title: 'opensourceleg',
    description: 'A python software library for numerical computation, data acquisition, and control of lower-limb robotic prosthesis.',
    href: 'https://github.com/neurobionics/opensourceleg',
    colSize: 'col-span-1',
    rowSize: 'row-span-1'
  },
  {
    title: 'opensourceleg',
    description: 'A python software library for numerical computation, data acquisition, and control of lower-limb robotic prosthesis.',
    href: 'https://github.com/neurobionics/opensourceleg',
    colSize: 'col-span-1',
    rowSize: 'row-span-1'
  },    
  {
    title: 'robot-ci',
    description: 'A CI/CD tool to build an up-to-date operating system/image for single board computers that can be used headless/GUI-less to control autonomous / remote robotic systems.',
    href: 'https://github.com/neurobionics/robot-ci',
    colSize: 'col-span-1',
    rowSize: 'row-span-1'
  },
  {
    title: 'onshape-robotics-toolkit',
    description: 'A python library to facilitate interaction with Onshape\'s REST API',
    href: 'https://github.com/neurobionics/onshape-robotics-toolkit',
    colSize: 'col-span-1',
    rowSize: 'row-span-1'
  },
  {
    title: 'anton',
    description: 'A generative design framework built with Blender and Taichi that facilitates design exploration using Narrow-Band Topology Optimization and uses implicit surfaces for mesh generation.',
    href: 'https://github.com/senthurayyappan/anton',
    colSize: 'col-span-1',
    rowSize: 'row-span-1'
  },
  {
    title: 'plotting-toolbox',
    description: 'A VSCode extension to visualize data from log files obtained from robots or simulations. It allows users to generate plots that you can interact with, customize, and save to use in your reports or for debugging purposes.',
    href: 'https://github.com/senthurayyappan/plotting-toolbox',
    colSize: 'col-span-1',
    rowSize: 'row-span-1'
  }
]
export const metadata = {
    title: 'Projects',
    description: 'Look at my projects',
  }

  export default function Page() {
    return (       
        <div className="comic grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
          {Projects.map((project, index) => (
            <ComicPanel 
              key={index}
              title={project.title}
              titlePosition='top-right'
              description={project.description}
              href={project.href}
            />
          ))}
        </div>
    )
  }