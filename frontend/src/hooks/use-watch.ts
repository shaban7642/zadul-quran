import { useEffect, useRef } from 'react';

// Watch deps if only deps had changes, and skip the first time
export default function useWatch(callback: () => void, deps: React.DependencyList): void {
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        callback();
    }, deps);
}
