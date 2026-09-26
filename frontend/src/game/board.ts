import { Application, Assets, Sprite } from 'pixi.js';
import { Howl } from 'howler';

export default async function createBoard(container: HTMLElement): Promise<Application> {
    const app = new Application();
    await app.init( {backgroundColor: 0x1099bb, resizeTo: window});
    container.appendChild(app.canvas);

    const jackpotSound = new Howl({src: ['Assets/Sounds/JACKPOT.mp3']});
    
    const background_img = await Assets.load('Assets/Sprites/slots_background.png');
    app.stage.addChild(new Sprite(background_img));

    const board_size = app.screen.width * 0.5;
    const tile_size = board_size / 8;
    const diamond_size = tile_size * 0.7;
    const board_x_start = app.screen.width * 0.25; // We have to rename these at some point!
    const board_y_start = (app.screen.height / 2) - (board_size / 2); // We have to rename these at some point!

    const tile_img = await Assets.load('Assets/Sprites/slots_tile.png');
    const diamond_images = await Promise.all([
        Assets.load('Assets/Sprites/slots_diamond_blue.png'),
        Assets.load('Assets/Sprites/slots_diamond_red.png'),
        Assets.load('Assets/Sprites/slots_diamond_green.png'),
        Assets.load('Assets/Sprites/slots_diamond_orange.png'),
    ]);
    const diamonds: Sprite[] = [];

    // tiles
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            const tile = new Sprite(tile_img);
            tile.width = tile_size;
            tile.height = tile_size;
            tile.position.set(
                board_x_start + x * tile_size + tile_size,
                board_y_start + y * tile_size + tile_size,
            );
            app.stage.addChild(tile);
        }
    }

    // diamonds
    const randomDiamond = () => diamond_images[Math.floor(Math.random() * 4)];
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            const d = new Sprite(randomDiamond());
            d.width = diamond_size;
            d.height = diamond_size;
            d.position.set(
                board_x_start + x * tile_size + tile_size * 1.5 - diamond_size * 0.5,
                board_y_start + y * tile_size + tile_size * 1.5 - diamond_size * 0.5,
            );
            app.stage.addChild(d);
            diamonds.push(d);
        }
    }

    function spin() {
        for (const d of diamonds) {
            d.texture = randomDiamond();
        }
    }

    // spin button
    const spin_img = await Assets.load('Assets/Sprites/slots_spin_button.png');
    const spin_button = new Sprite(spin_img);
    spin_button.position.set(board_x_start + board_size, app.screen.height / 2 - spin_button.height / 2);
    spin_button.eventMode = 'static';
    spin_button.cursor = 'pointer';
    spin_button.on('pointerdown', () => {
        jackpotSound.play();
        spin();
    });
    app.stage.addChild(spin_button);

    return app;
}