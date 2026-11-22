import { type SpinResult, type SlotSymbol, } from "../utils/types";
import { Container, Sprite, Text } from "pixi.js";
import { BOARD_WIDTH, BOARD_HEIGHT, sleep, getSymbolTexture, PRISONERS, } from "../utils/constants";

export async function renderSpin(stage: Container, spinResult: SpinResult) {
    const ms = 700;
    const board: SlotSymbol[] = new Array(BOARD_WIDTH * BOARD_HEIGHT).fill("empty");
    const payoutLabel = stage.getChildByLabel("payoutLabel")! as Text;
    payoutLabel.text = "Payout: 0";

    while (!spinResult.symbolReel.isEmpty()) {
        // Fill board
        board.forEach((symbol, i) => {
            if (symbol === "empty") board[i] = spinResult.symbolReel.popFront()!;
        });

        await drawBoard(stage, board, ms);

        // Walk prisoners
        for (var _ = 0; _ < PRISONERS.length; _++) {
            const walk = spinResult.prisonerWalks.popFront()!;
            const startTile = walk[0].tile;
            const pSymbol = board[startTile];

            const pTexture = getSymbolTexture(pSymbol);
            const emptyTexture = getSymbolTexture("empty");

            for (var i = 1; i < walk.length; i++) {
                const prevStep = walk[i - 1];
                const curStep = walk[i];

                getSpriteAtTile(stage, prevStep.tile).texture = emptyTexture;
                board[prevStep.tile] = "empty";
                getSpriteAtTile(stage, curStep.tile).texture = pTexture;
                board[curStep.tile] = pSymbol;

                const curPayoutLabel = payoutLabel.text;
                const updatedPayoutLabel = Number(curPayoutLabel.split(" ")[1]) + curStep.payout;
                payoutLabel.text = "Payout: " + updatedPayoutLabel.toFixed(1);

                await sleep(ms);
            }
        }
        await sleep(ms);

        // Push symbols down
        for (var tile = board.length - BOARD_WIDTH - 1; tile >= 0; tile--) {
            var downTile = tile;
            while ((downTile += BOARD_WIDTH) < board.length && board[downTile] === "empty") { }
            downTile -= BOARD_WIDTH; // We have overshot by 1

            if (downTile === tile) continue;

            board[downTile] = board[tile];
            board[tile] = "empty";
        }

        await drawBoard(stage, board, ms);
    }
}

async function drawBoard(stage: Container, board: SlotSymbol[], ms: number) {
    board.forEach((symbol, i) => {
        getSpriteAtTile(stage, i).texture = getSymbolTexture(symbol);
    });
    await sleep(ms);
}

function getSpriteAtTile(stage: Container, idx: number): Sprite {
    const tiles = stage.getChildByLabel("tiles");
    const middleTiles = tiles!.getChildByLabel("middleTiles");
    const tile = middleTiles!.getChildAt<Container>(idx);

    const sprite = tile.getChildByLabel("tile_fg") as Sprite | null;
    if (!sprite) throw new Error(`No tile_fg at ${idx}`);

    return sprite;
}
