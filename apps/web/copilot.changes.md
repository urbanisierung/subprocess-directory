# Changes Made

## Fix: Add missing tslib dependency

- Added `tslib` as a dependency in [apps/web/package.json](package.json)
- Reasoning: The build was failing because `react-remove-scroll` (a transitive dependency of `cmdk` used for the CommandPalette component) requires `tslib` but it wasn't being resolved by Vite/Rollup during the build process
- This is a common issue with pnpm's strict dependency resolution - transitive dependencies that aren't properly declared need to be explicitly added
