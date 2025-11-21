import { useRef, useEffect, useState } from 'react';

interface SquaresProps {
    direction?: 'diagonal' | 'up' | 'down' | 'left' | 'right';
    speed?: number;
    borderColor?: string;
    squareSize?: number;
    hoverFillColor?: string;
}

export const Squares = ({
    direction = 'right',
    speed = 1,
    borderColor = '#333',
    squareSize = 40,
    hoverFillColor = '#222',
}: SquaresProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    const numSquaresX = useRef<number>(0);
    const numSquaresY = useRef<number>(0);
    const gridOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const [hoveredSquare, setHoveredSquare] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
            numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const drawGrid = () => {
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const startX = Math.floor(gridOffset.current.x / squareSize);
            const startY = Math.floor(gridOffset.current.y / squareSize);

            for (let x = startX; x < startX + numSquaresX.current; x++) {
                for (let y = startY; y < startY + numSquaresY.current; y++) {
                    const squareX = x * squareSize - gridOffset.current.x;
                    const squareY = y * squareSize - gridOffset.current.y;

                    if (
                        hoveredSquare &&
                        Math.floor((x * squareSize) / squareSize) === hoveredSquare.x &&
                        Math.floor((y * squareSize) / squareSize) === hoveredSquare.y
                    ) {
                        ctx.fillStyle = hoverFillColor;
                        ctx.fillRect(squareX, squareY, squareSize, squareSize);
                    }

                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(squareX, squareY, squareSize, squareSize);
                }
            }
        };

        const updateGrid = () => {
            const moveAmount = speed;

            switch (direction) {
                case 'right':
                    gridOffset.current.x = (gridOffset.current.x - moveAmount) % squareSize;
                    break;
                case 'left':
                    gridOffset.current.x = (gridOffset.current.x + moveAmount) % squareSize;
                    break;
                case 'up':
                    gridOffset.current.y = (gridOffset.current.y + moveAmount) % squareSize;
                    break;
                case 'down':
                    gridOffset.current.y = (gridOffset.current.y - moveAmount) % squareSize;
                    break;
                case 'diagonal':
                    gridOffset.current.x = (gridOffset.current.x - moveAmount) % squareSize;
                    gridOffset.current.y = (gridOffset.current.y - moveAmount) % squareSize;
                    break;
                default:
                    break;
            }

            drawGrid();
            requestRef.current = requestAnimationFrame(updateGrid);
        };

        requestRef.current = requestAnimationFrame(updateGrid);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(requestRef.current);
        };
    }, [direction, speed, borderColor, hoverFillColor, hoveredSquare, squareSize]);

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x) / squareSize);
        const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y) / squareSize);

        setHoveredSquare({ x: hoveredSquareX, y: hoveredSquareY });
    };

    const handleMouseLeave = () => {
        setHoveredSquare(null);
    };

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full border-none block"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        />
    );
};
