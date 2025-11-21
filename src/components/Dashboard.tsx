import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiceRoll } from "../games/DiceRoll";
import { CoinFlip } from "../games/CoinFlip";
import { ScratchCard } from "../games/ScratchCard";
import { Roulette } from "../games/Roulette";
import { Squares } from "./react-bits/Squares";
import { DecryptedText } from "./react-bits/DecryptedText";
import { TiltedCard } from "./react-bits/TiltedCard";
import { ArrowLeft, Dices, Coins, Ticket, CircleDashed } from "lucide-react";
import { cn } from "../lib/utils";

type GameType = "DICE" | "COIN" | "SCRATCH" | "ROULETTE" | null;

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3 }
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 50,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2 }
    }
};

const gameViewVariants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 20
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: -20,
        transition: { duration: 0.3 }
    }
};

export function Dashboard() {
    const [activeGame, setActiveGame] = useState<GameType>(null);

    const games = [
        {
            id: "DICE",
            name: "Dice Roll",
            icon: <Dices className="w-12 h-12 text-indigo-400" />,
            desc: "Roll the dice and test your luck!",
            color: "from-indigo-500/20 to-purple-500/20",
            border: "border-indigo-500/30"
        },
        {
            id: "COIN",
            name: "Coin Flip",
            icon: <Coins className="w-12 h-12 text-yellow-400" />,
            desc: "Heads or Tails? Make your choice.",
            color: "from-yellow-500/20 to-orange-500/20",
            border: "border-yellow-500/30"
        },
        {
            id: "SCRATCH",
            name: "Speeto 2000",
            icon: <Ticket className="w-12 h-12 text-green-400" />,
            desc: "Scratch to reveal your lucky numbers!",
            color: "from-green-500/20 to-emerald-500/20",
            border: "border-green-500/30"
        },
        {
            id: "ROULETTE",
            name: "Roulette",
            icon: <CircleDashed className="w-12 h-12 text-red-400" />,
            desc: "Spin the wheel and win big!",
            color: "from-red-500/20 to-rose-500/20",
            border: "border-red-500/30"
        },
    ];

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-white relative overflow-hidden font-sans selection:bg-white/20">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Squares
                    direction="diagonal"
                    speed={0.5}
                    borderColor="#333"
                    hoverFillColor="#222"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col min-h-screen">

                {/* Header */}
                <header className="flex items-center justify-center mb-8 md:mb-16 relative flex-shrink-0">
                    <AnimatePresence mode="wait">
                        {activeGame && (
                            <motion.button
                                key="back-button"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setActiveGame(null)}
                                className="absolute left-0 p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all border border-white/10 group"
                            >
                                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <div className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-2xl">
                        <DecryptedText
                            text={activeGame ? games.find(g => g.id === activeGame)?.name || "Game" : "Random Games"}
                            animateOn="view"
                            revealDirection="center"
                            speed={100}
                            maxIterations={20}
                            characters="ABCD1234!@#$"
                            className="revealed"
                            encryptedClassName="encrypted"
                        />
                    </div>
                </header>

                {/* Main View */}
                <main className="flex-1 flex items-center justify-center overflow-y-auto pb-8">
                    <AnimatePresence mode="wait">
                        {!activeGame ? (
                            <motion.div
                                key="game-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl"
                            >
                                {games.map((game, index) => (
                                    <motion.div
                                        key={game.id}
                                        variants={cardVariants}
                                        custom={index}
                                        whileHover={{ y: -10 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveGame(game.id as GameType)}
                                        className="cursor-pointer"
                                    >
                                        <TiltedCard
                                            containerHeight="320px"
                                            containerWidth="100%"
                                            imageHeight="320px"
                                            imageWidth="100%"
                                            rotateAmplitude={12}
                                            scaleOnHover={1.05}
                                            showMobileWarning={false}
                                            showTooltip={false}
                                            displayOverlayContent={true}
                                        >
                                            <div className={cn(
                                                "w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br backdrop-blur-md border rounded-3xl transition-all duration-500 group relative overflow-hidden",
                                                game.color,
                                                game.border
                                            )}>
                                                {/* Animated glow effect */}
                                                <motion.div
                                                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                                                    animate={{
                                                        background: [
                                                            "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                                                            "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                                                            "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)"
                                                        ]
                                                    }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                />

                                                <motion.div
                                                    className="mb-6 transform drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    {game.icon}
                                                </motion.div>
                                                <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-yellow-300 transition-colors">{game.name}</h3>
                                                <p className="text-white/60 font-medium leading-relaxed">{game.desc}</p>
                                            </div>
                                        </TiltedCard>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="game-view"
                                variants={gameViewVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="w-full max-w-5xl h-[600px] bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                {activeGame === "DICE" && <DiceRoll />}
                                {activeGame === "COIN" && <CoinFlip />}
                                {activeGame === "SCRATCH" && <ScratchCard />}
                                {activeGame === "ROULETTE" && <Roulette />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 md:mt-12 text-center text-white/30 text-sm font-medium tracking-widest uppercase flex-shrink-0"
                >
                    © 2025 Random Games Inc.
                </motion.footer>
            </div>
        </div>
    );


}
