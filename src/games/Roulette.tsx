import { useState } from "react";
import { motion, useAnimate } from "framer-motion";
import { cn } from "../lib/utils";

export function Roulette() {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [bet, setBet] = useState<"RED" | "BLACK" | null>(null);
    const [balance, setBalance] = useState(1000);
    const [scope, animate] = useAnimate();

    // European Roulette: 0-36
    // Red numbers: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

    const spinWheel = async () => {
        if (spinning || !bet) return;
        setSpinning(true);
        setResult(null);
        setBalance(prev => prev - 100); // Cost to play

        const newResult = Math.floor(Math.random() * 37); // 0-36

        // Calculate rotation
        // Each number is approx 9.73 degrees (360 / 37)

        // We need to find where the number is on the wheel. 
        // For simplicity in this 3D CSS representation, let's assume a standard order is too complex to map perfectly 
        // without a texture, so we'll just rotate to a random large angle + the specific angle for the number.
        // Let's just simulate the spin visually and show the result.

        const spins = 5;
        const randomOffset = Math.random() * 360;
        const totalRotation = 360 * spins + randomOffset;

        await animate(scope.current, { rotateZ: totalRotation }, { duration: 4, ease: [0.2, 0.8, 0.2, 1] });

        setResult(newResult);
        setSpinning(false);

        const isRed = redNumbers.includes(newResult);
        const isBlack = !isRed && newResult !== 0;

        if ((bet === "RED" && isRed) || (bet === "BLACK" && isBlack)) {
            setBalance(prev => prev + 200);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="relative perspective-1000">
                {/* Wheel Container */}
                <div className="relative w-80 h-80 rounded-full bg-gray-900 border-8 border-yellow-600 shadow-2xl flex items-center justify-center transform-style-3d rotate-x-60">
                    {/* Outer Rim */}
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-yellow-400/50 animate-spin-slow" />

                    {/* Spinning Inner Wheel */}
                    <motion.div
                        ref={scope}
                        className="w-full h-full rounded-full relative"
                        style={{ background: "conic-gradient(from 0deg, #ef4444 0deg 9.7deg, #000000 9.7deg 19.4deg, #ef4444 19.4deg 29.1deg, #000000 29.1deg 38.8deg, #ef4444 38.8deg 48.5deg, #000000 48.5deg 58.2deg, #ef4444 58.2deg 67.9deg, #000000 67.9deg 77.6deg, #ef4444 77.6deg 87.3deg, #000000 87.3deg 97deg, #ef4444 97deg 106.7deg, #000000 106.7deg 116.4deg, #ef4444 116.4deg 126.1deg, #000000 126.1deg 135.8deg, #ef4444 135.8deg 145.5deg, #000000 145.5deg 155.2deg, #ef4444 155.2deg 164.9deg, #000000 164.9deg 174.6deg, #ef4444 174.6deg 184.3deg, #22c55e 184.3deg 194deg, #000000 194deg 203.7deg, #ef4444 203.7deg 213.4deg, #000000 213.4deg 223.1deg, #ef4444 223.1deg 232.8deg, #000000 232.8deg 242.5deg, #ef4444 242.5deg 252.2deg, #000000 252.2deg 261.9deg, #ef4444 261.9deg 271.6deg, #000000 271.6deg 281.3deg, #ef4444 281.3deg 291deg, #000000 291deg 300.7deg, #ef4444 300.7deg 310.4deg, #000000 310.4deg 320.1deg, #ef4444 320.1deg 329.8deg, #000000 329.8deg 339.5deg, #ef4444 339.5deg 349.2deg, #000000 349.2deg 360deg)" }}
                    >
                        {/* Center Hub */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-700 rounded-full shadow-lg flex items-center justify-center z-10">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                                <span className="text-yellow-500 font-bold">CASINO</span>
                            </div>
                        </div>

                        {/* Ball (Simplified representation) */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md" />
                    </motion.div>

                    {/* Pointer */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-yellow-500 z-20 drop-shadow-lg" />
                </div>
            </div>

            {/* Betting Controls */}
            <div className="flex flex-col gap-4 items-center w-full max-w-md bg-black/40 p-6 rounded-2xl backdrop-blur-md border border-white/10">
                <div className="flex justify-between w-full text-white font-bold text-lg">
                    <span>Balance: <span className="text-yellow-400">${balance}</span></span>
                    <span>Bet: $100</span>
                </div>

                <div className="flex gap-4 w-full">
                    <button
                        onClick={() => setBet("RED")}
                        className={cn(
                            "flex-1 py-4 rounded-xl font-black text-xl transition-all transform hover:scale-105 active:scale-95 border-2",
                            bet === "RED" ? "bg-red-600 border-white shadow-[0_0_20px_rgba(220,38,38,0.6)]" : "bg-red-900/50 border-red-800 text-red-200 hover:bg-red-800"
                        )}
                    >
                        RED
                    </button>
                    <button
                        onClick={() => setBet("BLACK")}
                        className={cn(
                            "flex-1 py-4 rounded-xl font-black text-xl transition-all transform hover:scale-105 active:scale-95 border-2",
                            bet === "BLACK" ? "bg-gray-900 border-white shadow-[0_0_20px_rgba(0,0,0,0.6)]" : "bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800"
                        )}
                    >
                        BLACK
                    </button>
                </div>

                <button
                    onClick={spinWheel}
                    disabled={spinning || !bet || balance < 100}
                    className={cn(
                        "w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black rounded-xl font-black text-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95",
                        (spinning || !bet || balance < 100) && "opacity-50 cursor-not-allowed grayscale"
                    )}
                >
                    {spinning ? "SPINNING..." : "SPIN!"}
                </button>

                {result !== null && (
                    <div className="mt-2 text-center">
                        <div className="text-sm text-gray-400 uppercase tracking-widest">Result</div>
                        <div className={cn(
                            "text-5xl font-black drop-shadow-lg",
                            result === 0 ? "text-green-500" : redNumbers.includes(result) ? "text-red-500" : "text-white"
                        )}>
                            {result}
                        </div>
                        <div className="text-xl font-bold text-white mt-1">
                            {result === 0 ? "ZERO" : redNumbers.includes(result) ? "RED" : "BLACK"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
