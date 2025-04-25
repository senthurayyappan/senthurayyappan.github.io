import ComicPanel from '@/components/ComicPanel'

const Publications = [
  {
    title: 'IEEE/ASME Transactions on Mechatronics',
    description: 'A Compensated Open-Loop Impedance Controller Evaluated on the Second-Generation Open-Source Leg Prosthesis, T Kevin Best, Gray C Thomas, Senthur R Ayyappan, Robert D Gregg, Elliott J Rouse',
    href: 'https://ieeexplore.ieee.org/abstract/document/10807510'
  },
  {
    title: 'IEEE Sensors Journal, 2020',
    description: 'Quantitative Estimation of Dynamic Modulation in Impedance Controlled Remote Environment Sensing, Srikar A, Vijay Kumar P, Senthur Raj, and Asokan T.',
    href: 'https://ieeexplore.ieee.org/document/9279234'
  },    
  {
    title: 'IEEE International Conference on Robotics and Automation (ICRA), Paris, 2020',
    description: 'Ibex: A reconfigurable ground vehicle with adaptive terrain navigation capability, Senthur Raj, Manu Aatitya R P, Jack Samuel S, J Veejay Karthik and Ezhilarasi D',
    href: 'https://ieeexplore.ieee.org/document/9196571'
  },
  {
    title: 'IFAC Conference on Advances in Control and Optimization of Dynamical Systems (ACODS), Chennai, 2020',
    description: 'Parameter Determination Technique for Impedance Control of Interactive Robots Using Transformation Matrices, Srikar A., Senthur Raj, Vijay Kumar P., Asokan T.',
    href: 'https://www.sciencedirect.com/science/article/pii/S2405896320300525'
  },
  {
    title: 'Dynamic Modulation of Human Interactive Robots using Impedance Control, Srikar A., Senthur Raj, Vijay Kumar P., Asokan T',
    description: 'International Conference on Advances in Robotics (AIR), Chennai, 2019',
    href: 'https://dl.acm.org/doi/10.1145/3352593.3352597'
  }
]

export const metadata = {
    title: 'Publications',
    description: 'Read my publications',
  }
  
  export default function Page() {
    return (
      <div className="comic grid grid-cols-1 gap-2 h-full">
        {Publications.map((publication, index) => (
          <ComicPanel 
            key={index}
            className="col-span-1 h-full" 
            title={publication.title} 
            titlePosition="top-right"
            childrenClassName="p-6"
            description={publication.description}
            href={publication.href}
          />
        ))}
      </div>
    )
  }