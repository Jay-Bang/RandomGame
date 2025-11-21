import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function CoinFlip() {
    const [flipping, setFlipping] = useState(false);
    const [result, setResult] = useState<"HEADS" | "TAILS">("HEADS");
    const [rotation, setRotation] = useState(0);

    const flipCoin = () => {
        if (flipping) return;
        setFlipping(true);

        const isHeads = Math.random() > 0.5;
        const newResult = isHeads ? "HEADS" : "TAILS";

        // Add extra spins
        const spins = 10;
        const baseRotation = 360 * spins;

        // Heads = 0 (or 360 multiple), Tails = 180
        // Add a little random overshoot for wobble effect
        const targetRotation = rotation + baseRotation + (isHeads ? 0 : 180);

        setRotation(targetRotation);

        setTimeout(() => {
            setResult(newResult);
            setFlipping(false);
        }, 3000);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-16">
            <div className="perspective-1000 w-48 h-48 relative group">
                {/* Glow effect */}
                <div className={cn(
                    "absolute inset-0 bg-yellow-500 blur-3xl opacity-0 transition-opacity duration-500 rounded-full",
                    flipping ? "opacity-30 animate-pulse" : "group-hover:opacity-10"
                )} />

                <motion.div
                    className="w-full h-full relative preserve-3d cursor-pointer"
                    animate={{ rotateY: rotation }}
                    transition={{
                        duration: 3,
                        ease: [0.4, 0.0, 0.2, 1],
                        type: "spring",
                        stiffness: 30,
                        damping: 15
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    onClick={flipCoin}
                    whileHover={{ scale: 1.1, rotateX: 10 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Front (Heads) */}
                    <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 border-[6px] border-yellow-600 flex items-center justify-center backface-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] z-20">
                        <div className="absolute inset-2 border-2 border-yellow-200/50 rounded-full border-dashed opacity-50" />
                        <span className="text-5xl font-black text-yellow-900 drop-shadow-md tracking-wider">HEADS</span>
                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    {/* Thickness Layer (Side) */}
                    {/* We simulate thickness by adding layers or a pseudo-element, but for CSS 3D, a simple way is multiple translated layers or a cylinder. 
              Here we'll use a simplified "edge" approach by adding a few layers slightly offset. */}
                    {[...Array(10)].map((_, i) => (
                        <div key={i}
                            className="absolute w-full h-full rounded-full bg-yellow-800 backface-hidden"
                            style={{ transform: `translateZ(-${i}px)` }}
                        />
                    ))}

                    {/* Back (Tails) */}
                    <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-[6px] border-gray-500 flex items-center justify-center rotate-y-180 backface-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] translate-z-[-10px] z-20">
                        <div className="absolute inset-2 border-2 border-gray-200/50 rounded-full border-dashed opacity-50" />
                        <span className="text-5xl font-black text-gray-800 drop-shadow-md tracking-wider">TAILS</span>
                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                </motion.div>
            </div>

            <button
                onClick={flipCoin}
                disabled={flipping}
                className={cn(
                    "px-10 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-full font-bold text-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 hover:shadow-yellow-500/50 border border-white/10",
                    flipping && "opacity-50 cursor-not-allowed"
                )}
            >
                {flipping ? "Flipping..." : "Flip Coin"}
            </button>

            <div className={cn(
                "text-4xl font-bold text-white transition-all duration-500",
                flipping ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}>
                Result: <span className="text-yellow-400">{result}</span>
            </div>
        </div>
    );
}
