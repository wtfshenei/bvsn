"use client";

import { useState, useEffect } from "react";
import Player from "@/components/Player";

const terrainColors = {
    water: "bg-blue-500",
    forest: "bg-green-500",
    sand: "bg-yellow-500",
    land: "bg-brown-500"
};

function GameMap() {
    const [grid, setGrid] = useState([]);
    const [player, setPlayer] = useState({ position: { x: 25, y: 25 }, name: "Player" });
    const [hoveredTile, setHoveredTile] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Fetch map and player data from backend
    useEffect(() => {
        const fetchMap = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/map");
                const data = await response.json();
                setGrid(data.tiles);
            } catch (error) {
                console.error("Failed to fetch map:", error);
            }
        };

        const fetchPlayer = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/player");
                const playerData = await response.json();
                setPlayer(playerData);
            } catch (error) {
                console.error("Failed to fetch player data:", error);
            }
        };

        fetchMap();
        fetchPlayer();
    }, []);

    const convertTo2DGrid = () => {
        const size = Math.sqrt(grid.length); // Assuming grid is square
        return Array.from({ length: size }, (_, y) =>
            grid.slice(y * size, (y + 1) * size)
        );
    };

    const grid2D = convertTo2DGrid();

    // Update player position in state and backend
    const handleMove = async (x, y) => {
        setPlayer((prev) => ({ ...prev, position: { x, y } }));
        try {
            await fetch("http://localhost:5000/api/player", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ x, y })
            });
        } catch (error) {
            console.error("Failed to update player position:", error);
        }
    };

    // Handle mouse hover to display tile type
    const handleMouseMove = (event, tile) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
        setHoveredTile(tile.type);
    };

    return (
        <div style={{ display: 'inline-block' }}>
            {grid2D.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((tile, cellIndex) => {
                        const isPlayerTile = player.position.x === tile.position.x && player.position.y === tile.position.y;
                        const isAdjacentTile =
                            Math.abs(tile.position.x - player.position.x) + Math.abs(tile.position.y - player.position.y) === 1;

                        return (
                            <div
                                key={`${rowIndex}-${cellIndex}`}
                                className={`h-10 w-10 ${terrainColors[tile.type] || "bg-gray-500"} relative flex items-center justify-center`}
                                onMouseMove={(event) => handleMouseMove(event, tile)}
                                onMouseLeave={() => setHoveredTile(null)}
                            >
                                {/* Display tile coordinates */}
                                <span className="absolute bottom-1 right-1 text-xs text-white">
                                    ({tile.position.x}, {tile.position.y})
                                </span>

                                {/* Place player if position matches */}
                                {isPlayerTile && <Player name={player.name} position={player.position} />}

                                {/* Move button on adjacent tiles */}
                                {isAdjacentTile && (
                                    <button
                                        onClick={() => handleMove(tile.position.x, tile.position.y)}
                                        className="absolute inset-0 text-white font-bold border-2 border-white rounded flex flex-col items-center justify-center"
                                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white" }}
                                    >
                                        <span>Move</span>
                                        <span className="text-xs font-normal mt-1">{tile.type}</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* Tooltip following the mouse */}
            {hoveredTile && (
                <div
                    className="fixed bg-black text-white text-sm p-1 rounded pointer-events-none"
                    style={{
                        top: mousePosition.y + 15,
                        left: mousePosition.x + 15,
                    }}
                >
                    {hoveredTile}
                </div>
            )}
        </div>
    );
}

export default GameMap;