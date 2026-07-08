import Image from 'next/image'

export const metadata = {
  title: 'About',
  description: 'About Senthur Raj Ayyappan',
}

const affiliations: { name: string; logo: string; url: string }[] = [
  { name: 'NIT Trichy', logo: '/nitt.png', url: 'https://www.nitt.edu/' },
  { name: 'IIT Madras', logo: '/iitm.png', url: 'https://www.iitm.ac.in/' },
  { name: 'DRDO', logo: '/drdo.png', url: 'https://www.drdo.gov.in/' },
  { name: 'NSF', logo: '/nsf.png', url: 'https://www.nsf.gov/' },
  {
    name: 'Michigan Robotics',
    logo: '/mrobotics.png',
    url: 'https://robotics.umich.edu/',
  },
  { name: 'RAI', logo: '/rai.jpg', url: 'https://rai-inst.com/' },
]

const skills: { label: string; items: string[] }[] = [
  {
    label: 'Languages',
    items: ['Python', 'C++', 'TypeScript', 'Bash'],
  },
  {
    label: 'Simulation',
    items: ['MuJoCo', 'Gazebo', 'IsaacSim', 'CoppeliaSim'],
  },
  {
    label: 'Design',
    items: ['Onshape', 'Solidworks', 'Fusion 360', 'Blender'],
  },
]

const chronology: {
  date: string
  title: string
  org: string
}[] = [
    {
      date: '2026–present',
      title: 'PhD Student',
      org: 'Robotics, University of Michigan',
    },
    {
      date: '2021–2025',
      title: 'Project Lead, Research Engineer',
      org: 'Neurobionics Lab, U-M',
    },
    {
      date: 'Nov 2024 – Jan 2025',
      title: 'Private Consultant',
      org: 'Robotics and AI Institute',
    },
    {
      date: 'May 2020 – July 2020',
      title: 'Research Intern',
      org: 'DRDO/DEBEL Exoskeleton Project',
    },
    {
      date: 'Dec 2018 – July 2019',
      title: 'Research Intern',
      org: 'Robotics Lab, IIT Madras',
    },
    {
      date: 'July 2016 – June 2020',
      title: 'National Institute of Technology Tiruchirappalli',
      org: 'Bachelor of Technology, Production Engineering',
    },
    {
      date: '2013–2015',
      title: 'Maharishi International Residential School',
      org: 'Central Board of Secondary Education',
    },
  ]

function SectionHead({ title, right }: { title: string; right?: string }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {right && <span className="right">{right}</span>}
    </div>
  )
}

function Lede() {
  return (
    <section className="profile-lede">
      <div className="profile-portrait">
        <Image
          src="/about/sa-header.jpg"
          alt="Senthur Ayyappan"
          fill
          sizes="(min-width: 960px) 50vw, 100vw"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <p>
        I'm currently a PhD student in Robotics at the University of
        Michigan, working with Professor Elliott Rouse in the Neurobionics
        Lab. My research focuses on robot codesign: how a robot&rsquo;s
        mechanical design and control policy can co-evolve inside simulation
        instead of being engineered one after the other. Before starting the
        PhD, I spent 2021 to 2025 as a project lead and research engineer in
        the same lab, leading the Open-Source Leg ecosystem, developing the
        version 2.0 hardware, and building the software stack that lets
        researchers interface with the platform. The project is now used by
        more than 25 research groups worldwide.
      </p>
      <p>
        My work has moved between hardware, simulation, and control. As a
        private consultant for the Robotics and AI Institute, I worked on the
        co-design of the next-generation Ultra Mobility Vehicle and developed
        an open-source Python package for connecting parametric CAD assemblies
        to simulation frameworks like Isaac Sim and MuJoCo. Before Michigan,
        I earned my BTech in Production Engineering at NIT Trichy with a minor
        in Computer Science, led Spider Tronix, and worked on research
        internships at DRDO/DEBEL and IIT Madras spanning powered exoskeleton
        simulation, gait-cycle modeling, and impedance control for bilateral
        teleoperation.
      </p>
    </section>
  )
}

function Affiliations() {
  return (
    <section className="profile-affiliations">
      {affiliations.map(({ name, logo, url }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="profile-affiliations-logo"
          aria-label={name}
          title={name}
        >
          <Image src={logo} alt={name} width={48} height={48} />
        </a>
      ))}
    </section>
  )
}

