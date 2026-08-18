import { StatsClient } from '@/components/stats/stats-client'

export const metadata = {
  title: 'Stats',
  description:
    'Time spent in an editor, measured by a self-hosted wakapi instance. Project names that are not public repositories are shown under stable pseudonyms.',
}

export default function Page() {
  return <StatsClient />
}
