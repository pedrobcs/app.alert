// Haptic Feedback Simulation for Web
// Provides tactile feedback similar to iOS using vibration API and visual cues

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

class HapticsManager {
  private isSupported: boolean;

  constructor() {
    this.isSupported = 'vibrate' in navigator;
  }

  /**
   * Trigger haptic feedback with optional visual cue
   */
  trigger(style: HapticStyle = 'light', element?: HTMLElement) {
    // Trigger vibration if supported
    if (this.isSupported) {
      this.vibrate(style);
    }

    // Add visual feedback
    if (element) {
      this.addVisualFeedback(element, style);
    }
  }

  /**
   * Vibrate based on haptic style
   */
  private vibrate(style: HapticStyle) {
    const patterns: Record<HapticStyle, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [30, 100, 30, 100, 30],
    };

    const pattern = patterns[style];
    
    if (typeof pattern === 'number') {
      navigator.vibrate(pattern);
    } else {
      navigator.vibrate(pattern);
    }
  }

  /**
   * Add visual feedback animation
   */
  private addVisualFeedback(element: HTMLElement, style: HapticStyle) {
    // Remove any existing animation
    element.classList.remove('haptic-feedback');
    
    // Force reflow to restart animation
    void element.offsetWidth;
    
    // Add haptic class
    element.classList.add('haptic-feedback');
    
    // Add style-specific class
    element.classList.add(`haptic-${style}`);
    
    // Remove classes after animation
    setTimeout(() => {
      element.classList.remove('haptic-feedback', `haptic-${style}`);
    }, 200);
  }

  /**
   * Selection feedback (like selecting a button)
   */
  selection(element?: HTMLElement) {
    this.trigger('light', element);
  }

  /**
   * Impact feedback (like a collision)
   */
  impact(intensity: 'light' | 'medium' | 'heavy' = 'medium', element?: HTMLElement) {
    this.trigger(intensity, element);
  }

  /**
   * Notification feedback
   */
  notification(type: 'success' | 'warning' | 'error', element?: HTMLElement) {
    this.trigger(type, element);
  }

  /**
   * Check if haptics are supported
   */
  isHapticsSupported(): boolean {
    return this.isSupported;
  }
}

// Export singleton instance
export const haptics = new HapticsManager();

// React hook for haptic feedback
export function useHaptics() {
  return {
    trigger: (style: HapticStyle, element?: HTMLElement) => haptics.trigger(style, element),
    selection: (element?: HTMLElement) => haptics.selection(element),
    impact: (intensity: 'light' | 'medium' | 'heavy', element?: HTMLElement) => haptics.impact(intensity, element),
    notification: (type: 'success' | 'warning' | 'error', element?: HTMLElement) => haptics.notification(type, element),
    isSupported: haptics.isHapticsSupported(),
  };
}

// CSS classes for visual feedback (add to globals.css)
export const hapticStyles = `
  .haptic-feedback {
    animation: haptic-pulse 0.2s ease-in-out;
  }

  @keyframes haptic-pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.97);
    }
  }

  .haptic-light {
    animation: haptic-light 0.15s ease-in-out;
  }

  @keyframes haptic-light {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(0.99);
      opacity: 0.95;
    }
  }

  .haptic-medium {
    animation: haptic-medium 0.2s ease-in-out;
  }

  @keyframes haptic-medium {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(0.97);
      opacity: 0.9;
    }
  }

  .haptic-heavy {
    animation: haptic-heavy 0.25s ease-in-out;
  }

  @keyframes haptic-heavy {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(0.95);
      opacity: 0.85;
    }
  }

  .haptic-success {
    animation: haptic-success 0.4s ease-in-out;
  }

  @keyframes haptic-success {
    0%, 100% {
      transform: scale(1);
    }
    25% {
      transform: scale(0.98);
    }
    50% {
      transform: scale(1.02);
    }
    75% {
      transform: scale(0.98);
    }
  }

  .haptic-warning {
    animation: haptic-warning 0.5s ease-in-out;
  }

  @keyframes haptic-warning {
    0%, 100% {
      transform: translateX(0);
    }
    20%, 60% {
      transform: translateX(-4px);
    }
    40%, 80% {
      transform: translateX(4px);
    }
  }

  .haptic-error {
    animation: haptic-error 0.6s ease-in-out;
  }

  @keyframes haptic-error {
    0%, 100% {
      transform: translateX(0) rotate(0deg);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-5px) rotate(-1deg);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(5px) rotate(1deg);
    }
  }
`;
