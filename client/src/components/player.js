export default function Player({ name, position }) {
    return (
        <div className="h-20 w-20 bg-purple-500 text-white flex flex-col items-center justify-center relative">
            <p>{name}</p>
            <p className="text-xs mt-1">
                ({position.x}, {position.y})
            </p>
        </div>
    );
}