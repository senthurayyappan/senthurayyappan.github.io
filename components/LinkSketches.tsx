'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { enhance } from '@senthur/sa-ui/enhance'

export function LinkSketches() {
  const pathname = usePathname()

  useEffect(() => enhance(document), [pathname])

  return null
}
