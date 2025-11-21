import { useRef, useEffect, useState } from "react";
import { cn } from "../lib/utils";
import confetti from "canvas-confetti";

interface GameItem {
    number: number;
    prize: string;
}

export function ScratchCard() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [luckyNumber, setLuckyNumber] = useState(0);
    const [myNumbers, setMyNumbers] = useState<GameItem[]>([]);
    const [totalWin, setTotalWin] = useState(0);
    // const [scratchedPercentage, setScratchedPercentage] = useState(0);

    const resetCard = () => {
        // 1. Generate Lucky Number (1-9)
        const lucky = Math.floor(Math.random() * 9) + 1;
        setLuckyNumber(lucky);

        // 2. Generate My Numbers (6 items)
        const items: GameItem[] = [];
        const prizes = ["$5", "$10", "$50", "$100", "$500", "$1000"];

        let winAmount = 0;

        for (let i = 0; i < 6; i++) {
            // 30% chance to match lucky number
            const isMatch = Math.random() < 0.3;
            const number = isMatch ? lucky : Math.floor(Math.random() * 9) + 1;
            // If it's not a match, ensure it's definitely not the lucky number
            const finalNumber = (!isMatch && number === lucky) ? (lucky === 9 ? 1 : lucky + 1) : number;

            const prizeStr = prizes[Math.floor(Math.random() * prizes.length)];
            items.push({ number: finalNumber, prize: prizeStr });

            if (finalNumber === lucky) {
                winAmount += parseInt(prizeStr.replace("$", ""));
            }
        }

        setMyNumbers(items);
        setTotalWin(winAmount);
        setIsRevealed(false);
        // setScratchedPercentage(0);

        // Reset Canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.globalCompositeOperation = "source-over";

                // Draw Silver Foil
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, "#C0C0C0");
                gradient.addColorStop(0.2, "#E0E0E0");
                gradient.addColorStop(0.4, "#A0A0A0");
                gradient.addColorStop(0.6, "#E0E0E0");
                gradient.addColorStop(0.8, "#C0C0C0");
                gradient.addColorStop(1, "#A0A0A0");

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Add pattern/texture
                ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                for (let i = 0; i < 50; i++) {
                    ctx.beginPath();
                    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 20, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Text overlay
                ctx.fillStyle = "#444";
                ctx.font = "bold 24px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("SCRATCH TO WIN!", canvas.width / 2, canvas.height / 2);

                // Speeto logo or decoration
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                ctx.lineWidth = 5;
                ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
            }
        }
    };

    useEffect(() => {
        resetCard();
    }, []);

    useEffect(() => {
        if (isRevealed && totalWin > 0) {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#FF0000', '#00FF00', '#0000FF']
            });
        }
    }, [isRevealed, totalWin]);

    const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = (e as React.MouseEvent).clientX - rect.left;
            y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Throttle percentage calculation
        if (Math.random() > 0.85) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparent = 0;
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) transparent++;
            }
            const pct = (transparent / (pixels.length / 4)) * 100;
            // setScratchedPercentage(pct);

            if (pct > 60 && !isRevealed) {
                setIsRevealed(true);
            }
        }
    };

    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isRevealed) return; // Stop tilting when revealing to focus on content
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateXValue = ((y - centerY) / centerY) * -10; // Max 10 deg
        const rotateYValue = ((x - centerX) / centerX) * 10;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8 perspective-1000">
            {/* Ticket Container with 3D Tilt */}
            <div
                className="relative w-[400px] transition-transform duration-100 ease-out preserve-3d"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transformStyle: "preserve-3d"
                }}
            >
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-red-600 flex flex-col transform-style-3d shadow-[0_20px_50px_rgba(0,0,0,0.3)]">

                    {/* Header */}
                    <div className="bg-red-600 p-2 text-center translate-z-10">
                        <h2 className="text-white font-black text-2xl tracking-widest italic drop-shadow-md">SPEETO 2000</h2>
                        <p className="text-red-100 text-xs font-bold">MATCH LUCKY NUMBER TO WIN</p>
                    </div>

                    {/* Game Area */}
                    <div className="relative h-[300px] bg-gradient-to-b from-red-50 to-white p-4 translate-z-5">

                        {/* Underlying Content (The Game) */}
                        <div className="absolute inset-0 p-4 flex flex-col gap-4">

                            {/* Lucky Number Section */}
                            <div className="flex flex-col items-center justify-center border-b-2 border-dashed border-red-200 pb-2">
                                <span className="text-xs font-bold text-red-500 uppercase mb-1">Lucky Number</span>
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center border-4 border-red-500 shadow-inner">
                                    <span className="text-4xl font-black text-red-600">{luckyNumber}</span>
                                </div>
                            </div>

                            {/* My Numbers Grid */}
                            <div className="grid grid-cols-3 gap-3 flex-1">
                                {myNumbers.map((item, i) => {
                                    const isMatch = item.number === luckyNumber;
                                    return (
                                        <div key={i} className={cn(
                                            "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-colors",
                                            isMatch && isRevealed ? "bg-yellow-100 border-yellow-400 animate-pulse" : "bg-gray-50 border-gray-200"
                                        )}>
                                            <span className={cn("text-2xl font-bold", isMatch ? "text-red-600" : "text-gray-700")}>
                                                {item.number}
                                            </span>
                                            <span className="text-xs font-bold text-gray-500">{item.prize}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Scratch Overlay */}
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={300} // Matches the container height
                            className={cn(
                                "absolute inset-0 cursor-pointer touch-none transition-opacity duration-700 translate-z-20",
                                isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
                            )}
                            onMouseMove={(e) => { if (e.buttons === 1) handleScratch(e); }}
                            onTouchMove={handleScratch}
                        />
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-100 p-3 flex justify-between items-center border-t border-gray-200 translate-z-10">
                        <div className="text-xs text-gray-500 font-mono">NO. 1234-5678</div>
                        <div className="font-bold text-red-600">
                            {isRevealed && totalWin > 0 ? `WIN: $${totalWin}` : (isRevealed ? "TRY AGAIN" : "GOOD LUCK")}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={resetCard}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 hover:shadow-red-500/50"
                >
                    New Ticket
                </button>
            </div>
        </div>
    );
}
