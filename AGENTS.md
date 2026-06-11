# AGENTS.md

## Dev Commands

- `npm run dev` - Start dev server on port 3000
- `npm run build` - Build for production (Vercel preset)
- `npm run test` - Run Vitest tests
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript check

## Project Structure

- Routes: `src/routes/` (file-based routing via TanStack Router)
- Calculators: `src/lib/calculators/`
- Components: `src/components/ui/` (shadcn components)
- Add shadcn components: `npx shadcn@latest add <component>`

## Testing

- Tests colocated in `__tests__` folders next to source files
- Run single test file: `npm run test -- <path>`

## Tech Stack

- TanStack Start + React 19 + TypeScript
- Tailwind v4 + shadcn/ui
- Nitro (Vercel preset)
- Vitest for testing
