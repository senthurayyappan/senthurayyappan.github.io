import { BlogExplorer } from '@/components/BlogExplorer'
import ComicPanel from '@/components/ComicPanel'
import { FontSwitch } from '@/components/font-switch'
import { SAButton } from '@/components/SAButton'
import { SAPanel } from '@/components/SAPanel'
import { ThemeSwitch } from '@/components/theme-switch'

const icon = <svg aria-hidden="true" />

export const textButton = <SAButton>Save</SAButton>
export const iconButton = <SAButton icon={icon} aria-label="Open panel" />
export const mixedButton = <SAButton icon={icon}>Reset view</SAButton>
export const panel = <SAPanel interactive><p>Panel content</p></SAPanel>
export const comicPanel = <ComicPanel title="Shared panel" />
export const blogExplorer = <BlogExplorer posts={[]} />
export const themeSwitch = <ThemeSwitch />
export const fontSwitch = <FontSwitch />
