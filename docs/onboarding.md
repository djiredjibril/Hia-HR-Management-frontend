# Onboarding

## Flow

- `src/app/_layout.tsx` loads fonts and the persisted `onboarding:hasSeen` flag before hiding the splash screen (no flash of the wrong screen).
- `src/app/index.tsx` reads `getHasSeenOnboarding()` (from `src/lib/onboarding.ts`) and redirects to `/onboarding` when the flag isn't set.
- `src/app/onboarding.tsx` is a 3-step swipeable pager (`ScrollView` + `pagingEnabled`). "Skip" and the final "Next" both call `markOnboardingSeen()` (writes to AsyncStorage) before navigating to `/`.

To re-see onboarding during dev, clear the app's AsyncStorage/app data, or temporarily flip the condition in `index.tsx`.

## Adding/updating SVG illustrations

SVGs are compiled to `react-native-svg` components at bundle time via `react-native-svg-transformer` (configured in `metro.config.js`), so `.svg` files are imported like components:

```tsx
import Onboarding1 from '@/assets/svg/Onbording/onbording-1.svg';

<Onboarding1 width="100%" height="100%" />;
```

Drop new `.svg` files under `assets/svg/...` and import them the same way — no extra setup needed. Type support for `*.svg` imports is declared in `src/svg.d.ts`.
