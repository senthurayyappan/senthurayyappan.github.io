import ComicPanel from '@/components/ComicPanel'

export const metadata = {
    title: 'Publications',
    description: 'Read my publications',
  }
  
  export default function Page() {
    return (
      <div>
        <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Publications</h1>
        
        <div className="comic grid grid-cols-1 gap-2 h-full">
          <ComicPanel 
            className="col-span-1 h-full" 
            title="IEEE International Conference on Robotics and Automation (ICRA), Paris, 2020" 
            titlePosition="top-left"
            childrenClassName="p-6"
          >
            <p>Ibex: A reconfigurable ground vehicle with adaptive terrain navigation capability, Senthur Raj, Manu Aatitya R P, Jack Samuel S, J Veejay Karthik and Ezhilarasi D</p>
          </ComicPanel>
          
          <ComicPanel 
            className="col-span-1 h-full" 
            title="IFAC Conference on Advances in Control and Optimization of Dynamical Systems (ACODS), Chennai, 2020" 
            titlePosition="top-left"
            childrenClassName="p-6"
          >
            <p>Parameter Determination Technique for Impedance Control of Interactive Robots Using Transformation Matrices, Srikar A., Senthur Raj, Vijay Kumar P., Asokan T.</p>
          </ComicPanel>
          
          <ComicPanel 
            className="col-span-1 h-full" 
            title="IEEE Sensors Journal, 2020" 
            titlePosition="top-left"
            childrenClassName="p-6"
          >
            <p>Quantitative Estimation of Dynamic Modulation in Impedance Controlled Remote Environment Sensing, Srikar A, Vijay Kumar P, Senthur Raj, and Asokan T.</p>
          </ComicPanel>
          
          <ComicPanel 
            className="col-span-1 h-full" 
            title="International Conference on Advances in Robotics (AIR), Chennai, 2019" 
            titlePosition="top-left"
            childrenClassName="p-6"
          >
            <p>Dynamic Modulation of Human Interactive Robots using Impedance Control, Srikar A., Senthur Raj, Vijay Kumar P., Asokan T</p>
          </ComicPanel>
        </div>
      </div>
    )
  }