function Experience() {
  const moreArrow = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )

  return (
    <section className="section" id="experience">
      <SectionHead title="Experience" />
      <div className="exp-grid">
        {/* Row 1 — RAI big lead + Open-Source Leg highlight tile */}
        <div className="exp-row exp-row-7-5">
          <a
            href="https://rai-inst.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="exp-big"
          >
            <div className="exp-big-photo">
              <Image
                src="/about/rai.jpg"
                alt="Robotics & AI Institute"
                fill
                sizes="(min-width: 960px) 50vw, 100vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <span className="exp-meta">
              <span>Private Consultant</span>
              <span>2024–2025</span>
            </span>
            <h3>Robotics &amp; AI Institute</h3>
            <p>
              Worked on the co-design of the next-generation Ultra Mobility
              Vehicle and built open-source tooling to connect parametric CAD
              assemblies with simulation workflows in Isaac Sim and MuJoCo.
            </p>
          </a>
          <a
            href="https://www.opensourceleg.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="exp-tile"
            data-bg="osl"
          >
            <span className="exp-stamp">Current</span>
            <span className="exp-meta">
              <span>Project Lead</span>
              <span>2021–2025</span>
            </span>
            <h3>The Open-Source Leg</h3>
            <p>
              Led the hardware and software stack for OSL 2.0, a lower-limb
              robotic platform now used by more than 25 research groups.
            </p>
          </a>
        </div>

        {/* Row 2 — Ballbot full-photo (left) + (NIT, Spider) stacked (right) */}
        <div className="exp-row exp-row-1-1">
          <a
            href="https://robotics.umich.edu/academics/courses/rob-311/"
            target="_blank"
            rel="noopener noreferrer"
            className="exp-big is-portrait"
          >
            <div className="exp-big-photo">
              <Image
                src="/projects/ballbot-main.jpg"
                alt="ROB311 Ballbot"
                fill
                sizes="(min-width: 960px) 50vw, 100vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <span className="exp-meta">
              <span>Research Engineer</span>
              <span>2022–2023</span>
            </span>
            <h3>ROB311 Ballbot</h3>
            <p>
              Co-developed the balancing robot platform used as the hands-on
              teaching vehicle in U-M&rsquo;s introductory robotics course.
            </p>
          </a>
          <div className="exp-big-stack">
            <a
              href="https://www.nitt.edu/home/academics/departments/prod/"
              target="_blank"
              rel="noopener noreferrer"
              className="exp-big"
            >
              <div className="exp-big-photo">
                <Image
                  src="/about/nitt.jpg"
                  alt="NIT Trichy"
                  fill
                  sizes="(min-width: 960px) 50vw, 100vw"
                  style={{ objectFit: 'cover', objectPosition: '0% 0%' }}
                />
              </div>
              <span className="exp-meta">
              <span>BTech, Production Engineering</span>
              <span>2016–2020</span>
            </span>
              <h3>NIT Trichy</h3>
              <p>
                Earned my BTech in Production Engineering with a minor in
                Computer Science, building the mechanics-and-software
                foundation that still anchors my work.
              </p>
            </a>
            <a
              href="https://spider.nitt.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="exp-big"
            >
              <div className="exp-big-photo">
                <Image
                  src="/about/spider.jpg"
                  alt="Spider Tronix, NITT"
                  fill
                  sizes="(min-width: 960px) 50vw, 100vw"
                  style={{ objectFit: 'cover', objectPosition: '0% 30%' }}
                />
              </div>
              <span className="exp-meta">
              <span>Team Lead</span>
              <span>2018–2020</span>
            </span>
              <h3>Spider Tronix, NITT</h3>
              <p>
                Led NIT Trichy&rsquo;s robotics and machine learning club, coordinating a
                student team of roughly thirty across projects, builds, and
                competitions.
              </p>
            </a>
          </div>
        </div>

        {/* Row 3 — IIT Madras + DRDO big pair */}
        <div className="exp-row exp-row-1-1">
          <a
            href="https://ed.iitm.ac.in/~robotics_lab/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="exp-big"
          >
            <div className="exp-big-photo">
              <Image
                src="/about/iitm.jpg"
                alt="IIT Madras"
                fill
                sizes="(min-width: 960px) 50vw, 100vw"
                style={{ objectFit: 'cover', objectPosition: '10% 0%' }}
              />
            </div>
            <span className="exp-meta">
              <span>Research Intern</span>
              <span>2019</span>
            </span>
            <h3>IIT Madras</h3>
            <p>
              Worked on impedance control for bilateral teleoperation,
              developing a transformation-based method for tuning surgical
              robot parameters.
            </p>
          </a>
          <a
            href="https://www.drdo.gov.in/drdo/labs-and-establishments/defence-bio-engineering-electro-medical-laboratory-debel"
            target="_blank"
            rel="noopener noreferrer"
            className="exp-big"
          >
            <div className="exp-big-photo">
              <Image
                src="/about/exo.jpg"
                alt="DRDO | DEBEL"
                fill
                sizes="(min-width: 960px) 50vw, 100vw"
                style={{ objectFit: 'cover', objectPosition: '0% 90%' }}
              />
            </div>
            <span className="exp-meta">
              <span>Research Intern</span>
              <span>2020</span>
            </span>
            <h3>DRDO | DEBEL</h3>
            <p>
              Built simulation models for a lower-limb powered exoskeleton,
              contributing to gait-cycle analysis and early design evaluation
              for their exoskeleton.
            </p>
          </a>
        </div>
      </div>
    </section>
  )
}

function Chronology() {
  return (
    <section className="section" id="chronology">
      <SectionHead title="Chronology" right="Selected timeline" />
      <table className="chronology-table">
        <tbody>
          {chronology.map(({ date, title, org }) => (
            <tr key={`${date}-${title}`}>
              <th scope="row">{date}</th>
              <td>
                <h3>{title}</h3>
                <p className="chronology-org">{org}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function Tools() {
  return (
    <section className="section" id="tools">
      <SectionHead title="Tools of the trade" />
      <div className="profile-tools">
        {skills.map(({ label, items }) => (
          <div key={label} className="profile-tool">
            <span className="profile-tool-label">{label}</span>
            <ul className="profile-tool-list">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Page() {
  return (
    <>
      <Lede />
      <Affiliations />
      <Experience />
      <Chronology />
      <Tools />
    </>
  )
}
