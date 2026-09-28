import { Application, Container, Sprite, Assets, Texture } from 'pixi.js';

export default async function createBoard(container: HTMLElement): Promise<Application> {
    const app = new Application();
    await app.init( {backgroundColor: 0x1099bb, resizeTo: window});
    container.appendChild(app.canvas);
    
    // Load assets
    await Assets.init({basePath: 'Assets/Sprites/'})
    await Assets.load([
        {alias: 'bg', src: 'slots_background.png'},
        {alias: 'test', src: 'pirots_logo_650.png'},
        {alias: 'tile_mid', src: 'slots_tile.png'},
        {alias: 'tile_corner', src: 'slots_tile_corner.png'},
        {alias: 'tile_straight', src: 'slots_tile_straight.png'},
        {alias: 'spin_button', src: 'slots_spin_button.png'},
    ]);

    // Create background
    const background = Sprite.from('bg');
    background.setSize(app.screen.width, app.screen.height)
    app.stage.addChild(background);

    // Create tiles 
    // TODO: Needs rotated textures
    const tiles = new Container();
    const tileSize = 90;
    const gridSize = 8;

    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            var texture = Texture.EMPTY;

            if (i != 0 && i != gridSize - 1 &&                  // If middle tile
                j != 0 && j != gridSize - 1) {
                texture = Texture.from('tile_mid');
            } else if (i == 0 && j == 0) {                      // If top left corner
                texture = Texture.from('tile_corner');
            } else if (i == gridSize - 1 && j == 0) {           // If top right corner
                texture = Texture.from('tile_corner');
            } else if (i == 0 && j == gridSize - 1) {           // If buttom left corner
                texture = Texture.from('tile_corner');
            } else if (i == gridSize - 1 && j == gridSize - 1) {// If buttom right corner
                texture = Texture.from('tile_corner');
            } else if (i == 0 || i == gridSize - 1) {           // If left or right side
                texture = Texture.from('tile_straight');
            } else if (j == 0 || j == gridSize - 1) {           // If top or buttom
                texture = Texture.from('tile_straight');
            }

            const tile = Sprite.from(texture);
            tile.position.set(tileSize * i, tileSize * j);
            tile.setSize(tileSize);
            tiles.addChild(tile);
        }
    }

    // Center tiles
    tiles.position.set(
        background.width / 2 - tiles.width / 2,
        background.height / 2 - tiles.height / 2
    );
    
    app.stage.addChild(tiles);

    // Create spin button
    const spinButton = Sprite.from('spin_button');
    spinButton.anchor.set(0.5);

    const tilesEndX = tiles.x + tiles.width;
    spinButton.position.set(
        tilesEndX + (background.width - tilesEndX) / 2,
        background.height / 2
    );

    spinButton.eventMode = 'static';
    spinButton.cursor = 'pointer';
    spinButton.on('pointerdown', () => {
        //jackpotSound.play();
        //spin();
    });

    app.stage.addChild(spinButton);

    return app;
}
