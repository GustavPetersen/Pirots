import { QueryClient } from '@tanstack/react-query';
import { Application, Container, Sprite, Assets, Texture} from 'pixi.js';
import { Howl } from 'howler';
import { spin } from './evaluate';

export default async function createBoard(container: HTMLElement): Promise<Application> {
    const app = new Application();
    await app.init( {backgroundColor: 0x000000, resizeTo: window});
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
    const tiles = new Container();
    const middleTiles = new Container();
    const edgeTiles = new Container();

    const tileSize = 90;
    const gridSize = 8;

    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            var texture = Texture.EMPTY;
            var subContainer = edgeTiles;
            var rotation = 0;
            var anchorX = 0; 
            var anchorY = 0;

            if (i != 0 && i != gridSize - 1 &&                  // If middle tile
                j != 0 && j != gridSize - 1) {
                texture = Texture.from('tile_mid');
                subContainer = middleTiles;
            } else if (i == 0 && j == 0) {                      // If top left corner
                texture = Texture.from('tile_corner');
            } else if (i == gridSize - 1 && j == 0) {           // If top right corner
                texture = Texture.from('tile_corner');
                rotation = Math.PI / 2;
                anchorY = 1;
            } else if (i == 0 && j == gridSize - 1) {           // If bottom left corner
                texture = Texture.from('tile_corner');
                rotation = - Math.PI / 2
                anchorX = 1;
            } else if (i == gridSize - 1 && j == gridSize - 1) {// If bottom right corner
                texture = Texture.from('tile_corner');
                rotation = Math.PI;
                anchorX = 1;
                anchorY = 1;
            } else if (i == 0 || i == gridSize - 1) {           // If left or right side
                texture = Texture.from('tile_straight');
            } else if (j == 0 || j == gridSize - 1) {           // If top or buttom
                texture = Texture.from('tile_straight');
                rotation = Math.PI / 2;
                anchorY = 1;
            }

            const tileBg = Sprite.from(texture);
            // Rotate corners
            if (rotation != 0) {
                tileBg.anchor.set(anchorX, anchorY);
                tileBg.rotation = rotation;
            }
            tileBg.setSize(tileSize);
            tileBg.label = 'tile_bg';

            const tile = new Container();
            tile.position.set(tileSize * i, tileSize * j);
            tile.addChild(tileBg);
            subContainer.addChild(tile);
        }
    }

    tiles.addChild(middleTiles);
    tiles.addChild(edgeTiles);

    // Add placeholder foreground sprites for all middle tiles
    for (var i = 0; i < middleTiles.children.length; i++) {
        const tile = middleTiles.getChildAt<Container>(i);
        const tileFg = Sprite.from('d_orange');

        tileFg.label = 'tile_fg';
        tileFg.setSize(tileSize * 0.8);
        tileFg.anchor.set(0.5);
        tileFg.position.set(
            tile.width / 2,
            tile.height / 2,
        );

        tile.addChild(tileFg);
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

    // Setup api call on button click
    //const jackpotSound = new Howl({src: ['Assets/Sounds/JACKPOT.mp3']});
    const queryClient = new QueryClient();

    spinButton.eventMode = 'static';
    spinButton.cursor = 'pointer';
    spinButton.on('pointerdown', async () => {
        //jackpotSound.play();
        await spin(gridSize - 2, middleTiles, queryClient);
    });

    app.stage.addChild(spinButton);
    //spin(gridSize - 2, middleTiles, queryClient); // Spin the initail diamonds when loading the page

    return app;
}
