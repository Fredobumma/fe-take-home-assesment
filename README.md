# NewGlobe Frontend Assignment

## Initial Error Fixes

### Type Declarations (`src/types/vue.d.ts`)
- Added TypeScript declaration file for Vue components
- Resolves TypeScript errors when importing `.vue` files
- Provides proper type definitions for Vue components

### Load env from vite (`vite.config.ts`)
- Import the "loadEnv" method from vite to properly load the env.
- Resolves the process.env.APP_BASE_PATH used in createWebHistory and in env.ts config when validating with zod.

### Incorrect Json format (`data/battery.json`)
- A json object should be an object with key-value pairs but rather it's an object of objects.
- Added a key "data" which is an an array "[]" of objects resolves the error.

## Setup
1. Create a `.env` file in the project root with:
```
APP_BASE_PATH=/
```

2. Install dependencies
```bash
pnpm install
```

3. Start development server:
```bash
pnpm dev
```

# Field Support for Batteries

## Instructions

Fork this repository.

The exercise requirements and test cases are provided in the Word document you received.

Use the provided data file at data/battery.json as your data source.

## Good luck!

