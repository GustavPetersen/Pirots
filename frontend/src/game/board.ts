import { QueryClient } from '@tanstack/react-query';
import { Application, Container, Sprite, Assets, Texture } from 'pixi.js';
import { getDiamonds } from '../api/queries';

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
        {alias: 'd_green', src: 'slots_diamond_green.png'},
        {alias: 'd_blue', src: 'slots_diamond_blue.png'},
        {alias: 'd_orange', src: 'slots_diamond_orange.png'},
        {alias: 'd_red', src: 'slots_diamond_red.png'},
    ]);

    // Create background
    const background = Sprite.from('bg');
    background.setSize(app.screen.width, app.screen.height)
    app.stage.addChild(background);

    // Create tiles 
    // TODO: Needs rotated textures
    const tiles = new Container();
    const middleTiles = new Container();
    const edgeTiles = new Container();

    const tileSize = 90;
    const gridSize = 8;

    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            var texture = Texture.EMPTY;
            var subContainer = edgeTiles;

            if (i != 0 && i != gridSize - 1 &&                  // If middle tile
                j != 0 && j != gridSize - 1) {
                texture = Texture.from('tile_mid');
                subContainer = middleTiles;
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

            const tileBg = Sprite.from(texture);
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
    const queryClient = new QueryClient();
    const dTextures: Texture[] = [
        Texture.from('d_green'),
        Texture.from('d_blue'),
        Texture.from('d_red'),
        Texture.from('d_orange'),
    ];

    const spin = async () => {
        const diamonds = await queryClient.query({
            queryKey: ["getDiamonds"],
            queryFn: getDiamonds,
        });

        for (var i = 0; i < middleTiles.children.length; i++) {
            const tile = middleTiles.getChildAt<Container>(i);
            const newTexture = dTextures[diamonds[i]];
            const curDiamond = tile.getChildByLabel('tile_fg') as Sprite;

            if (curDiamond) {
                curDiamond.texture = newTexture;
                continue;
            }

            // Only runs on first spin
            const new_diamond = Sprite.from(newTexture);
            new_diamond.label = 'tile_fg';
            new_diamond.setSize(tileSize*0.8);

            new_diamond.anchor.set(0.5);
            new_diamond.position.set(
                tile.width / 2,
                tile.height / 2,
            );

            tile.addChild(new_diamond);
        }
    };

    spinButton.eventMode = 'static';
    spinButton.cursor = 'pointer';
    spinButton.on('pointerdown', spin);

    app.stage.addChild(spinButton);
    spin(); // Spin the initail diamonds when loading the page

    return app;
}
