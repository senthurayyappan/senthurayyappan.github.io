'use client'

import { useEffect, useState } from 'react'

const fontPreferenceKey = 'sa-font-preference'
const fullFontClass = 'font-handwritten'
const fontPreferenceEvent = 'sa-font-preference-change'

function usesFullHandwriting() {
  return document.documentElement.classList.contains(fullFontClass)
}

function applyFontPreference(fullHandwriting: boolean) {
  document.documentElement.classList.toggle(fullFontClass, fullHandwriting)

  try {
    window.localStorage.setItem(fontPreferenceKey, fullHandwriting ? 'full' : 'selective')
  } catch {}

  window.dispatchEvent(new Event(fontPreferenceEvent))
}

export function FontSwitch() {
  const [mounted, setMounted] = useState(false)
  const [fullHandwriting, setFullHandwriting] = useState(false)

  useEffect(() => {
    const syncPreference = () => setFullHandwriting(usesFullHandwriting())

    setMounted(true)
    syncPreference()
    window.addEventListener(fontPreferenceEvent, syncPreference)

    return () => window.removeEventListener(fontPreferenceEvent, syncPreference)
  }, [])

  if (!mounted) {
    return <span className="site-font-placeholder" aria-hidden="true" />
  }

  const label = fullHandwriting ? 'Use selected handwriting' : 'Use handwriting everywhere'

  return (
    <button
      type="button"
      onClick={() => applyFontPreference(!fullHandwriting)}
      className="site-icon-button site-font-button"
      aria-label={label}
      aria-pressed={fullHandwriting}
      title={label}
    >
      <span className="site-font-icon" aria-hidden="true">Aa</span>
    </button>
  )
}
