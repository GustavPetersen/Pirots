import { Sprite } from "pixi.js";

export function createSpinButton(x: number, y: number, onClick: () => Promise<void>): Sprite {
    const spinButton = Sprite.from("spin_button");

    spinButton.position.set(x, y);
    spinButton.anchor.set(0.5);
    spinButton.label = "spinButton";

    spinButton.eventMode = "static";
    spinButton.cursor = "pointer";

    let isSpinning = false;
    spinButton.on("pointerdown", async () => {
        if (isSpinning) return;

        spinButton.alpha = 0.6;
        isSpinning = true;

        await onClick();

        spinButton.alpha = 1.0;
        isSpinning = false;
    });

    return spinButton;
}