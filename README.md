# IIIT Kottayam Football League

This is the central repository for the college men's and women's football league website. 

## Tech Stack
* Frontend: Next.js, React
* Database/Backend: Supabase
* Deployment: Vercel
* Package Manager: pnpm

## Workflow Rules
We use a strict issue-driven forking workflow. If you do not follow these steps, your Pull Request will be rejected.

1. Do not push directly to the `main` branch.
2. Fork this repository. Make sure you uncheck "Copy the main branch only" so you get the dev branches.
3. Check out the specific dev branch assigned to you on your fork.
4. Complete the tasks exactly as described in your assigned GitHub Issue.
5. Open a Pull Request from your fork's dev branch to the upstream `main` branch.
6. You must include `Closes #<Issue_Number>` in your PR description so the Kanban board updates automatically.

## Local Setup
1. Clone your fork locally.
2. Run `pnpm install`
3. Create a `.env.local` file and add the Supabase URL and Anon Key (request these from the lead maintainer).
4. Run `pnpm dev` to start the development server.
