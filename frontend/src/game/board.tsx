import { Application, Assets, Sprite } from 'pixi.js';

const board = (async () => {
    const app = new Application();
    await app.init( {backgroundColor: 0x1099bb, resizeTo: window});
    document.body.replaceChildren(app.canvas);


    const background_img = await Assets.load('Assets/Sprites/slots_background.png');
    const logo = await Assets.load('Assets/Sprites/pirots_logo_650.png');
    const sprite = new Sprite(logo);
    const background_sprite = new Sprite(background_img);
    sprite.anchor.set(0.5);
    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;
    app.stage.addChild(background_sprite);
    app.stage.addChild(sprite);
})();

export default board;