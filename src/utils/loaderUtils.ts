/**
 * Utility functions for manually triggering the page loader
 * Useful for programmatic navigation or async operations
 */

export const triggerLoader = (duration = 1450): Promise<void> => {
  return new Promise((resolve) => {
    // Dispatch custom event to trigger loader
    window.dispatchEvent(new CustomEvent('triggerLoader', { detail: { duration } }));
    
    setTimeout(() => {
      resolve();
    }, duration);
  });
};

/**
 * Use this before programmatic navigation to show loader
 * Example:
 * await triggerLoader();
 * navigate('/some-page');
 */
export const loaderNavigate = async (
  navigateFn: (path: string) => void,
  path: string,
  duration = 1450
) => {
  await triggerLoader(duration);
  navigateFn(path);
};
