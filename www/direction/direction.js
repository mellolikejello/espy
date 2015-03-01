"use strict";
// globals to be stored in direction wrapper when combined with rest of project
var canvas, ctx;
var nodes, nodeCount;
var DEFAULT_RADIUS = 10;

var Node = function(id, x, y){
    this.id = id;
    this.x = x;
    this.y = y;
    this.neighbors = {};
};

/*
    id - id of neighboring node
    weight - weight of traveling between current node and this neighbor
    direction - directional text, example: "turn right and walk to end of hall"
*/
Node.prototype.addNeighbor = function(id, direction) {
    var neighbor = nodes[id];
    var weight = Math.sqrt(Math.pow((this.x - neighbor.x), 2)+Math.pow((this.y - neighbor.y),2));
    this.neighbors[id] = {weight: weight, direction: direction};
    this.drawConnection(id, ctx);
};

Node.prototype.draw = function(ctx) {
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.arc(this.x, this.y, DEFAULT_RADIUS, 0, 2*Math.PI);
    ctx.stroke();
    ctx.strokeText(this.id, this.x-2, this.y+2);
};

Node.prototype.drawConnection = function(id, ctx) {
    ctx.strokeStyle = "#D3D3D3";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(nodes[id].x, nodes[id].y);
    ctx.stroke();
}

function onCanvasClick(e) {
    var curPos = e.x + ", " + e.y;
    displayFeedback(curPos);
    var curNode = new Node(nodeCount, e.x, e.y);
    nodes.push(curNode);
    nodeCount++;
    curNode.draw(ctx);
}

function displayFeedback(content) {
    var logger = document.querySelector("#debug");
    logger.textContent = content;
}

/*
    Dijkstra helper function
    
    returns index of node with smallest distance
*/
function findMinIndex(queue, dist) {
    var minDist = Number.MAX_VALUE;
    var minIndex = null;
    
    for(var i in queue) {
        var curDist = dist[queue[i].id];
        if(curDist <= minDist) {
            minDist = curDist;
            minIndex = i;
        }
    }
    
    return minIndex;
}

function queueContainsNode(queue, nodeid) {
    for(var i in queue) {
        if(queue[i].id == nodeid) return true;
    }
    return false;
}

/*
    graph - list of all nodes
    source - Node to calculate distances from
    
    finding distance between source and all other nodes
*/
function dijkstra(graph, source) {
    // distance from source to node
    var dist = [];
    // optimal node path from source to node
    var prev = [];
    // nodes to visit
    var queue = [];
    
    dist[source.id] = 0;
    // null or empty list?
    prev[source.id] = null;
    
    for(var id in graph) {
        if(id != source.id) {
            dist[id] =  Number.MAX_VALUE;
            prev[id] = null;
        }
        queue.push(graph[id]);
    }
    
    while(queue.length != 0) {
        var curIndex = findMinIndex(queue, dist);
        var curNode = queue.splice(curIndex, 1)[0];
        
        for(var neighbor in curNode.neighbors) {
            if(queueContainsNode(queue, neighbor)) {
                // neighbor.weight, neighbor.direction
                //curNode.neighbors[neighbor]
                var altDist = dist[curNode.id] + curNode.neighbors[neighbor].weight;
                if(altDist < dist[neighbor]) {
                    dist[neighbor] = altDist;
                    prev[neighbor] = curNode.id;
                }
            }
        }
    }
    
    return {distances: dist, prev: prev};
}

function init() {
	canvas = document.querySelector("canvas");
	ctx = canvas.getContext("2d");
    
    nodes = [];
    nodeCount = 0;
    
    testOne();
    
    // for testing
    canvas.addEventListener("click", onCanvasClick);
}

function testOne() {
    var testNodes = [
        {id: 0, x: 100, y: 470},
        {id: 1, x: 150, y: 350},
        {id: 2, x: 375, y: 330},
        {id: 3, x: 100, y: 50},
        {id: 4, x: 250, y: 200},
        {id: 5, x: 400, y: 200},
        {id: 6, x: 570, y: 330},
        {id: 7, x: 485, y: 60}
    ];
    
    var connections = [
        [0, 1],
        [0, 3],
        [1, 2],
        [1, 4],
        [2, 4],
        [2, 6],
        [3, 4],
        [6, 7]
    ];

    for(var i = 0; i < testNodes.length; i++) {
        var curNode = new Node(i, testNodes[i].x, testNodes[i].y);
        nodes.push(curNode);
    }
    
    for(var con in connections) {
        var curConnect = connections[con];
        var srcNode = nodes[curConnect[0]];
        var destNode = nodes[curConnect[1]];
        
        srcNode.addNeighbor(destNode.id, "test direction");
        destNode.addNeighbor(srcNode.id, "test direction");
        srcNode.drawConnection(destNode.id, ctx);
    }
    
    for(var node in nodes) {
        nodes[node].draw(ctx);   
    }
    
    var results = dijkstra(nodes, nodes[0]);
    debugger;
}



window.onload = init;