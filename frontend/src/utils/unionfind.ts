// This is a horrible implementation
export class GenericUnionFind<T> {
    private parents: Map<T, T> = new Map<T, T>();

    public find(a: T): T {
        var cur = a;
        var parent = this.parents.get(cur);

        while (parent != undefined) {
            cur = parent;
            parent = this.parents.get(cur);
        }

        return cur;
    }

    public union(a: T, b: T) {
        this.parents.set(this.find(a), this.find(b));
    }

    public isUnion(a: T, b: T): boolean {
        return this.find(a) == this.find(b);
    }
}

// Bad too
export class UnionFind {
    private parent: number[];
    private count: number[];

    constructor(size: number) {
        this.parent = new Array(size);
        this.count = new Array(size).fill(1);

        for (var i = 0; i < size; i++) {
            this.parent[i] = i
        }
    }

    public find(a: number): number {
        var cur = a
        while (cur != this.parent[cur]) {
            cur = this.parent[cur];
        }

        return cur;
    }

    public union(a: number, b: number) {
        const aRepr = this.find(a);
        const bRepr = this.find(b);
        this.parent[aRepr] = bRepr;
        this.count[bRepr] += this.count[aRepr];
    }

    public isUnion(a: number, b: number): boolean {
        return this.find(a) == this.find(b);
    }

    public size(a: number): number {
        return this.count[a];
    }

}
