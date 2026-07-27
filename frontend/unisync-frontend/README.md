# UniSync

UniSync is an AI-powered peer matching and research collaboration platform built for students at Pokhara University in the Computer, IT, and Software Engineering faculties. It helps students discover peers with shared academic interests, post and join project ideas, form digital collaboration agreements, and track contributions through a verified, accountable workflow.

## Problem

Group academic projects often fail not due to lack of skill, but due to lack of structure — no easy way to find the right collaborators, no accountability when a teammate stops contributing, and no record of who actually did the work. UniSync addresses this through peer discovery, posted ideas, digital agreements, and activity tracking.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS v4
- **Animation:** Motion (Framer Motion)
- **Icons:** Lucide React
- **State management:** React Context (`UserContext`)

## Project Structure

src/

├── app/

│   ├── layout.tsx          Root layout — global CSS, UserProvider, modals

│   ├── page.tsx             Route: "/"

│   ├── UserContext.tsx      Shared auth/user state

│   ├── dashboard/            Route: "/dashboard"

│   ├── features/             Route: "/features"

│   ├── interests/            Route: "/interests"

│   ├── pages/                  Page-level components

│   └── components/

│       ├── home/               Landing page sections

│       ├── auth/                 Login / Signup modals

│       ├── dashboard/             Dashboard tab modules

│       └── shared/, ui/             Shared UI components

└── styles/                       Global styles, design token





This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




# Create Themed Homepage

  This is a code bundle for Create Themed Homepage. The original project is available at https://www.figma.com/design/v4Nk5AvHI3iqGbn20w35BJ/Create-Themed-Homepage.

  