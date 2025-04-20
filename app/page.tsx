import { BlogPosts } from 'app/components/posts'
import Image from 'next/image'
import ScrollAnimation from 'app/components/ScrollAnimation'
import { BentoGrid, BentoItem } from 'app/components/BentoGrid'

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
      <ScrollAnimation delay={0.1}>
        <p className="mb-4 text-center">
          I'm a Robotics Engineer at University of Michigan's Robotics Department, <br />
          where I maintain the Open-Source Leg project and develop tools for the Neurobionics Lab, directed by Prof. Elliott Rouse.
        </p>
      </ScrollAnimation>

      <ScrollAnimation delay={0.2}>
        <div className="my-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {affiliations.map((affiliation) => (
              <a 
                key={affiliation.name} 
                href={affiliation.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Image
                  src={affiliation.logo}
                  alt={`${affiliation.name} logo`}
                  width={100} // Adjust width as needed
                  height={100} // Adjust height as needed
                  className="object-contain" 
                />
              </a>
            ))}
          </div>
        </div>
      </ScrollAnimation>

      {/* Bento Grid Section */}
      <ScrollAnimation delay={0.25}>
        <h2 className="text-2xl font-semibold my-8 text-center">Highlights</h2>
        <BentoGrid className="mb-8">
          {/* Example Items - Customize these */}
          <BentoItem
            title="Research Focus"
            description="Developing robust control strategies for legged robots."
            className="col-span-3" // Spans 1 column on medium screens and up
            animationDelay={0.3}
          />
          <BentoItem
            title="Open Source Leg"
            description="Contributing to the maintenance and development of the OSL project."
            imageSrc="/placeholder.png" // Replace with an actual image path if desired
            imageAlt="Open Source Leg diagram"
            className="md:col-span-2" // Spans 2 columns
            animationDelay={0.35}
          />
          <BentoItem
            title="Neurobionics Lab"
            description="Building tools and software for biomechanics research."
            className="md:col-span-2" // Spans 2 columns
            animationDelay={0.4}
          />
           <BentoItem
            title="Skills"
            description="C++, Python, ROS, Control Systems, Machine Learning."
            className="md:col-span-1" // Spans 1 column
            animationDelay={0.45}
          />
        </BentoGrid>
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
