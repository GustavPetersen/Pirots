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
        var parentIdx = this.parentIdx(curIdx);
        var shouldFloat = element.compareTo(this.heap[parentIdx]) === this.order;

        while (shouldFloat) {
            this.heap[curIdx] = this.heap[parentIdx]
            this.heap[parentIdx] = element;

            curIdx = parentIdx;
            parentIdx = this.parentIdx(curIdx);
            shouldFloat = element.compareTo(this.heap[parentIdx]) === this.order;
        }
    }

    public pop(): T | undefined {
        if (this.heap.length <= 1) {
            return this.heap.pop();
        }

        const ret = this.heap[0];
        const element = this.heap.pop()!;

        var curIdx = 0;
        var leftIdx = this.leftIdx(curIdx);
        var rightIdx = this.rightIdx(curIdx);
        var childIdx = this.heap[leftIdx].compareTo(this.heap[rightIdx]) === this.order
                       ? leftIdx : rightIdx;
        var shouldSink = this.heap[childIdx].compareTo(element) === this.order;

        while (shouldSink) {
            this.heap[curIdx] = this.heap[childIdx];
            this.heap[childIdx] = element;
            
            curIdx = childIdx;
            leftIdx = this.leftIdx(curIdx);
            rightIdx = this.rightIdx(curIdx);
            childIdx = this.heap[leftIdx].compareTo(this.heap[rightIdx]) === this.order 
                       ? leftIdx : rightIdx;
            shouldSink = this.heap[childIdx].compareTo(element) === this.order;
        }

        return ret;
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