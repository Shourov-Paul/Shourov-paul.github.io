'use client';

import { useScrollProgress } from '@/hooks/useScrollProgress';

const ScrollProgress = () => {
    const completion = useScrollProgress();

    return (
        <span
            style={{ transform: `translateX(${completion - 100}%)` }}
            className="absolute bottom-0 left-0 z-50 h-[2px] w-full bg-[#18f2e5] transition-transform duration-100 ease-out"
        />
    );
};

export default ScrollProgress;
