console.log("force advanced");

////    VARIABLES   ////
// var width = $("#tree").width(),
var width,
    height = 400;

var force, nodes, links, svg, OP;
var clickedCommentID;
var parentOfClickedID;
var names = {};
var nodecolor = {};
var discussion_url;
var loading_gif = new Image();
loading_gif.src = "../static/img/ajax-loader.gif";

var zoom = d3.behavior.zoom().on("zoom", rescale);

var details1Container = $("#details-1"),
    details2Container = $("#details-2"),
    treeContainer = $("#tree"),
    body1Container = $("#body-1"),
    body2Container = $("#body-2");

var prevClicked,
    prevColor;

////////////////////////


function setupGraph(){

    $("#tree").empty();

    width = $("#tree").width();
    console.log(width);

    force = d3.layout.force()
        .size([width, height])
        .charge(-100)
        .linkDistance(40);

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
            .on("click", function(d) {
                sendToLogger("secondvis comment clicked: " + d['id']);
                if (prevClicked != undefined) {
                    prevClicked.style("fill", prevColor);
                }
                prevClicked = d3.select(this);
                prevColor = prevClicked.style("fill");

                prevClicked.style("fill", "orange");
                updateDetails(d);
            })

    });

    svg = d3.select("#tree")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "border: 1px solid black")
        .call(zoom)
        .append("svg:g");
}


function disableZoom() {
    zoom.on("zoom", null)
}

function rescale() {
    trans = d3.event.translate;
    scale = d3.event.scale;

    svg.attr("transform",
        "translate(" + trans + ")"
        + " scale(" + scale + ")");
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
            if (d['id'] == parentOfClickedID){
                return 12;
            } else if (d.name === OP.name) {
                return 12;
            } else if (d['id'].split("_")[1] == clickedCommentID) {
                return 12;
            } else {
                return scoreScale(d['score']);
            }
        })
        .style("opacity", 1);
        // .call(force.drag);
    force.start();
    colorNodes();

    // if (body1Container.height() > 250) {
    //     body1Container.addClass("pre-scrollable");
    // }

}

function updateDetails(d) {
    // console.log(d);
    details2Container.empty();
    details2Container.append($("<p><span class='glyphicon glyphicon-user'></span> Author: " + d['name'] + "</p>"));
    details2Container.append($("<p>Score: " + d['score'] + "</p>"));
    // body2Container.html($("<p>" + d['body'] + "</p>"));

    // var body2TeaserText;
    // if (d['body'].length > 100) {
    //     body2TeaserText = d['body'].substring(0, 100);
    //     body2Container.html($("<span class='teaser'>" + body2TeaserText + "</span><span class='complete' style='display: none;'>" + d['body'] + "</span><span class='more'> more...</span>"));
    // } else {
    //     body2Container.html($("<span class='teaser'>" + d['body'] + "</span>"));
    //
    // }
    var body2TeaserText;
    var body2CompleteText;
    if (d['body'].length > 120) {
        body2TeaserText = d['body'].substring(0, 120);
        body2CompleteText = d['body'].substring(120);
        body2Container.html($("<span class='teaser'>" + body2TeaserText + "</span><span class='complete' style='display: none;'>" + body2CompleteText + "</span><span class='more btn btn-primary btn-xs' style='margin-left: 5px;'>more...</span>"));
    } else {
        body2Container.html($("<span class='teaser'>" + d['body'] + "</span>"));

    }


    // $(".more").toggle(function(){
    //     $(this).text("less..").siblings(".complete").show();
    // }, function(){
    //     $(this).text("more..").siblings(".complete").hide();
    // });
    $(".more").on("click", function(){
        if ($(this).text() == "more..."){
            $(this).text("less...").siblings(".complete").show();
        } else {
            $(this).text("more...").siblings(".complete").hide();
        }
    });
// <span class="teaser">text goes here</span>
//
//     <span class="complete"> this is the
//     complete text being shown</span>
//
//     <span class="more">more...</span>


    // if (body2Container.height() > 350) {
    //     body2Container.addClass("pre-scrollable");
    // }
}

function colorNodes(){
    for (name in nodecolor) {
        // nodecolor[name] = "hsl(" + Math.random() * 360 + ",100%, 50%)";
        nodecolor[name] = "hsl(" + Math.random() * 360 + ", " + (33 + (Math.random() * 67)) + "%, " + (0 + (Math.random() * 100)) + "%)";
    }

    // OP = RED
    // CLICKED = GREEN
    svg.selectAll("circle")
        .style("fill", function (d) {
            // console.log(d);
            // console.log(d['id']);
            // console.log(parentOfClickedID);
            if (d['id'] == parentOfClickedID) {
                return "yellow";
            } else if (d['id'].split("_")[1] == clickedCommentID) {
                return "green";
                // return "hsl(360 ,100%, 50%)";
            } else if (d.name === OP.name) {
                return "red";
                // return "hsl(120 ,100%, 50%)";
            } else if (names[d.name] === 1) {
                return "black";
            } else {
                return nodecolor[d.name];
            }
        })

}

