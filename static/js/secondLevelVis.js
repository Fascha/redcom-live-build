function secondLevelVis(comment) {
    console.log("COMMENT: ", comment);

    var commentBody = comment['body'];
    delete comment['body'];

    var keys = Object.keys(comment);
    var lcomment = $.map(comment, function(value, index) {
        return [value];
    });

    var contextData;

    $.ajax({
        dataType: "json",
        url: "/get_context/" + comment['id'],
        success: function(d) {
            contextData = d;
            populateVisualisations(d);
        }
    });

    var details1Container = $("#details-1"),
        details2Container = $("#details-2"),
        contextTreeContainer = $("#context-tree"),
        body1Container = $("#body-1"),
        body2Container = $("#body-2");

    //////////////////
    ////clear divs////
    //////////////////
    details1Container.empty();
    details2Container.empty();
    contextTreeContainer.empty();
    body1Container.empty();
    body2Container.empty();
    //////////////////
    //////////////////
    //////////////////

    body1Container.html("<p>" + commentBody + "</p>");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        detailsHeight = 500,
        bodyHeight = 300;


    var details1 = d3.select("#details-1")
        .append("svg")
        .attr("width", details1Container.width() - margin.left - margin.right)
        .attr("height", detailsHeight - margin.top - margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var details2 = d3.select("#details-2")
        .append("svg")
        .attr("width", details1Container.width() - margin.left - margin.right)
        .attr("height", detailsHeight - margin.top - margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var contextTree = d3.select("#context-tree")
        .append("svg")
        // .attr("width", details1Container.width() - margin.left - margin.right)
        .attr("width", treeContainer.width() - margin.left - margin.right)
        .attr("height", detailsHeight - margin.top - margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var body1 = d3.select("#body-1")
    //     .append("svg")
    //     .attr("width", details1Container.width() - margin.left - margin.right)
    //     .attr("height", bodyHeight - margin.top - margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //
    //
    // var body2 = d3.select("#body-2")
    //     .append("svg")
    //     .attr("width", details1Container.width() - margin.left - margin.right)
    //     .attr("height", bodyHeight - margin.top - margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //



    function populateVisualisations(con){

        console.log(con);

        var temp = [];

        var parent_of_parent = con['parent_of_parent'];
        parent_of_parent['type'] = "parent_of_parent";

        var parent = con['parent'];
        parent['type'] = "parent";

        temp.push(parent_of_parent);
        temp.push(parent);

        var siblings = con['siblings'];
        for (var elem in siblings) {

            siblings[elem]['type'] = "sibling";
            temp.push(siblings[elem]);
        }

        var children = con['children'];
        for (var elem in children) {
            children[elem]['type'] = "child";
            temp.push(children[elem]);
        }

        var initCommentHeight;
        var prevNode;
        contextTree.selectAll("circle")
            .data(temp)
            .enter()
            .append("circle")
            .attr("id", function(d) {
                return d['id'];
            })
            .attr("class", function(d) {
                return d['type'];
            })
            .attr("r", 10)
            .attr("cx", function(d) {
                if (d['type'] == 'parent_of_parent' && parent_of_parent != "") {
                    return (contextTreeContainer.width() / 5);
                } else if (d['type'] == 'parent') {
                    return (contextTreeContainer.width() / 5) * 2;
                } else if (d['type'] == 'sibling') {
                    return (contextTreeContainer.width() / 5) * 3;
                } else if (d['type'] == 'child') {
                    return (contextTreeContainer.width() / 5) * 4;
                } else {
                    console.log("No 'type'specified for Node" + d);
                    return 1000;
                }
            })
            .attr("cy", function(d, i) {
                if (d['type'] == 'parent_of_parent' && parent_of_parent != "") {
                    return  detailsHeight/2;
                } else if (d['type'] == 'parent') {
                    return  detailsHeight/2;
                } else if (d['type'] == 'sibling') {
                    if (d['id'] == comment['id']) {
                        initCommentHeight = (detailsHeight / (1 + siblings.length)) * (i - 1);
                    }
                    return (detailsHeight/(1+siblings.length)) * (i-1);
                } else if (d['type'] == 'child') {
                    return (detailsHeight/(1+children.length)) * (i-1 - siblings.length);
                } else {
                    console.log("No 'type'specified for Node" + d);
                    return 1000;
                }
            })
            .attr("fill", function(d){
                if (d['id'] == comment['id']) {
                    return "red";
                } else {
                    return "green";
                }
            })
            .on("click", function(d) {
               if (prevNode != undefined) {
                   if (prevNode.id == comment['id']){
                       d3.select(prevNode)
                           .attr("fill", "red");
                   } else {
                       d3.select(prevNode)
                           .attr("fill", "green");
                   }
               }
                prevNode = this;
                d3.select(prevNode)
                    .attr("fill", "violet");
                updateDetails2(d);
            });

        contextTree.selectAll("line")
            .data(temp)
            .enter()
            .append("line")
            .attr("id", function(d) {
                return d['type'];
            })
            .attr("x1", function(d){
                if (d['type'] == 'parent_of_parent') {
                    return 1000;
                } else if (d['type'] == 'parent' && parent_of_parent != "") {
                    return (contextTreeContainer.width() / 5);
                } else if (d['type'] == 'sibling') {
                    return (contextTreeContainer.width() / 5) * 2;
                } else if (d['type'] == 'child') {
                    return (contextTreeContainer.width() / 5) * 3;
                } else {
                    console.log("No 'type'specified for Node" + d);
                    return 1000;
                }
            })
            .attr("x2", function(d){
                if (d['type'] == 'parent_of_parent') {
                    return 1000;
                } else if (d['type'] == 'parent' && parent_of_parent != "") {
                    return (contextTreeContainer.width() / 5) * 2;
                } else if (d['type'] == 'sibling') {
                    return (contextTreeContainer.width() / 5) * 3;
                } else if (d['type'] == 'child') {
                    return (contextTreeContainer.width() / 5) * 4;
                } else {
                    console.log("No 'type'specified for Node" + d);
                    return 1000;
                }
            })
            .attr("y1", function(d){
                if (d['type'] == 'parent_of_parent') {
                    return  1000;
                } else if (d['type'] == 'parent' && parent_of_parent != "") {
                    return  detailsHeight/2;
                } else if (d['type'] == 'sibling') {
                    return  detailsHeight/2;
                } else if (d['type'] == 'child') {
                    return initCommentHeight;
                } else {
                    console.log("No 'type'specified for Node" + d);
                    return 100;
                }
            })
            .attr("y2", function(d, i){
                if (d['type'] == 'parent_of_parent') {
                    return  1000;
                } else if (d['type'] == 'parent' && parent_of_parent != "") {
                    return  detailsHeight/2;
                } else if (d['type'] == 'sibling') {
                    return (detailsHeight/(1+siblings.length)) * (i-1);
                } else if (d['type'] == 'child') {
                    return (detailsHeight/(1+children.length)) * (i-1 - siblings.length);
                } else {
                    console.log("No 'type'specified for Node" + d);
                    return 100;
                }
            })
            .attr("stroke-width", 2)
            .attr("stroke", "black");


        details1.selectAll("text")
            .data(lcomment)
            .enter()
            .append("text")
            .attr("x", margin.left)
            .attr("y", function(d, i) {
                return margin.top + i*50;
            })
            .text(function (d, i) {
                return "" + keys[i] + ":        " + d;
            })
            .attr("font-size", "20px")
            .attr("fill", "red");


        function updateDetails2(d) {
            // clear old details
            details2.selectAll("svg > g > *").remove();

            // var lkeys = Object.keys(d);
            // var ld = $.map(comment, function(value, index) {
            //     return [value];
            // });

            // add new details
            body2Container.html("<p>" + d['body'] + "</p>")

            delete d['body'];

            var counter = 0;
            for (var key in d) {
                if (d.hasOwnProperty(key)) {
                    details2.append("text")
                        .attr("x", margin.left)
                        .attr("y", margin.top + counter*50)
                        .text(key + ": " +d[key])
                        .attr("font-size", "20px")
                        .attr("fill", "red");
                                    }
                counter++;
            }

        }
    }
}
