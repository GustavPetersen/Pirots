import type { Comparable } from "./types";

export class PriorityQueue<T extends Comparable<T>> {
    private heap: T[];
    private order: -1 | 1; // min- or max-heap

    constructor(isMax: boolean = false) {
        this.heap = new Array();
        this.order = isMax ? 1 : -1;
    }

    public insert(element: T): void {
        var curIdx = this.heap.push(element) - 1;

        while (true) {
            const parentIdx = this.parentIdx(curIdx);
            const shouldFloat = element.compareTo(this.heap[parentIdx]) === this.order;
            if (!shouldFloat) return;

            this.heap[curIdx] = this.heap[parentIdx];
            this.heap[parentIdx] = element;
            curIdx = parentIdx;
        }
    }

    public pop(): T | undefined {
        if (this.heap.length <= 1) return this.heap.pop();

        const ret = this.heap[0];
        const element = this.heap.pop()!;
        var curIdx = 0;

        while (true) {
            const leftIdx = this.leftIdx(curIdx);
            const rightIdx = this.rightIdx(curIdx);
            const childIdx = this.heap[leftIdx].compareTo(this.heap[rightIdx]) === this.order
                             ? leftIdx : rightIdx;

            const shouldSink = this.heap[childIdx].compareTo(element) === this.order;
            if (!shouldSink) return ret;

            this.heap[curIdx] = this.heap[childIdx];
            this.heap[childIdx] = element;
            curIdx = childIdx;
        }
    }

    public peek(): T | undefined {
        return this.heap.at(0);
    }

    private parentIdx(idx: number): number {
        return Math.trunc((idx - 1) / 2);
    }

    private leftIdx(idx: number): number {
        const left = idx * 2 + 1;
        return left < this.heap.length ? left : idx;
    }

    private rightIdx(idx: number): number {
        const right = idx * 2 + 2;
        return right < this.heap.length ? right : idx;
    }
}