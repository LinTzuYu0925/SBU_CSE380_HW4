import Graph from "../DataTypes/Graphs/Graph";
import EdgeNode from "../DataTypes/Graphs/EdgeNode";
import PositionGraph from "../DataTypes/Graphs/PositionGraph";

/** A class to provides some utility functions for graphs */
export default class GraphUtils {

	/**
	 * An implementation of Djikstra's shortest path algorithm based on the one described in The Algorithm Design Manual.
	 * @param g The graph
	 * @param start The number to start the shortest path from
	 * @returns An array containing the parent of each node of the Graph in the shortest path.
	 */
	static djikstra(g: Graph, start: number): Array<number> {
		let i: number;		// Counter
		let p: EdgeNode;	// Pointer to edgenode
		let inTree: Array<boolean> = new Array(g.numVertices);
		let distance: Array<number> = new Array(g.numVertices);
		let parent: Array<number> = new Array(g.numVertices);
		let v: number;		// Current vertex to process
		let w: number; 		// Candidate for next vertex
		let weight: number;	// Edge weight
		let dist;			// Best current distance from start

		for(i = 0; i < g.numVertices; i++){
			inTree[i] = false;
			distance[i] = Infinity;
			parent[i] = -1;
		}

		distance[start] = 0;
		v = start;

		while(!inTree[v]){
			inTree[v] = true;
			p = g.edges[v];

			while(p !== null){
				w = p.y;
				weight = p.weight;

				if(distance[w] > distance[v] + weight){
					distance[w] = distance[v] + weight;
					parent[w] = v;
				}

				p = p.next;
			}

			v = 0;

			dist = Infinity;

			for(i = 0; i <= g.numVertices; i++){
				if(!inTree[i] && dist > distance[i]){
					dist = distance;
					v = i;
				}
			}
		}

		return parent;

	}

	/**
	 * An implementation of A*'s shortest path algorithm based on the one described in The Algorithm Design Manual.
	 * @param g The graph
	 * @param start The number to start the shortest path from
	 * @param end The number the shortest path to end
	 * @returns An array containing the parent of each node of the Graph in the shortest path.
	 */
	static A_star(g: PositionGraph, start: number, end: number): Array<number> {
		// The set of discovered nodes that may need to be (re-)expanded.
		// Initially, only the start node is known.
		// Implemented as a min-heap or priority queue rather than a hash-set.
		let open_list = new min_heap();
		open_list.add({'vertex' : start, 'f_score' : 0});
		// For node n, g_score[n] is the cost of the cheapest path from start to n currently known.
		let g_score: Array<number> = new Array<number>(g.numVertices);
		// For node n, came_from[n] is the node immediately preceding it on the cheapest path from the start
    	// to n currently known.
		let came_from: Array<number> = new Array<number>(g.numVertices);

		for (let i = 0; i < g.numVertices; i++) {
			g_score[i] = Number.MAX_VALUE;
			came_from[i] = -1;
		}
		g_score[start] = 0;

		while (open_list.length) {
			//open_list.sort((a, b) => { return (b.f_score - a.f_score); });
			let current: Record<'vertex' | 'f_score', number> = open_list.remove_min();

			if (current.vertex == end) return came_from;

			// Get all the neighbors
			let edge_pointer: EdgeNode = g.edges[current.vertex];	// Pointer to edgenode since Graph.edges is implemented in link list
			let neighbor: number;
			while (edge_pointer != null) {
				neighbor = edge_pointer.y;
				// g_tentative is the distance from start to the neighbor through current
				let g_tentative: number = g_score[current.vertex] + edge_pointer.weight;

				if (g_tentative < g_score[neighbor]) { // This path to neighbor is better than any previous one
					came_from[neighbor] = current.vertex;
					g_score[neighbor] = g_tentative;
					let h_score: number = g.getNodePosition(neighbor).distanceTo(g.getNodePosition(end));
					let f_score = g_tentative + h_score;
					
					/*
					let flag: boolean = true;
					for (let i = 0; i < open_list.length; i++)
						if (open_list[i].vertex === neighbor) {
							open_list[i].f_score = f_score;
							flag = false;
							break;
						}
					if (flag) 
						open_list.push({'vertex' : neighbor, 'f_score' : f_score});*/
					
					
					if (open_list.has(neighbor))
						open_list.update(neighbor, f_score);
					else
						open_list.add({'vertex': neighbor, 'f_score': f_score});
					
				}

				edge_pointer = edge_pointer.next;
			}
		}
		return came_from;
		// throw "The " + g.nodeToString(end) + " is not able to reach from the " + g.nodeToString(start);
	}
}

/** A class to provides some mininum heap structure for A_star */
class min_heap {
	// The heap is implemented as an array of Record
	// The Record<number, number> maps the index of the node to the current 'f' score of A* algo
    protected heap: Array<Record<'vertex' | 'f_score', number>> = [];

    constructor() { }

    // Add an item to the heap
    public add(item: Record<'vertex' | 'f_score', number>): void {
        this.heap.push(item);
        let currentIndex = this.heap.length - 1;

        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            if (this.heap[currentIndex]['f_score'] < this.heap[parentIndex]['f_score']) {
                [this.heap[currentIndex], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[currentIndex]];
                currentIndex = parentIndex;
            } else {
                break;
            }
        }
    }

    // Remove the minimum element (root) from the heap
    public remove_min(): Record<'vertex' | 'f_score', number> | undefined {
        if (this.heap.length == 0) return undefined;
		
		// Since we update the node value by marke-and-add, we have to discard the dirty node.
        let min: Record<'vertex' | 'f_score', number>;
		do {
			min = this.heap[0];

			if (this.heap.length == 1)
				this.heap.pop()!;
			else
				this.heap[0] = this.heap.pop()!;

			let currentIndex = 0;
			while (true) {
				const leftChildIndex = 2 * currentIndex + 1;
				const rightChildIndex = 2 * currentIndex + 2;
				let smallerChildIndex = leftChildIndex;
				if (rightChildIndex < this.heap.length && this.heap[rightChildIndex]['f_score'] < this.heap[leftChildIndex]['f_score']) {
					smallerChildIndex = rightChildIndex;
				}
	
				if (smallerChildIndex < this.heap.length && this.heap[currentIndex]['f_score'] > this.heap[smallerChildIndex]['f_score']) {
					[this.heap[currentIndex], this.heap[smallerChildIndex]] = [this.heap[smallerChildIndex], this.heap[currentIndex]];
					currentIndex = smallerChildIndex;
				} else {
					break;
				}
			}
		} while (min['vertex'] < 0)

		if (min['vertex'] < 0) return undefined;
		
        return min;
    }

	// Chenk if item with index is in the heap
	public has(index: number): boolean {
		for (let i = 0; i < this.heap.length; i++)
			if (this.heap[i]['vertex'] === index) return true;
		
		return false;
	}

	// Update the value of the given index and rearrange the tree
	// Done by marking the original node index as -1, and add a new node into the heap
	public update(index: number, value: number): void {
		for (let i = 0; i < this.heap.length; i++)
			if (this.heap[i]['vertex'] === index) {
				this.heap[i]['vertex'] = -1; // set the node as dirty
				this.add({"vertex" : index, "f_score" : value});
				return;
			}

		throw "No such node in the heap.";
	}

	public get length(): number { return this.heap.length; }
}