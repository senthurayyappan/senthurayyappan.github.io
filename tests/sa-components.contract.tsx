import { BlogExplorer } from '@/components/BlogExplorer'
import ComicPanel from '@/components/ComicPanel'
import { FontSwitch } from '@/components/font-switch'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button, Panel, SketchAnnotation } from '@senthur/sa-ui/react'

const icon = <svg aria-hidden="true" />

export const textButton = <Button>Save</Button>
export const iconButton = <Button icon={icon} aria-label="Open panel" />
export const mixedButton = <Button icon={icon}>Reset view</Button>
export const panel = <Panel interactive><p>Panel content</p></Panel>
export const sketchAnnotation = <SketchAnnotation>Save</SketchAnnotation>
export const comicPanel = <ComicPanel title="Shared panel" />
export const blogExplorer = <BlogExplorer posts={[]} />
export const themeSwitch = <ThemeSwitch />
export const fontSwitch = <FontSwitch />
