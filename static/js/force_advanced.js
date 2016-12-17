console.log("force advanced");

////    VARIABLES   ////
var width = $("#tree").width(),
    height = 600,
    nodeMin = 3;
var force, nodes, links, svg, OP;
var clickedCommentID;
var names = {};
var nodecolor = {};
var discussion_url;
var loading_gif = new Image();
loading_gif.src = "../static/img/ajax-loader.gif";

var details1Container = $("#details-1"),
    details2Container = $("#details-2"),
    treeContainer = $("#tree"),
    body1Container = $("#body-1"),
    body2Container = $("#body-2");

////////////////////////


function setupGraph(){

    $("#tree").empty();

    force = d3.layout.force()
        .size([width, height])
        .charge(-100)
        .linkDistance(20);

    nodes = force.nodes();
    links = force.links();


    force.on("tick", function() {

        svg.selectAll("line.link")
            .attr("x1", function (d) {
                return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        svg.selectAll("circle.node")
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .on("click", updateDetails)

    });

    svg = d3.select("#tree")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
}


function updateNetwork() {

    var link = svg.selectAll("line.link")
        .data(links, function (d) {
            return d.source.id + "-" + d.target.id;
        });

    link.enter()
        .insert("svg:line", "circle.node")
        .attr("class", "link")
        .style("stroke-width", 2)
        .style("stroke", "gray")
        .style("opacity", 0.8);

    var node = svg.selectAll("circle.node")
        .data(nodes, function (d) {
            return d.id;
        });

    var nodeEnter = node.enter()
        .append("svg:circle")
        .attr("class", "node")
        // .call(force.drag)
        .attr("r", function (d) {
            if (d.score >= 10) {
               return 8;
           } else {
               return 4;
           }
        })
        .style("opacity", 1);
        // .call(force.drag);
    force.start();
    colorNodes();

}

function updateDetails(d) {
    console.log(d);
    details2Container.empty();
    details2Container.append($("<p>Author: " + d['name'] + "</p>"));
    details2Container.append($("<p>Score: " + d['score'] + "</p>"));
    body2Container.html($("<p>" + d['body'] + "</p>"));
}

function colorNodes(){
    for (name in nodecolor) {
        nodecolor[name] = d3.rgb(255*Math.random(), 255*Math.random(), 255*Math.random());
    }

    // OP = RED
    // CLICKED = GREEN
    svg.selectAll("circle")
        .style("fill", function (d) {
            // console.log(d);
            if (d.name === OP.name) {
                return "red";
            } else if (d['id'].split("_")[1] == clickedCommentID) {
                return "green";
            } else if (names[d.name] === 1) {
                return "black";
            } else {
                // return "yellow";
                return nodecolor[d.name];
            }
        })

}

