import { BlogPosts } from 'app/components/posts'
import Image from 'next/image'
import ScrollAnimation from 'app/components/ScrollAnimation'
import { ComicLayout } from 'app/components/ComicLayout'
import { ComicItem } from 'app/components/ComicItem'
import { ShaderCanvas } from 'app/components/ShaderCanvas'
// Import shader source code
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
      {/* Pass shader sources as props */}
      <ShaderCanvas 
        vertexShaderSource={vertexShaderSource} 
        fragmentShaderSource={fragmentShaderSource}
        height="h-[40vh]"
      />

      <ScrollAnimation delay={0.1}>
        <p className="mb-4 text-center">
          I'm a <span className="font-bold muted">Robotics Research Engineer</span> at University of Michigan's Robotics Department, <br />
          where I maintain the <Link href="https://opensourceleg.org/" className="font-bold accent sa-link">Open-Source Leg</Link> 
          {" "}project and develop tools for the <Link href="https://neurobionics.robotics.umich.edu/" className="font-bold accent sa-link">Neurobionics Lab</Link>.
        </p>
      </ScrollAnimation>

      <ScrollAnimation delay={0.2}>
        <div className="my-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
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
        </div>
      </ScrollAnimation>

      {/* Comic Layout Section */}
      <ScrollAnimation delay={0.25}>
        <h2 className="text-2xl font-semibold my-8 text-center">Highlights</h2>
        <ComicLayout className="mb-8">
          {/* Item 1 */}
          <ComicItem
            title="Research Focus"
            topLeftCaption="Main Area"
            bottomRightCaption=""
            basis="basis-full md:basis-1/2 lg:basis-2/5"
            backgroundClass="bg-gradient-to-br from-yellow-200 to-orange-400"
            animationDelay={0.3}
          />
          {/* Item 2 - with image */}
          <ComicItem
            title="Open Source Leg"
            caption="Maintenance and development of the OSL project."
            basis="basis-1/2 lg:basis-3/5"
            backgroundClass="bg-gradient-to-br from-blue-200 to-sky-400"
            animationDelay={0.35}
          />
          {/* Item 3 */}
          <ComicItem
            title=""
            topLeftCaption="Tools & Software"
            bottomRightCaption="Biomechanics"
            basis="basis-1/2 lg:basis-2/5"
            backgroundClass="bg-gradient-to-br from-green-200 to-lime-400"
            animationDelay={0.4}
          />
          {/* Item 4 */}
          <ComicItem
            title="Skills"
            basis="basis-full md:basis-1/2 lg:basis-3/5"
            backgroundClass="bg-gradient-to-br from-red-200 to-rose-400"
            animationDelay={0.45}
          />
        </ComicLayout>
      </ScrollAnimation>

      <ScrollAnimation delay={0.3}>
        <div className="my-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Articles</h2>
          <BlogPosts />
        </div>      
      </ScrollAnimation>
    </section>
  )
}
