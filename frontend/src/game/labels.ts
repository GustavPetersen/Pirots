import { Text, type TextStyleOptions } from "pixi.js";

const labelStyle: TextStyleOptions = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 28,
    fontWeight: "bold",
    fill: 0xffffff,
    letterSpacing: 1,
}

export function createBetLabel(x: number, y: number): Text {
    const betLabel = new Text({
        text: "Bet: 5",
        style: labelStyle,
    });

    betLabel.position.set(x, y);
    betLabel.anchor.set(0.5);
    betLabel.label = "betLabel";

    return betLabel;
}


export function createPayoutLabel(x: number, y: number): Text {
    const payoutLabel = new Text({
        text: "",
        style: labelStyle,
    });

    payoutLabel.position.set(x, y);
    payoutLabel.anchor.set(0.5);
    payoutLabel.label = "payoutLabel";

    return payoutLabel;
}