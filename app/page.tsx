import { BlogPosts } from 'app/components/posts'
import Image from 'next/image'
import ScrollAnimation from 'app/components/ScrollAnimation'
import { ShaderCanvas } from 'app/components/ShaderCanvas'

import vertexShaderSource from '/shaders/metaball.vert'
import fragmentShaderSource from '/shaders/metaball.frag'
import Link from 'next/link'

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
    <section>
      <ScrollAnimation delay={0.1} className='comic'>
        <div className="panel-1 border">
          <ShaderCanvas 
            vertexShaderSource={vertexShaderSource} 
            fragmentShaderSource={fragmentShaderSource}
            height="h-[40vh]"
          />
        </div>

        <p className="panel-2 text-left items-center align-middle">
          I'm a <span className="font-bold muted">Robotics Research Engineer</span> at University of Michigan's Robotics Department, <br />
          where I maintain the <Link href="https://opensourceleg.org/" className="font-bold accent sa-link">Open-Source Leg</Link> 
          {" "}project and develop tools for the <Link href="https://neurobionics.robotics.umich.edu/" className="font-bold accent sa-link">Neurobionics Lab</Link>.
        </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 panel-3 border rounded-md">
            {affiliations.map((affiliation) => (
              <a
                key={affiliation.name}
                href={affiliation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-md shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <Image
                  src={affiliation.logo}
                  alt={`${affiliation.name} logo`}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </a>
            ))}
          </div>

        <div className="panel-4 my-8">
          <h2 className="text-xl font-semibold mb-4">Recent Articles</h2>
          <BlogPosts />
        </div>      
      </ScrollAnimation>
    </section>
  )
}
