import { BlogPosts } from 'app/components/posts'
import Image from 'next/image'

export default function Page() {
  return (
    <section>
      <p className="mb-4">
        {`I'm a Robotics Engineer at University of Michigan's Robotics Department, 
        where I maintain the Open-Source Leg project and develop tools for the Neurobionics Lab, directed by Prof. Elliott Rouse.`}
      </p>
      <div className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Articles</h2>
        <BlogPosts />
      </div>
    </section>
  )
}
