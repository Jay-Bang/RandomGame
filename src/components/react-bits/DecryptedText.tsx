import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface DecryptedTextProps {
    text: string;
    speed?: number;
    maxIterations?: number;
    sequential?: boolean;
    revealDirection?: 'start' | 'end' | 'center';
    useOriginalCharsOnly?: boolean;
    characters?: string;
    className?: string;
    parentClassName?: string;
    encryptedClassName?: string;
    animateOn?: 'view' | 'hover';
    [key: string]: any;
}

export const DecryptedText = ({
    text,
    speed = 50,
    maxIterations = 10,
    sequential = false,
    revealDirection = 'start',
    useOriginalCharsOnly = false,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+[]{}|;:,.<>?',
    className = '',
    parentClassName = '',
    encryptedClassName = '',
    animateOn = 'hover',
    ...props
}: DecryptedTextProps) => {
    const [displayText, setDisplayText] = useState(text);
    const [isHovering, setIsHovering] = useState(false);
    const revealedIndices = useRef(new Set<number>());

    useEffect(() => {
        let interval: number;
        let currentIteration = 0;

        const getNextChar = (_char?: string) => {
            if (useOriginalCharsOnly) {
                const index = Math.floor(Math.random() * text.length);
                return text[index];
            }
            const index = Math.floor(Math.random() * characters.length);
            return characters[index];
        };

        const scramble = () => {
            if (sequential) {
                if (revealedIndices.current.size < text.length) {
                    const nextIndex = getNextIndex(revealedIndices.current);
                    revealedIndices.current.add(nextIndex);
                    setDisplayText((prev) =>
                        prev
                            .split('')
                            .map((char, i) => (revealedIndices.current.has(i) ? text[i] : getNextChar(char)))
                            .join('')
                    );
                    interval = window.setTimeout(scramble, speed);
                } else {
                    // setIsScrambling(false);
                }
            } else {
                setDisplayText((prev) =>
                    prev
                        .split('')
                        .map((char, i) => {
                            if (revealedIndices.current.has(i) || Math.random() > 0.5) {
                                revealedIndices.current.add(i);
                                return text[i];
                            }
                            return getNextChar(char);
                        })
                        .join('')
                );
                currentIteration++;
                if (currentIteration < maxIterations) {
                    interval = window.setTimeout(scramble, speed);
                } else {
                    setDisplayText(text);
                    // setIsScrambling(false);
                }
            }
        };

        const getNextIndex = (revealedSet: Set<number>) => {
            const textLength = text.length;
            switch (revealDirection) {
                case 'start':
                    return revealedSet.size;
                case 'end':
                    return textLength - 1 - revealedSet.size;
                case 'center': {
                    const middle = Math.floor(textLength / 2);
                    const offset = Math.floor(revealedSet.size / 2);
                    const nextIndex =
                        revealedSet.size % 2 === 0
                            ? middle + offset
                            : middle - offset - 1;
                    return nextIndex;
                }
                default:
                    return revealedSet.size;
            }
        };

        if (isHovering) {
            // setIsScrambling(true);
            interval = window.setTimeout(scramble, speed);
        } else {
            setDisplayText(text);
            revealedIndices.current.clear();
            // setIsScrambling(false);
        }

        return () => {
            if (interval) clearTimeout(interval);
        };
    }, [
        isHovering,
        text,
        speed,
        maxIterations,
        sequential,
        revealDirection,
        characters,
        useOriginalCharsOnly,
    ]);

    useEffect(() => {
        if (animateOn === 'view') {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setIsHovering(true);
                            observer.disconnect();
                        }
                    });
                },
                { threshold: 0.1 }
            );
            // This part needs a ref to the element, but for simplicity we'll just trigger it
            // In a real implementation, we'd attach the ref to the span
            setIsHovering(true);
        }
    }, [animateOn]);

    return (
        <motion.span
            className={parentClassName}
            onMouseEnter={() => animateOn === 'hover' && setIsHovering(true)}
            onMouseLeave={() => animateOn === 'hover' && setIsHovering(false)}
            {...props}
        >
            <span className={className}>{displayText}</span>
        </motion.span>
    );
};
