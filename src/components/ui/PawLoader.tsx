interface PawLoaderProps {
  isLoading?: boolean;
  isInitialLoad?: boolean;
}

// Kept for legacy imports. Pages no longer wait behind a decorative loader.
export const PawLoader = (_props: PawLoaderProps) => null;
