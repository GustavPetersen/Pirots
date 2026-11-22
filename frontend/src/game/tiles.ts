import { Container, Sprite, Texture } from "pixi.js";

export function createTiles(x: number, y: number, tileSize: number, gridSize: number): Container {
    const tiles = new Container();
    const middleTiles = new Container();
    const edgeTiles = new Container();

    tiles.label = "tiles";
    middleTiles.label = "middleTiles";
    edgeTiles.label = "edgeTiles";

    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            var texture = Texture.EMPTY;
            var subContainer = edgeTiles;
            var rotation = 0;
            var anchorX = 0;
            var anchorY = 0;

            if (i != 0 && i != gridSize - 1 &&                  // If middle tile
                j != 0 && j != gridSize - 1) {
                texture = Texture.from("tile_mid");
                subContainer = middleTiles;
            } else if (i == 0 && j == 0) {                      // If top left corner
                texture = Texture.from("tile_corner");
            } else if (i == gridSize - 1 && j == 0) {           // If top right corner
                texture = Texture.from("tile_corner");
                rotation = - Math.PI / 2;
                anchorX = 1;
            } else if (i == 0 && j == gridSize - 1) {           // If bottom left corner
                texture = Texture.from("tile_corner");
                rotation = Math.PI / 2
                anchorY = 1;
            } else if (i == gridSize - 1 && j == gridSize - 1) {// If bottom right corner
                texture = Texture.from("tile_corner");
                rotation = Math.PI;
                anchorX = 1;
                anchorY = 1;
            } else if (i == 0 || i == gridSize - 1) {           // If left or right side
                texture = Texture.from("tile_straight");
                rotation = Math.PI / 2;
                anchorY = 1;
            } else if (j == 0 || j == gridSize - 1) {           // If top or buttom
                texture = Texture.from("tile_straight");
            }

            const tileBg = Sprite.from(texture);

            // Rotate corners
            if (rotation != 0) {
                tileBg.anchor.set(anchorX, anchorY);
                tileBg.rotation = rotation;
            }
            tileBg.setSize(tileSize);
            tileBg.label = "tile_bg";

            const tile = new Container();
            tile.position.set(tileSize * j, tileSize * i);
            tile.addChild(tileBg);
            subContainer.addChild(tile);
        }
    }

    tiles.addChild(middleTiles);
    tiles.addChild(edgeTiles);

    // Add placeholder foreground sprites for all middle tiles
    for (var i = 0; i < middleTiles.children.length; i++) {
        const tile = middleTiles.getChildAt<Container>(i);
        const tileFg = Sprite.from("empty");

        tileFg.label = "tile_fg";
        tileFg.setSize(tileSize * 0.8);
        tileFg.anchor.set(0.5);
        tileFg.position.set(
            tile.width / 2,
            tile.height / 2,
        );

        tile.addChild(tileFg);
    }

    tiles.pivot.set((gridSize * tileSize) / 2, (gridSize * tileSize) / 2)
    tiles.position.set(x, y);

    return tiles;
}