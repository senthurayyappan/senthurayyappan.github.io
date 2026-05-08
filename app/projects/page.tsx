interface Repository {
  name: string
  description: string
  href: string
  stars: number
  forks: number
  updatedAt: string
  language: string
  owner: string
  homepage?: string
  topics?: string[]
}

const repositories: Repository[] = [
  {
    name: 'onshape-robotics-toolkit',
    description: "A python library to facilitate interaction with Onshape's REST API",
    href: 'https://github.com/neurobionics/onshape-robotics-toolkit',
    stars: 299,
    forks: 33,
    updatedAt: '2026-05-08T02:35:28Z',
    language: 'Python',
    owner: 'neurobionics',
    homepage: 'https://neurobionics.github.io/onshape-robotics-toolkit/',
    topics: ['cad', 'onshape', 'robotics', 'simulation'],
  },
  {
    name: 'anton',
    description:
      'anton is an open-source generative design framework built with Blender and Python',
    href: 'https://github.com/senthurayyappan/anton',
    stars: 196,
    forks: 20,
    updatedAt: '2026-05-06T09:02:32Z',
    language: 'Python',
    owner: 'senthurayyappan',
    homepage: 'https://anton.readthedocs.io/en/latest/',
    topics: [
      'blender',
      'blender-addon',
      'blender-python',
      'computational-design',
      'generative-design',
    ],
  },
  {
    name: 'opensourceleg',
    description:
      'An open-source SDK for developing and testing algorithms on commonly used robotic hardware.',
    href: 'https://github.com/neurobionics/opensourceleg',
    stars: 105,
    forks: 73,
    updatedAt: '2026-05-08T03:08:25Z',
    language: 'Python',
    owner: 'neurobionics',
    homepage: 'https://neurobionics.github.io/opensourceleg/',
    topics: ['prosthetics', 'robotics', 'control-systems', 'python'],
  },
  {
    name: 'robot-ci',
    description:
      'Effortless building, testing, and deploying customized robot operating systems at scale.',
    href: 'https://github.com/neurobionics/robot-ci',
    stars: 93,
    forks: 380,
    updatedAt: '2026-04-27T06:30:28Z',
    language: 'Shell',
    owner: 'neurobionics',
    topics: ['ci', 'cd', 'raspberry-pi', 'robotics'],
  },
  {
    name: 'blendmsh',
    description:
      'Blendmsh is a bridge between Blender 2.80+ and Gmsh, a fast and light 3D finite element mesh generator.',
    href: 'https://github.com/senthurayyappan/blendmsh',
    stars: 42,
    forks: 6,
    updatedAt: '2025-12-20T03:15:40Z',
    language: 'Python',
    owner: 'senthurayyappan',
    topics: ['blender', 'gmsh', 'finite-elements'],
  },
  {
    name: 'import-G-code',
    description:
      'Imports G-code files into Blender 2.80+ as a collection of layers which can then be animated or exported.',
    href: 'https://github.com/senthurayyappan/import-G-code',
    stars: 42,
    forks: 10,
    updatedAt: '2026-05-08T10:28:38Z',
    language: 'G-code',
    owner: 'senthurayyappan',
    topics: ['blender', 'gcode', 'fabrication'],
  },
  {
    name: 'TMotorCANControl',
    description: 'A python API to control AK-series TMotors over the CAN bus.',
    href: 'https://github.com/neurobionics/TMotorCANControl',
    stars: 50,
    forks: 33,
    updatedAt: '2026-05-01T07:55:30Z',
    language: 'Python',
    owner: 'neurobionics',
    topics: ['motors', 'can-bus', 'robotics'],
  },
  {
    name: 'Arboc',
    description: 'An underwater hyper-redundant snake robot.',
    href: 'https://github.com/senthurayyappan/Arboc',
    stars: 24,
    forks: 12,
    updatedAt: '2025-10-22T15:26:58Z',
    language: 'C++',
    owner: 'senthurayyappan',
    topics: ['robotics', 'underwater', 'snake-robot'],
  },
  {
    name: 'pyopensim',
    description:
      'Portable python bindings for OpenSim with comprehensive type hints.',
    href: 'https://github.com/neurobionics/pyopensim',
    stars: 20,
    forks: 5,
    updatedAt: '2026-02-19T07:32:24Z',
    language: 'Python',
    owner: 'neurobionics',
    homepage: 'https://pypi.org/project/pyopensim/',
    topics: ['opensim', 'biomechanics', 'simulation', 'python'],
  },
  {
    name: 'oslsim',
    description:
      'A ROS package that provides the necessary interfaces to simulate the Open-source leg (OSL) proposed by the Neurobionics Lab at UMich',
    href: 'https://github.com/senthurayyappan/oslsim',
    stars: 19,
    forks: 6,
    updatedAt: '2026-04-26T13:20:43Z',
    language: 'Python',
    owner: 'senthurayyappan',
    topics: ['prosthetics', 'robotics', 'ros', 'gazebo'],
  },
  {
    name: 'impedance-control-AIR19',
    description:
      'Dynamic modulation of human interactive robots using Impedance Control',
    href: 'https://github.com/senthurayyappan/impedance-control-AIR19',
    stars: 18,
    forks: 1,
    updatedAt: '2025-11-16T07:18:24Z',
    language: 'MATLAB',
    owner: 'senthurayyappan',
    topics: ['impedance-control', 'robotics'],
  },
  {
    name: 'spring-design-tool',
    description:
      'a software tool that facilitates the design of lightweight torsion springs',
    href: 'https://github.com/neurobionics/spring-design-tool',
    stars: 17,
    forks: 4,
    updatedAt: '2026-01-16T01:01:38Z',
    language: 'MATLAB',
    owner: 'neurobionics',
    topics: ['mechanical-design', 'springs', 'tooling'],
  },
  {
    name: 'rob311',
    description: 'ROB311 Codebase',
    href: 'https://github.com/neurobionics/rob311',
    stars: 3,
    forks: 48,
    updatedAt: '2026-01-03T01:54:13Z',
    language: 'C',
    owner: 'neurobionics',
    topics: ['teaching', 'robotics', 'ballbot'],
  },
  {
    name: 'Roguelike_platformer',
    description:
      'A 2D platformer developed in Unity game engine with pathfinding AI along with mobile onscreen controls and few sprite resources.',
    href: 'https://github.com/senthurayyappan/Roguelike_platformer',
    stars: 13,
    forks: 1,
    updatedAt: '2025-12-09T11:26:43Z',
    language: 'C#',
    owner: 'senthurayyappan',
    topics: ['unity', 'game-dev'],
  },
  {
    name: 'uw_dynamics',
    description: 'A gazebo package to aid simulation of underwater biomimetic robots.',
    href: 'https://github.com/senthurayyappan/uw_dynamics',
    stars: 7,
    forks: 1,
    updatedAt: '2025-08-04T13:25:58Z',
    language: 'C++',
    owner: 'senthurayyappan',
    topics: ['gazebo', 'robotics', 'underwater-robotics'],
  },
  {
    name: 'arboc_workspace',
    description:
      'A ROS workspace with packages required for simulated control of a hyper redundant snake robot [Arboc].',
    href: 'https://github.com/senthurayyappan/arboc_workspace',
    stars: 4,
    forks: 1,
    updatedAt: '2022-06-19T20:54:35Z',
    language: 'Makefile',
    owner: 'senthurayyappan',
    topics: ['ros', 'snake-robot'],
  },
  {
    name: 'rel_imu_plugin',
    description:
      'A sensor plugin for gazebo to compute the orientation, relative angular velocity and relative angular acceleration of a link with respect to its parent frame.',
    href: 'https://github.com/senthurayyappan/rel_imu_plugin',
    stars: 4,
    forks: 1,
    updatedAt: '2022-01-22T11:21:12Z',
    language: 'C++',
    owner: 'senthurayyappan',
    topics: ['gazebo', 'sensor-plugin'],
  },
  {
    name: 'spec-shield',
    description:
      'spec-shield is a curvature adjustable face shield that tackles undesirable reflections and can be mounted on spectacles.',
    href: 'https://github.com/senthurayyappan/spec-shield',
    stars: 4,
    forks: 0,
    updatedAt: '2020-08-25T04:59:40Z',
    language: 'G-code',
    owner: 'senthurayyappan',
    topics: ['covid-19', 'fabrication', 'product-design'],
  },
  {
    name: 'residual-limb-scanner',
    description: 'A WPF application for scanning the residual limb of an amputee.',
    href: 'https://github.com/senthurayyappan/residual-limb-scanner',
    stars: 2,
    forks: 1,
    updatedAt: '2025-03-15T01:19:13Z',
    language: '',
    owner: 'senthurayyappan',
    topics: ['prosthetics', '3d-scanning', 'kinect'],
  },
]

