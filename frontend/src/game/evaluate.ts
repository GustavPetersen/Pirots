import { Queue } from '../utils/queue'

const NO_SYMBOL = Symbol();
type SlotSymbol = number | typeof NO_SYMBOL;

export function evaluate_spin(reels: Queue<SlotSymbol>[], boardSize: number) {
    const board: SlotSymbol[] = new Array(boardSize * boardSize).fill(NO_SYMBOL)

    while (true) {
        // fill board with symbols from reels
        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {

                const curTile = i * boardSize + j;
                if (board[curTile] != NO_SYMBOL) { // if the current tile already has a symbol
                    continue;
                }

                const symbol = reels[i].popFront();
                if (!symbol) {
                    // TODO: figure out how to actually error handle 
                    // when a reel runs out of symbols
                    throw new Error("Reel ran out of symbols");
                }

                board[curTile] = symbol;
            }
        }

        // group all adjacent symbols of same type and count group sizes
        const group: number[] = new Array(boardSize * boardSize).fill(-1); // tile -> group leader
        const groupSizes = new Map<number, number>(); // group leader -> group size

        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                const curTile = i * boardSize + j;
                const leftTile = (i-1) * boardSize + j;
                const upTile = i * boardSize + (j-1);

                if (leftTile >= 0 && board[curTile] == board[leftTile]) {
                    group[curTile] = group[leftTile];
                } else if (upTile >= 0 && board[curTile] == board[upTile]) {
                    group[curTile] = group[upTile];
                } else {
                    group[curTile] = curTile; // make self group leader
                }

                groupSizes.set(group[curTile], (groupSizes.get(group[curTile]) ?? 0) + 1);
            }
        }

        // Remove all groups of certain size
        const triggerThreshold = 4;

        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {

                const curTile = i * boardSize + j;
                if (board[curTile] == NO_SYMBOL) {
                    continue
                }

                if (groupSizes.get(group[curTile]) ?? 0 < triggerThreshold) {
                    continue
                }

                // TODO: here we should save the current symbol before 
                // removing it, so that we in the end can calcualte a score/payout
                board[curTile] = NO_SYMBOL;
            }
        }

        // Push all symbols down to make space for new reeling in
        for (var i = boardSize - 1; i >= 0; i--) {
            for (var j = boardSize - 2; j >= 0; j--) { // notice we skip the bottom row
                const curTile = i * boardSize + j;
                const downTile = i * boardSize + (j+1);
                
            }
        }
    }
}