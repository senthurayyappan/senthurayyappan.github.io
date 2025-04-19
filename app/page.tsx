import { BlogPosts } from 'app/components/posts'
import Image from 'next/image'

export default function Page() {
  const affiliations = [
    { name: 'NIT Trichy', logo: '/nitt.png', url: 'https://www.nitt.edu/', width: 100, height: 100 },
    { name: 'IIT Madras', logo: '/iitm.png', url: 'https://www.iitm.ac.in/', width: 90, height: 100 },
    { name: 'DRDO', logo: '/drdo.png', url: 'https://www.drdo.gov.in/', width: 80, height: 100 },      
    { name: 'Michigan Robotics', logo: '/mrobotics.png', url: 'https://robotics.umich.edu/', width: 75, height: 100 },
    { name: 'NSF', logo: '/nsf.png', url: 'https://www.nsf.gov/', width: 90, height: 100 },
    { name: 'RAI', logo: '/rai.jpg', url: 'https://rai.usc.edu/', width: 75, height: 100 },
  ];

  return (
    <section>
      <p className="mb-4 text-center">
        I'm a Robotics Engineer at University of Michigan's Robotics Department, <br />
        where I maintain the Open-Source Leg project and develop tools for the Neurobionics Lab, directed by Prof. Elliott Rouse.
      </p>
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
                width={affiliation.width} // Adjust width as needed
                height={affiliation.height} // Adjust height as needed
                className="object-contain" 
              />
            </a>
          ))}
        </div>
      </div>
      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Articles</h2>
        <BlogPosts />
      </div>      
    </section>
  )
}
