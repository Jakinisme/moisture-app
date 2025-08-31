import { useEffect, useRef, useState, useCallback } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

interface UseIntersectionObserverReturn<T extends Element = Element> {
  ref: React.RefObject<T | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * A reusable React hook for Intersection Observer API
 * @param options - Intersection Observer options
 * @param callback - Optional callback function when intersection changes
 * @returns Object containing ref, isIntersecting state, and current entry
 */
export const useIntersectionObserver = <T extends Element = Element>(
  options: IntersectionObserverOptions = {},
  callback?: (entry: IntersectionObserverEntry) => void
): UseIntersectionObserverReturn<T> => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
      
      if (callback) {
        callback(entry);
      }
    },
    [callback]
  );

  useEffect(() => {
    const element = ref.current;
    
    if (!element) return;

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: options.threshold ?? 0,
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? '0px',
    });

    // Start observing
    observerRef.current.observe(element);

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options.threshold, options.root, options.rootMargin, handleIntersection]);

  return {
    ref,
    isIntersecting,
    entry,
  };
};

/**
 * A simplified version that only returns intersection state
 * @param options - Intersection Observer options
 * @returns Boolean indicating if element is intersecting
 */
export const useIntersection = (
  options: IntersectionObserverOptions = {}
): [React.RefObject<Element | null>, boolean] => {
  const { ref, isIntersecting } = useIntersectionObserver(options);
  return [ref, isIntersecting];
};

/**
 * Hook that triggers a callback when element enters viewport
 * @param options - Intersection Observer options
 * @param onEnter - Callback when element enters viewport
 * @param onLeave - Optional callback when element leaves viewport
 * @returns Ref to attach to element
 */
export const useIntersectionCallback = (
  options: IntersectionObserverOptions = {},
  onEnter: () => void,
  onLeave?: () => void
): React.RefObject<Element | null> => {
  const { ref } = useIntersectionObserver(options, (entry) => {
    if (entry.isIntersecting) {
      onEnter();
    } else if (onLeave) {
      onLeave();
    }
  });

  return ref;
};

export default useIntersectionObserver;
