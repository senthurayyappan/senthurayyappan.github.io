'use client'

import Image from 'next/image'
import RecentUpdates from '@/components/RecentUpdates'
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
    <>
      <div className="comic grid grid-cols-2 md:grid-cols-3 gap-2 grid-rows-[minmax(200px,1fr)_minmax(200px,1fr)_auto_auto]">
        <ComicPanel
          className="col-span-2 row-span-2"
          priority={true}
        >
          <RecentUpdates />
        </ComicPanel>

        <ComicPanel 
          title="About" 
          className='col-span-1 row-span-2' 
          titlePosition='bottom-right' 
          imageSrc='/sa-about.jpg' 
          href='/about' 
          newTab={false}
          priority={true}
        />

        <ComicPanel 
          className="col-span-1 md:row-span-2" 
          imageSrc="/projects/ballbot-main.jpg" 
          title="Projects" 
          titlePosition='bottom-right' 
          href="/projects" 
          newTab={false}
          priority={true}
        />

        <ComicPanel
          className='col-span-2 row-span-1'
          imageSrc="/sa-intro.jpg"
          titlePosition="bottom-right"
          childrenClassName="pt-12 px-8"
          imagePosition="0% 40%"
          description='I am a Robotics Research Engineer at the University of Michigan, Department of Robotics, where I lead 
            the Open-Source Leg project and build tools & libraries for the Neurobionics lab.'
          priority={true}
        >
        </ComicPanel>

        {/* <ComicPanel imageSrc="/images/panel-3.jpg">

        </ComicPanel> */}


        <ComicPanel imageSrc="/sa-publications.jpg" href="/publications" newTab={false}>
          <p className="speech" style={{ position: 'absolute', top: '5%', right: '5%' }}>
            Publications
          </p>
        </ComicPanel>

        <ComicPanel imageSrc="/sa-articles.jpg" title='Blog' titlePosition='bottom-right' href="/blog" newTab={false}/>
        <ComicPanel
             className="col-span-2 md:col-span-3 row-span-1"
             imageSrc="/sa-socials.jpg"
             imagePosition="0% 32%"
             title="THE END"
             titlePosition="bottom-left"
        >
          <div className='speech' style={{ position: 'absolute', top: '5%', right: '1%' }}>
            <div className="flex gap-2">
              <Link href="https://github.com/senthurayyappan" target="_blank" className="rounded-full panel-button">
                <Image src="/icons/github.png" alt="GitHub" width={32} height={32} />
              </Link>
              <Link href="https://www.linkedin.com/in/imsenthur/" target="_blank" className="rounded-full panel-button">
                <Image src="/icons/linkedin.png" alt="LinkedIn" width={32} height={32} />
              </Link>
              <Link href="https://www.instagram.com/senthurayyappan/" target="_blank" className="rounded-full panel-button">
                <Image src="/icons/instagram.png" alt="Instagram" width={32} height={32} />
              </Link>
            </div>
          </div>
        </ComicPanel>
      </div>
    </>
  )
}
