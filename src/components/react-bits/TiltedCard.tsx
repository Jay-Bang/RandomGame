import { useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface TiltedCardProps {
    children: React.ReactNode;
    containerHeight?: string | number;
    containerWidth?: string | number;
    imageHeight?: string | number;
    imageWidth?: string | number;
    scaleOnHover?: number;
    rotateAmplitude?: number;
    showMobileWarning?: boolean;
    showTooltip?: boolean;
    overlayContent?: React.ReactNode;
    displayOverlayContent?: boolean;
}

export const TiltedCard = ({
    children,
    containerHeight = '300px',
    containerWidth = '100%',
    // imageHeight = '300px',
    // imageWidth = '300px',
    scaleOnHover = 1.1,
    rotateAmplitude = 14,
    // showMobileWarning = true,
    // showTooltip = true,
    // overlayContent = null,
    // displayOverlayContent = false,
}: TiltedCardProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [rotateAmplitude, -rotateAmplitude]);
    const rotateY = useTransform(x, [-100, 100], [-rotateAmplitude, rotateAmplitude]);

    const springConfig = { damping: 30, stiffness: 400, mass: 1 }; // Smoother spring
    const rotateXSpring = useSpring(rotateX, springConfig);
    const rotateYSpring = useSpring(rotateY, springConfig);
    const scale = useSpring(1, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct * 200); // Map to -100 to 100 range
        y.set(yPct * 200);
    };

    const handleMouseEnter = () => {
        scale.set(scaleOnHover);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        scale.set(1);
    };

    return (
        <motion.div
            ref={ref}
            style={{
                height: containerHeight,
                width: containerWidth,
                perspective: '1000px',
            }}
            className="relative flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    rotateX: rotateXSpring,
                    rotateY: rotateYSpring,
                    scale: scale,
                    transformStyle: 'preserve-3d',
                }}
                className="relative w-full h-full"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};
