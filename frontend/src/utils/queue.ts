export class Queue<T> {
    private head: Node<T> | undefined;
    private tail: Node<T> | undefined;

    public pushFront(value: T): void {
        const newHead = new Node(value);
        if (!this.head) {
            this.head = newHead;
            this.tail = newHead;
            return;
        }

        const oldHead = this.head;
        this.head = newHead;
        newHead.next = oldHead;
        oldHead.prev = newHead;
    }

    public pushBack(value: T): void {
        const newTail = new Node(value);
        if (!this.tail) {
            this.head = newTail;
            this.tail = newTail;
            return;
        }
        
        const oldTail = this.tail;
        this.tail = newTail;
        newTail.prev = oldTail;
        oldTail.next = newTail;
    }

    public popFront(): T | undefined {
        const ret = this.head?.value;
        this.head = this.head?.next;

        if (!this.head) {
            return ret
        }

        this.head.prev = undefined;
        return ret;
    }

    public popBack(): T | undefined {
        const ret = this.tail?.value;
        this.tail = this.tail?.prev;

        if (!this.tail) {
            return ret
        }

        this.tail.next = undefined;
        return ret;
    }

    public isEmpty(): boolean {
        return this.head == undefined || this.tail == undefined;
    }
}

class Node<T> {
    next: Node<T> | undefined;
    prev: Node<T> | undefined;
    value: T;

    constructor(value: T) {
        this.value = value;
    }
}