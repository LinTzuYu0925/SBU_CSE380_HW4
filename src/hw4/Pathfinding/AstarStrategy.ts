import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";

// TODO DONE Construct a NavigationPath object using A*

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */
export default class AstarStrategy extends NavPathStrat {

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        // Get the closest nodes in the graph to our to and from positions
        let start = this.mesh.graph.snap(from);
		let end = this.mesh.graph.snap(to);

        // Use A* to construct the path
        let parent = GraphUtils.A_star(this.mesh.graph, start, end);

        let pathStack = new Stack<Vec2>(this.mesh.graph.numVertices);
        // Push the final position and the final position in the graph
		pathStack.push(to.clone());
		pathStack.push(this.mesh.graph.positions[end]);
        // Add all parents along the path
		let i = end;
		while(parent[i] !== -1) {
			pathStack.push(this.mesh.graph.positions[parent[i]]);
			i = parent[i];
		}

        return new NavigationPath(pathStack);
    }
    
}