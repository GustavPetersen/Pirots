import { Application, Assets, Sprite } from 'pixi.js';

const board = (async () => {
    const app = new Application();
    await app.init( {backgroundColor: 0x1099bb, resizeTo: window});
    document.body.replaceChildren(app.canvas);


    const background_img = await Assets.load('Assets/Sprites/slots_background.png');
    const background_sprite = new Sprite(background_img);
    app.stage.addChild(background_sprite);

    const board_size = app.screen.width * 0.5;
    const tile_size = board_size / 8;
    const board_x_start = app.screen.width * 0.25;
    const board_y_start = (app.screen.height / 2) - (board_size / 2);
    const tile_img = await Assets.load('Assets/Sprites/slots_tile.png');
    const tiles = [];

    // tile placing logic
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            const tile = new Sprite(tile_img);
            tile.width = tile_size;
            tile.height = tile_size;
            tile.position.x =  board_x_start + x * tile_size + tile_size;
            tile.position.y =  board_y_start + y * tile_size + tile_size;
            app.stage.addChild(tile);
            tiles.push(tile);
            }
    }
})();

export default board;