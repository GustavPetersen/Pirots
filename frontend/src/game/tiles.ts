import { Container, Sprite } from "pixi.js";

type TileStyle = {
    texture: string;
    rotation: number;
    anchor: [number, number];
};

// Corner rotations indexed by [isLastRow][isLastCol]
const CORNER_ROTATIONS = [
    [0, Math.PI / 2],
    [-Math.PI / 2, Math.PI],
];

function getTileStyle(row: number, col: number, last: number): TileStyle {
    const isEdgeRow = row === 0 || row === last;
    const isEdgeCol = col === 0 || col === last;

    if (isEdgeRow && isEdgeCol) {
        const r = Number(row === last);
        const c = Number(col === last);
        return { texture: "tile_corner", rotation: CORNER_ROTATIONS[r][c], anchor: [r, c] };
    }
    if (isEdgeRow) return { texture: "tile_straight", rotation: Math.PI / 2, anchor: [0, 1] };
    if (isEdgeCol) return { texture: "tile_straight", rotation: 0, anchor: [0, 0] };
    return { texture: "tile_mid", rotation: 0, anchor: [0, 0] };
}

export function createBoard(x: number, y: number, tileSize: number, gridSize: number): Container {
    const tiles = new Container({ label: "tiles" });
    const middleTiles = new Container({ label: "middleTiles" });
    const edgeTiles = new Container({ label: "edgeTiles" });
    const last = gridSize - 1;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const { texture, rotation, anchor } = getTileStyle(row, col, last);
            const isMiddle = texture === "tile_mid";

            const tile = new Container();
            tile.position.set(tileSize * col, tileSize * row);

            const tileBg = Sprite.from(texture);
            tileBg.label = "tile_bg";
            tileBg.anchor.set(...anchor);
            tileBg.rotation = rotation;
            tileBg.setSize(tileSize);
            tile.addChild(tileBg);

            if (isMiddle) {
                const tileFg = Sprite.from("empty");
                tileFg.label = "tile_fg";
                tileFg.anchor.set(0.5);
                tileFg.setSize(tileSize * 0.8);
                tileFg.position.set(tileSize / 2, tileSize / 2);
                tile.addChild(tileFg);
            }

            (isMiddle ? middleTiles : edgeTiles).addChild(tile);
        }
    }

    tiles.addChild(middleTiles, edgeTiles);
    tiles.pivot.set((gridSize * tileSize) / 2, (gridSize * tileSize) / 2);
    tiles.position.set(x, y);

    return tiles;
}
