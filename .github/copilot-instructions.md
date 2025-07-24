This is a Next.js (React) project using TypeScript and Tailwind CSS. It is intended to be a scheduling application with features like categories, goals, groups, and chat. Please follow these guidelines when contributing:

## Code Standards

### Required Before Each Commit
- Run `npm run lint` before committing any changes to ensure proper code formatting and identify potential errors.

### Development Flow
- Development Server: `npm run dev`
- Build: `npm run build`
- Start Production Server: `npm start`

## Repository Structure
- `src/app/(app)`: Main application routes and pages.
- `src/app/(auth)`: Authentication-related pages (signin/signup).
- `src/app/api`: API routes for backend functionality.
- `src/components`: Reusable React components.
- `src/hooks`: Custom React hooks.
- `src/lib`: Helper functions, Firebase configuration, and utility code.
- `src/types`: TypeScript type definitions.
- `public/`: Static assets like images and icons.

## Key Guidelines
1.  Follow React best practices and idiomatic patterns.
2.  Use TypeScript for all new code.
3.  Utilize Tailwind CSS for styling, adhering to the existing design system in `tailwind.config.ts`.
4.  Write unit tests for new functionality where applicable.
5.  Component structure should be modular and reusable.
6.  For any new feature, please add a new file under the `src/app/(app)` directory.
7.  For any new API endpoint, please add a new file under the `src/app/api` directory.
8.  For any new reusable component, please add a new file under the `src/components` directory.
9.  For any new type, please add it to a relevant file in the `src/types` directory.
10. For any new hook, please add a new file under the `src/hooks` directory.
11. For any new helper function, please add it to a relevant file in the `src/lib` directory.