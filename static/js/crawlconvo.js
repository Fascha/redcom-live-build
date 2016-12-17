
var walkcounter = 0;
var usercounter = 0;

var addOP = false;

function readJSON(input) {
    console.log(input);

    setupGraph();

    // svg.selectAll("circle.node").remove();
    // svg.selectAll("line.link").remove();

    var data = input;

    //OP

    var firstNode = data[0];
    var entry = firstNode['data']['children'][0]['data'];
    var out = {};
    out.name = entry.author;
    out.id = entry.name;
    out.created = entry.created;
    out.body = entry.title;
    out.score= entry.ups - entry.downs;
    discussion_url = entry.url;
    OP = out;

    if (addOP) {
        nodes.push(out);
    }
    // var a = document.createElement("a");
    // a.href = entry.url;
    // a.innerHTML = entry.url;
    // $("#preview").empty();
    // $("#preview").append(a);
    // $(a).embedly({
    //     query: {maxheight: 100}
    // });
    //
    // var title = document.createElement("a");
    // title.href = "http://reddit.com"+ entry.permalink;
    // title.target="_blank";
    // title.innerHTML = "<h4 class='subheader'>"+entry.title+"</h4>";
    // $("#topic_title").empty();
    // $("#topic_title").append(title);



    var convo = data[1];
    walkGraph(convo);

    // console.log(walkcounter);
    // console.log(usercounter);
}

function walkGraph(entry) {
    // console.log("walkGraph: ", entry);
    walkcounter++;
    if (entry instanceof Array) {
        entry.forEach(function(d) {
            walkGraph(d);
        });
    } else {
        for (var key in entry) {
            if (key == 'data' || entry[key] instanceof Object) {
                walkGraph(entry[key]);
            }
        }
    }

    checkIfUser(entry)
}

function checkIfUser(entry) {
    usercounter++;
    // console.log("checkIfUser: ", entry);

    var out = {};

    if (entry.hasOwnProperty('name') && entry.hasOwnProperty('id') && entry.hasOwnProperty('created')){
        out['name'] = entry['author'];
        out['id'] = entry['name'];
        out['parent_id'] = entry['parent_id'];
        out['created'] = entry['created'];
        out['body'] = entry['body'];
        out['score'] = entry['score'];
        nodes.push(out);
        getParentNode(out, addLink);
        addName(out);

    } else {
        //NOT A COMMENT
    }
}

function addName(user) {
    if (user.name in names) {
        names[user.name] += 1;
        nodecolor[user.name] = "red";
    } else {
        names[user.name] = 1;
    }
}

function getParentNode(user, fn) {
    nodes.forEach(function(node) {
        if (node.id === user.parent_id) {
            fn(user, node);
        }
        if (node.parent_id === user.id) {
            fn(node, user);
        }
    })
}


function addLink(source, target){
    var link = { "source" : source,
        "target" : target,
        "value" : 10};
    if (links.indexOf(link) == -1) {
        links.push(link);
        updateNetwork();
    }
}


function showError() {
    alert("ERROR WHILE LOADING DATA");
}


function buildNetwork(parent) {

    $("#first-level-vis").hide();
    $("#second-level-vis").show();

    var req = "https://www.reddit.com" + parent['permalink'] +".json?jsonp=?";

    console.log(req);
    $.ajax({
        dataType: "jsonp",
        url: req,
        success: readJSON,
        error: showError
    });
}


function loadSecondLevel(d){
    if (d['parent_id'].split("_")[0] == "t3") {
        addOP = true;
    }
    console.log(d);
    details1Container.empty();
    details1Container.append($("<p>Author: " + d['author'] + "</p>"));
    details1Container.append($("<p>Score: " + d['score'] + "</p>"));
    body1Container.html($("<p>" + d['body'] + "</p>"));

    treeContainer.empty();
    treeContainer.append(loading_gif);


    $.ajax({
        dataType: "json",
        url: "/get_comment/" + d['parent_id'].split("_")[1],
        success: buildNetwork
    });

}



