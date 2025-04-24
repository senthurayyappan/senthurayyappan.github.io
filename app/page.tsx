import { BlogPosts } from '@/components/posts'
import Image from 'next/image'
import ScrollAnimation from '@/components/ScrollAnimation'
import { ShaderCanvas } from '@/components/ShaderCanvas'

import vertexShaderSource from '/shaders/metaball.vert'
import fragmentShaderSource from '/shaders/metaball.frag'
import Link from 'next/link'
import ComicPanel from '@/components/ComicPanel'

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
      <div className="comic grid grid-cols-2 md:grid-cols-3 auto-rows-fr">
        <ComicPanel
          className="col-span-2 row-span-2 items-center justify-center" // Example grid class
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

        <ComicPanel title="About" className='row-span-2' titlePosition='bottom-right' imageSrc='sa-main.jpg' href='/about'/>

        <ComicPanel className="col-span-1 row-span-2" imageSrc="/projects/ballbot-main.jpg" title="Projects" titlePosition='bottom-right' href="/projects"/>


        <ComicPanel
          className='col-span-2'
          imageSrc="/images/panel-2.jpg"
          title="...it's responsive"
          titlePosition="bottom-right"
          childrenClassName="pt-12 px-4"
        >
          <p className='text-justify'>
            I'm a Robotics Research Engineer at University of Michigan, Department of Robotics, where I lead 
            the Open-Source Leg project and build tools for the Neurobionics lab.
          </p>
        </ComicPanel>

        {/* <ComicPanel imageSrc="/images/panel-3.jpg">
          <p className="speech" style={{ position: 'absolute', top: '5%', right: '2%' }}>
            This is something
          </p>
        </ComicPanel> */}


        <ComicPanel imageSrc="sa-publications.jpg" title='Publications' titlePosition='bottom-right' href="/publications"/>

        <ComicPanel imageSrc="sa-articles.jpg" title='Articles' titlePosition='bottom-right' href="/articles"/>


        <ComicPanel
             className="col-span-3"
             imageSrc="/images/the-end.jpg"
             title="THE END"
             titlePosition="bottom-right"
        />
      </div>

  )
}
