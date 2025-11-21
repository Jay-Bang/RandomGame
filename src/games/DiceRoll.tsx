import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function DiceRoll() {
    const [rolling, setRolling] = useState(false);
    const [result, setResult] = useState(1);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const rollDice = () => {
        if (rolling) return;
        setRolling(true);

        // Random result 1-6
        const newResult = Math.floor(Math.random() * 6) + 1;

        // Add extra spins for effect
        const spins = 5;
        const baseRotation = 360 * spins;

        let targetX = baseRotation;
        let targetY = baseRotation;

        switch (newResult) {
            case 1: targetX += 0; targetY += 0; break;
            case 2: targetX += 0; targetY += -90; break;
            case 3: targetX += 0; targetY += -180; break;
            case 4: targetX += 0; targetY += 90; break;
            case 5: targetX += -90; targetY += 0; break;
            case 6: targetX += 90; targetY += 0; break;
        }

        // Add some random variation to the final rotation for a "messy" realistic stop
        // then correct it
        setRotation({ x: targetX, y: targetY });

        setTimeout(() => {
            setResult(newResult);
            setRolling(false);
        }, 2500);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-16">
            <div className="perspective-1000 w-40 h-40 relative group">
                {/* Glow effect */}
                <div className={cn(
                    "absolute inset-0 bg-indigo-500 blur-3xl opacity-0 transition-opacity duration-500 rounded-full",
                    rolling ? "opacity-40 animate-pulse" : "group-hover:opacity-20"
                )} />

                <motion.div
                    className="w-full h-full relative preserve-3d cursor-pointer"
                    animate={{ rotateX: rotation.x, rotateY: rotation.y }}
                    transition={{
                        duration: 2.5,
                        ease: [0.2, 0.8, 0.2, 1], // Custom bezier for realistic physics easing
                        type: "spring",
                        stiffness: 50,
                        damping: 20
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    onClick={rollDice}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {/* Face 1 (Front) */}
                    <DiceFace translateZ="translate-z-20" rotate="" dots={[4]} />

                    {/* Face 2 (Right) */}
                    <DiceFace translateZ="translate-z-20" rotate="rotate-y-90" dots={[2, 6]} />

                    {/* Face 3 (Back) */}
                    <DiceFace translateZ="translate-z-20" rotate="rotate-y-180" dots={[0, 4, 8]} />

                    {/* Face 4 (Left) */}
                    <DiceFace translateZ="translate-z-20" rotate="-rotate-y-90" dots={[0, 2, 6, 8]} />

                    {/* Face 5 (Top) */}
                    <DiceFace translateZ="translate-z-20" rotate="rotate-x-90" dots={[0, 2, 4, 6, 8]} />

                    {/* Face 6 (Bottom) */}
                    <DiceFace translateZ="translate-z-20" rotate="-rotate-x-90" dots={[0, 2, 3, 5, 6, 8]} />
                </motion.div>
            </div>

            <motion.button
                onClick={rollDice}
                disabled={rolling}
                whileHover={{ scale: rolling ? 1 : 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)" }}
                whileTap={{ scale: rolling ? 1 : 0.95 }}
                className={cn(
                    "px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/50 transition-all",
                    rolling && "opacity-50 cursor-not-allowed"
                )}
            >
                {rolling ? "Rolling..." : "Roll Dice"}
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: rolling ? 0 : 1,
                    y: rolling ? 4 : 0,
                    scale: rolling ? 0.9 : 1
                }}
                transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
                className="text-4xl font-bold text-white"
            >
                Result: <span className="text-indigo-400">{result}</span>
            </motion.div>
        </div>
    );
}

function DiceFace({ translateZ, rotate, dots }: { translateZ: string, rotate: string, dots: number[] }) {
    return (
        <div className={cn(
            "absolute w-full h-full bg-gradient-to-br from-white to-gray-200 rounded-2xl border border-gray-300 flex items-center justify-center backface-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]",
            translateZ,
            rotate
        )}>
            <div className="grid grid-cols-3 grid-rows-3 gap-2 w-24 h-24 p-2">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="flex items-center justify-center">
                        {dots.includes(i) && (
                            <div className="w-5 h-5 bg-black rounded-full shadow-inner bg-gradient-to-br from-gray-800 to-black" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

