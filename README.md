# NewGlobe Frontend Assignment

## Technologies Used

### Frontend Framework
- Vue.js 3 with Composition API
- TypeScript for type safety

### State Management
- Pinia for centralized state management
- Reactive stores with actions and getters

### Routing
- Vue Router for navigation
- Dynamic route parameters for school views

### UI Components
- Tailwind CSS for styling
- Chart.js and vue-chartjs for battery level visualization
- Custom components for battery indicators and status displays

### Date Handling
- date-fns for consistent date formatting and calculations

### Testing
- Vitest for unit testing
- @vue/test-utils for component testing
- Coverage reporting with @vitest/coverage-v8


## Key Features

### Dashboard View
- School overview with priority indicators
- Real-time battery health statistics
- Search functionality for schools

### School Detail View
- Device-level battery information
- Historical battery data visualization
- Status filtering options

### Battery Health Analysis
- Consumption rate calculation
- Health status determination
- Replacement recommendations


## Testing Strategy

### Unit Tests
- Battery calculation utilities
- Component props and rendering
- Store actions and getters

### Component Tests
- Rendering logic
- User interactions
- Props validation
- Event emissions


## Initial Error Fixes

### Type Declarations (`src/types/vue.d.ts`)
- Added TypeScript declaration file for Vue components
- Resolves TypeScript errors when importing `.vue` files
- Provides proper type definitions for Vue components

### Load env from vite (`vite.config.ts`)
- Import the "loadEnv" method from vite to properly load the env.
- Resolves the undefined from process.env.VITE_APP_BASE_PATH used in createWebHistory and in env.ts config when validating with zod.
- Prefixed APP_BASE_PATH with VITE_, Only variables prefixed with VITE_ are exposed to your Vue application. (This resolves zod error when executing preview command) APP_BASE_PATH -> VITE_APP_BASE_PATH

### Incorrect Json format (`data/battery.json`)
- A json object should be an object with key-value pairs but rather it's an object of objects.
- Added a key "data" which is an an array "[]" of objects resolves the error.

## Setup
1. Create a `.env` file in the project root with:
```
VITE_APP_BASE_PATH=/
```

2. Install dependencies
```bash
pnpm install
```

3. Start development server:
```bash
pnpm dev
```

### NOTE::
- When running 
```bash
pnpm preview
```
...preview serves the optimized, minified, and bundled production assets from the dist directory after running a build command
```bash
pnpm build
```

...the request to fetch data from battery.json is implemented using an absolute path ("/src/data/battery.json") and after minification or running a build, the path won't exist as it is minified so a preview won't return data. But it builds successfully "Haha".


# Field Support for Batteries

## Instructions

Fork this repository.

The exercise requirements and test cases are provided in the Word document you received.

Use the provided data file at data/battery.json as your data source.

## Good luck!

