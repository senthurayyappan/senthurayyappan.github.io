# Senthur Ayyappan Portfolio

This repository contains the source for my personal website and blog. I am keeping it public as a reference for academics, roboticists, and researchers who want something more personal than a generic template: a place to show projects and publications, but also a place to write longer notes, build logs, essays, and half-formed thoughts.

The site uses a comic-book-inspired layout with readable article pages, MDX blog posts, project/publication panels, RSS, and a small optional likes feature. The visual system is mostly CSS: rough panel borders, hand-drawn link annotations, extruded hover states, and dithered image treatment.

If you use this as a starting point, I would recommend changing the visual language to fit your own taste and work. The comic-panel style fits this site because I like it; it does not need to become the official uniform of every robotics PhD on the internet, haha.

## Stack

- Next.js App Router
- React and TypeScript
- MDX for blog posts
- CSS-first styling with custom comic-panel and sketch effects
- RSS feed, sitemap, robots file, and article metadata
- Optional lightweight likes API through `NEXT_PUBLIC_LIKES_API_URL`

## Project structure

```text
app/
  about/
  blog/
    posts/          MDX blog posts
    [slug]/         individual blog pages
  projects/
  publications/
  globals.css       site-wide visual system

components/
  BlogExplorer.tsx      blog listing, search, tags, and like counts
  ArticleLikeButton.tsx article like button
  ComicPanel.tsx        reusable panel wrapper
  LinkSketches.tsx      hand-drawn hover annotations
  SAButton.tsx          shared button adapter
  SAPanel.tsx           shared panel adapter
  nav.tsx               sidebar and mobile navigation

styles/
  sa-ui.css             framework-neutral SA component styles

public/
  images, logos, icons, and static assets
```

## SA UI package

`packages/sa-ui` contains the shared visual contract. The package has CSS tokens, base styles, layouts, components, effects, slide patterns, an optional enhancer, and React adapters.

Import the full CSS contract in a CSS-aware application:

```ts
import '@senthur/sa-ui/styles.css'
import '@senthur/sa-ui/fonts.css'
```

The font import is optional. Omit it when the application does not use the handwriting font.

Import the React adapters when the application uses React:

```ts
import { Button, Panel, SketchAnnotation } from '@senthur/sa-ui/react'
```

Run the plain HTML slide example from the repository root:

```bash
npm run demo --workspace @senthur/sa-ui
```

Open `http://localhost:4173/examples/slides.html`. The example loads the committed files in `packages/sa-ui/dist/`. It has no framework build step.

Keep application content outside the package. Project cards, publication cards, navigation, routes, and application state belong to the application.

## Running locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the production version:

```bash
npm run build
```

Start the production server locally:

```bash
npm run start
```

## Writing blog posts

Blog posts live in `app/blog/posts` as `.mdx` files. Each post uses frontmatter for metadata:

```mdx
---
title: My Post Title
publishedAt: 2026-01-01
summary: A short description of the post.
image: /projects/example.jpg
imagePosition: center center
tags: robotics, design
---

Post content goes here.
```

The site automatically reads the post metadata for the blog index, individual article pages, RSS feed, sitemap, and structured article data.

The blog supports an optional like count per post. The static site can render the button and count, but the actual persistence requires a small backend: a VPS, a serverless function, Supabase, or any other API that can store and return likes per post.

Set `NEXT_PUBLIC_LIKES_API_URL` to point the frontend at that service. Without it, the site still builds and runs, but likes are only treated as a local/browser-side interaction.

## License

This repository is public as a reference for the website implementation. The code can be used as inspiration, but the writing, images, logos, and personal branding are specific to this site.