export const metadata = {
  title: 'Projects',
  description: 'Top public GitHub repositories by Senthur Ayyappan.',
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

function RepoEntry({
  repo,
  index,
}: {
  repo: Repository
  index: number
}) {
  return (
    <a
      href={repo.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block group no-underline py-5 border-b border-current/15"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[color:color-mix(in_srgb,var(--text)_55%,transparent)]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3
              className="text-base md:text-lg font-medium leading-snug text-[var(--text)] group-hover:text-[var(--accent)] transition-colors"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              {repo.name}
            </h3>
          </div>
          {repo.description && (
            <p
              className="mt-1.5 text-sm leading-relaxed text-[color:color-mix(in_srgb,var(--text)_70%,transparent)]"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              {repo.description}
            </p>
          )}
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono uppercase tracking-[0.1em] text-[color:color-mix(in_srgb,var(--text)_55%,transparent)]">
            {repo.language && <span>{repo.language}</span>}
            {repo.language && <span aria-hidden>·</span>}
            <span>{repo.stars} stars</span>
            <span aria-hidden>·</span>
            <span>{repo.forks} forks</span>
            <span aria-hidden>·</span>
            <time dateTime={repo.updatedAt}>Updated {formatDate(repo.updatedAt)}</time>
          </p>
          {repo.topics && repo.topics.length > 0 && (
            <p className="mt-2 flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-[0.08em] text-[color:color-mix(in_srgb,var(--text)_50%,transparent)]">
              {repo.topics.slice(0, 4).map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </p>
          )}
        </div>
        <span
          aria-hidden
          className="flex-none mt-1 text-[var(--accent)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </span>
      </div>
    </a>
  )
}

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-6 md:py-10">
      <header className="mb-12">
        <h1
          className="font-medium tracking-tight text-[var(--text)] leading-[0.95]"
          style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 'clamp(3rem, 2rem + 4vw, 5rem)',
          }}
        >
          Projects<span className="text-[var(--accent)]">.</span>
        </h1>
      </header>

      <div>
        {repositories.map((repo, index) => (
          <RepoEntry key={repo.name} repo={repo} index={index} />
        ))}
      </div>
    </section>
  )
}
