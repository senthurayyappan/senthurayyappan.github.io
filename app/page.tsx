import { BlogPosts } from '@/components/posts'
import Image from 'next/image'
import ScrollAnimation from '@/components/ScrollAnimation'
import { ShaderCanvas } from '@/components/ShaderCanvas'
import Link from 'next/link'
import ComicPanel from '@/components/ComicPanel'

import vertexShaderSource from '/shaders/metaball.vert'
import fragmentShaderSource from '/shaders/metaball.frag'

export default function Page() {
  const affiliations = [
    { name: 'NIT Trichy', logo: '/nitt.png', url: 'https://www.nitt.edu/' },
    { name: 'IIT Madras', logo: '/iitm.png', url: 'https://www.iitm.ac.in/' },
    { name: 'DRDO', logo: '/drdo.png', url: 'https://www.drdo.gov.in/' },      
    { name: 'Michigan Robotics', logo: '/mrobotics.png', url: 'https://robotics.umich.edu/' },
    { name: 'NSF', logo: '/nsf.png', url: 'https://www.nsf.gov/' },
    { name: 'RAI', logo: '/rai.jpg', url: 'https://rai-inst.com/' },
  ];


  return (
      <div className="comic grid grid-cols-2 md:grid-cols-3 gap-2 h-full grid-rows-[auto_auto_auto_auto] md:grid-rows-[1fr_1fr_auto]">
        <ComicPanel
          className="col-span-2 md:row-span-2 items-center justify-center h-full" // Example grid class
          imageSrc="/images/panel-1.jpg"
          title="Some garden variety implicit surfaces..."
          titlePosition="bottom-left"
        >
          <ShaderCanvas
            fragmentShaderSource={fragmentShaderSource}
            vertexShaderSource={vertexShaderSource}
            className="-z-10"
          />
        </ComicPanel>

        <ComicPanel title="About" className='col-span-1 md:row-span-2 h-full' titlePosition='bottom-right' imageSrc='sa-main.jpg' href='/about'/>

        <ComicPanel className="col-span-1 md:row-span-2 h-full" imageSrc="/projects/ballbot-main.jpg" title="Projects" titlePosition='bottom-right' href="/projects"/>


        <ComicPanel
          className='col-span-2 row-span-1 h-full'
          imageSrc="sa-intro.jpg"
          titlePosition="bottom-right"
          childrenClassName="pt-12 px-8"
          imagePosition="0px -80px"
          description='I am a Robotics Research Engineer at University of Michigan, Department of Robotics, where I lead 
            the Open-Source Leg project and build tools for the Neurobionics lab.'
        >
        </ComicPanel>

        {/* <ComicPanel imageSrc="/images/panel-3.jpg">

        </ComicPanel> */}


        <ComicPanel imageSrc="sa-publications.jpg" className="h-full" href="/publications">
          <p className="speech" style={{ position: 'absolute', top: '5%', right: '5%' }}>
            Publications
          </p>
        </ComicPanel>

        <ComicPanel imageSrc="sa-articles.jpg" title='Articles' titlePosition='bottom-right' className="h-full" href="/articles"/>


        <ComicPanel
             className="col-span-2 md:col-span-3 h-full"
             imageSrc="sa-footer.jpg"
             imagePosition="0px -32px"
             title="THE END"
             titlePosition="bottom-right"
        >
          <div className='speech' style={{ position: 'absolute', top: '20%', right: '20%' }}>
            <div className="flex gap-3 p-2">
              <Link href="https://github.com/senthurayyappan" target="_blank" className="rounded-full border-4 border-transparent hover:border-black transition-colors">
                <Image src="/icons/github.png" alt="GitHub" width={42} height={42} />
              </Link>
              <Link href="https://www.linkedin.com/in/imsenthur/" target="_blank" className="rounded-full border-4 border-transparent hover:border-black transition-colors">
                <Image src="/icons/linkedin.png" alt="LinkedIn" width={42} height={42} />
              </Link>
              <Link href="https://www.instagram.com/senthurayyappan/" target="_blank" className="rounded-full border-4 border-transparent hover:border-black transition-colors">
                <Image src="/icons/instagram.png" alt="Instagram" width={42} height={42} />
              </Link>
            </div>
          </div>
        </ComicPanel>
      </div>

  )
}
