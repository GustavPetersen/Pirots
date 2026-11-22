import { QueryClient } from "@tanstack/react-query";
import { Application, Sprite, Assets } from "pixi.js";
import { Howl } from "howler";
import { renderSpin } from "./renderSpin";
import { getSpin } from "../api/game";
import { createBetLabel, createPayoutLabel } from "./labels";
import { createSpinButton } from "./spinButton";
import { createBoard } from "./board";

export default async function createStage(container: HTMLElement, queryClient: QueryClient): Promise<Application> {
    const app = new Application();
    await app.init({ backgroundColor: 0x000000, resizeTo: window });
    container.appendChild(app.canvas);

    // Load assets
    const jackpotSound = new Howl({ src: ["Assets/Sounds/JACKPOT.mp3"] });
    await Assets.init({ basePath: "Assets/Sprites/" })
    await Assets.load([
        { alias: "bg", src: "slots_background.png" },
        { alias: "test", src: "pirots_logo_650.png" },
        { alias: "tile_mid", src: "slots_tile.png" },
        { alias: "tile_corner", src: "slots_tile_corner.png" },
        { alias: "tile_straight", src: "slots_tile_straight.png" },
        { alias: "spin_button", src: "slots_spin_button.png" },
        { alias: "d_green", src: "slots_diamond_green.png" },
        { alias: "d_blue", src: "slots_diamond_blue.png" },
        { alias: "d_orange", src: "slots_diamond_orange.png" },
        { alias: "d_red", src: "slots_diamond_red.png" },
        { alias: "p_green", src: "slots_prisoner_green.png" },
        { alias: "p_blue", src: "slots_prisoner_blue.png" },
        { alias: "p_orange", src: "slots_prisoner_orange.png" },
        { alias: "p_red", src: "slots_prisoner_red.png" },
        { alias: "empty", src: "transparent.png" },
        { alias: "pirots", src: "pirots_logo_650.png" },
    ]);

    const background = Sprite.from("bg");
    background.setSize(app.screen.width, app.screen.height);

    const board = createBoard(background.width / 2, background.height / 2, 90, 8);
    const boardEndX = board.x + board.width / 2;

    const spinButton = createSpinButton(
        boardEndX + (background.width - boardEndX) / 2,
        background.height / 2,
        async () => {
            const spinResult = await queryClient
                .query({ queryKey: ["getSpin"], queryFn: getSpin(5, 67) })
                .catch((error) => {
                    alert(error);
                    return null;
                });

            if (!spinResult) return;

            jackpotSound.play();
            await renderSpin(app.stage, spinResult);
            await queryClient.invalidateQueries({ queryKey: ["getMe"] });
        }
    );

    const betLabel = createBetLabel(
        spinButton.position.x,
        spinButton.position.y + background.height * 0.25,
    );

    const payoutLabel = createPayoutLabel(
        betLabel.position.x,
        betLabel.position.y + background.height * 0.05,
    );

    app.stage.addChild(
        background,
        board,
        spinButton,
        betLabel,
        payoutLabel
    );

    return app;
}
