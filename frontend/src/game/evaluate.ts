import { Queue } from '../utils/queue'

const NO_SYMBOL = Symbol();
type SlotSymbol = number | typeof NO_SYMBOL;

export function evaluate_spin(reels: Queue<SlotSymbol>[], boardSize: number) {
    const board: SlotSymbol[] = [];

    while (true) {
        // fill board with symbols from reels
        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {

                const curTile = i * boardSize + j;
                if (board[curTile] != NO_SYMBOL) { // if the current tile already has a symbol
                    continue
                }

                const symbol = reels[i].popFront();
                if (!symbol) {
                    // TODO: figure out how to actually error handle 
                    // when a reel runs out of symbols
                    throw new Error("Reel ran out of symbols")
                }

                board[curTile] = symbol;
            }
        }

        // group all adjacent symbols of same type
        const group: number[] = new Array(boardSize*boardSize).fill(-1); // tile -> group leader
        const counter = new Map<number, number>(); // group leader -> group size

        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                const cur = i * boardSize + j;
                const left = (i-1) * boardSize + j;
                const up = i * boardSize + (j-1);

                if (left >= 0 && board[cur] == board[left]) {
                    group[cur] = group[left];
                } else if (up >= 0 && board[cur] == board[up]) {
                    group[cur] = group[up];
                } else {
                    group[cur] = cur; // make self group leader
                }

                counter.set(group[cur], (counter.get(group[cur]) ?? 0) + 1);
            }
        }
    }
}