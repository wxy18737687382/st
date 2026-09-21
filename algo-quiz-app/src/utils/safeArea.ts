/**
 * Utility to calculate and inject safe-area insets (--sat, --sab) for mobile status bars and notches.
 * Fixes Android Capacitor WebView status bar overlap (clock, camera hole, battery).
 */
export function initSafeArea(): void {
  const updateInsets = () => {
    // Measure browser-reported env(safe-area-inset-*)
    const testDiv = document.createElement('div');
    testDiv.style.position = 'fixed';
    testDiv.style.top = '0';
    testDiv.style.left = '0';
    testDiv.style.width = '0';
    testDiv.style.height = '0';
    testDiv.style.paddingTop = 'env(safe-area-inset-top, 0px)';
    testDiv.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
    testDiv.style.visibility = 'hidden';
    testDiv.style.pointerEvents = 'none';
    document.body.appendChild(testDiv);

    const computed = window.getComputedStyle(testDiv);
    let topInset = parseInt(computed.paddingTop, 10) || 0;
    let bottomInset = parseInt(computed.paddingBottom, 10) || 0;
    document.body.removeChild(testDiv);

    const isAndroid = /android/i.test(navigator.userAgent);
    const isCapacitor = !!(window as any).Capacitor;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    // In Android Capacitor APK or fullscreen PWA, if Chromium WebView reports 0 due to the edge-to-edge bug:
    // Fall back to standard Android status bar height (36px) to prevent clock/battery overlap.
    if ((isCapacitor || (isAndroid && isStandalone)) && topInset === 0) {
      topInset = 36;
    }

    // Set CSS custom property on :root
    document.documentElement.style.setProperty('--sat', `${topInset}px`);
    document.documentElement.style.setProperty('--sab', `${bottomInset}px`);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateInsets);
  } else {
    updateInsets();
  }

  window.addEventListener('resize', updateInsets);
  window.addEventListener('orientationchange', updateInsets);
}
