import ComicPanel from '@/components/ComicPanel'

export const metadata = {
    title: 'Projects',
    description: 'Look at my projects',
  }
  
  export default function Page() {
    return (
      <div>
        <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Projects</h1>
        
        <div className="comic grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
          <ComicPanel 
            className="col-span-1 h-full" 
            title="opensourceleg" 
            titlePosition="top-left"
            childrenClassName="p-6"
          >
            <div className="space-y-2">
              <p className="text-sm">Downloads: 22,583, Forks: 25, Stars: 25</p>
              <p>A python software library for numerical computation, data acquisition, and control of lower-limb robotic prosthesis.</p>
            </div>
          </ComicPanel>
          
          <ComicPanel 
            className="col-span-1 h-full" 
            title="neurobionicspi" 
            titlePosition="top-left"
            childrenClassName="p-6"
          >
            <div className="space-y-2">
              <p className="text-sm">Forks: 266, Stars: 58</p>
              <p>A CI/CD tool to build an up-to-date operating system/image for single board computers that can be used headless/GUI-less to control autonomous / remote robotic systems.</p>
            </div>
          </ComicPanel>
          
          <ComicPanel 
            className="col-span-1 h-full" 
            title="anton" 
            titlePosition="top-left"
            childrenClassName="p-6"
          >
            <div className="space-y-2">
              <p className="text-sm">Forks: 18, Stars: 169</p>
              <p>A generative design framework built with Blender and Taichi that facilitates design exploration using Narrow-Band Topology Optimization and uses implicit surfaces for mesh generation.</p>
            </div>
          </ComicPanel>
          
          <ComicPanel 
            className="col-span-1 h-full" 
            title="plotting-toolbox" 
            titlePosition="top-left"
            childrenClassName="p-6"
          >
            <div className="space-y-2">
              <p className="text-sm">Downloads: 51</p>
              <p>A VSCode extension to visualize data from log files obtained from robots or simulations. It allows users to generate plots that you can interact with, customize, and save to use in your reports or for debugging purposes.</p>
            </div>
          </ComicPanel>
        </div>
      </div>
    )
  }