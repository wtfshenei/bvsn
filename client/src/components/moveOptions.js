export default function MoveOptions({ playerPosition, setPlayerPosition, gridSize }) {
    // Fonction pour vérifier si une case est dans les limites de la grille
    const isValidPosition = (x, y) => {
        return x >= 0 && y >= 0 && x < gridSize && y < gridSize;
    };

    // Générer les options de déplacement (haut, bas, gauche, droite)
    const moveOptions = [
        { label: "Up", x: playerPosition.x, y: playerPosition.y - 1 },
        { label: "Down", x: playerPosition.x, y: playerPosition.y + 1 },
        { label: "Left", x: playerPosition.x - 1, y: playerPosition.y },
        { label: "Right", x: playerPosition.x + 1, y: playerPosition.y },
    ];

    // Afficher les boutons pour chaque option valide
    return (
        <div className="absolute top-0 left-0 mt-4 flex flex-col space-y-2">
            {moveOptions.map((option) =>
                isValidPosition(option.x, option.y) ? (
                    <button
                        key={option.label}
                        onClick={() => setPlayerPosition({ x: option.x, y: option.y })}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Move {option.label}
                    </button>
                ) : null
            )}
        </div>
    );
}