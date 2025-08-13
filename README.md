# Demo App

A clean, minimal Next.js demo application with Tailwind CSS and React Query.

## Features

- **Next.js 15** with App Router
- **Tailwind CSS v4** for styling
- **React Query** for data fetching and state management
- **TypeScript** support
- **Clean, minimal structure** ready for your custom development

## Getting Started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Run the development server:

   ```bash
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run linting and type checking

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Tailwind CSS imports
│   ├── layout.tsx       # Root layout with providers
│   ├── page.tsx         # Home page with React Query demo
│   └── providers.tsx    # React Query provider setup
```

## What's Included

- Basic Next.js app structure
- Tailwind CSS configuration
- React Query setup with a simple demo query
- Clean, responsive layout
- TypeScript configuration
- ESLint setup

## Start Building

This app is intentionally minimal to give you a clean foundation. You can:

1. Add new pages in the `src/app` directory
2. Create components in a new `src/components` directory
3. Add API routes in `src/app/api`
4. Extend the React Query setup for your data needs
5. Customize the Tailwind design system

The React Query demo on the home page shows how to use queries and handle loading/error states.

## Images

Illustration by <a href="https://unsplash.com/@milaoktasafitri?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Mila Okta Safitri</a> on <a href="https://unsplash.com/illustrations/a-person-runs-under-the-night-sky-CwLApSd7MYI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

Illustration by <a href="https://unsplash.com/@roundicons?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Round Icons</a> on <a href="https://unsplash.com/illustrations/a-blue-medal-with-a-red-star-on-it-VMCGJo0iyMw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
