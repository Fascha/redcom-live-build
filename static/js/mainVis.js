/**
 * Created by Fascha on 22.11.16.
 */



var startDate,
    endDate;

var scoreScale;

var sliderInitialized = false;

var ldata;

var authors;

var opColor = "rgb(250, 150, 100)";

////////////////////////////////
////////    Variables   ////////
////////////////////////////////


var numOfCharsToShowInTooltip = 400;

var margin = {top: 30, right: 30, bottom: 50, left: 120},
    width,
    height = 600 - margin.top - margin.bottom;



var threadWarning = $("#thread-warning");
var threadTitle = $("#thread-title");

var op;

var bestScore = 0;
var bestReplies = 0;

function mainVis(data) {

    $("#main-vis").empty();
    d3.select("#main-vis").selectAll("img").remove();


    if (!sliderInitialized) {
        console.log("DATA: ", data);



        bestScore = 0;
        bestReplies = 0;

        //// CLEAN DATA / REMOVE NONE ////
        for (var comment in data) {
            if (data[comment]['author'] == "None") {
                delete data[comment];
                continue;
            }

            if (data[comment]['score'] >= bestScore) {
                bestScore = data[comment]['score'];
            }
            if (data[comment]['replies'] >= bestReplies) {
                bestReplies = data[comment]['replies'];
            }
        }

        //Setting up variables//
        var threadID = data[Object.keys(data)[0]]["permalink"].split("/")[4];

        $("#download-raw-data").empty();
        var raw_data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        $('<a href="data:' + raw_data + '" download="' + threadID + '.json" style="color: #ffffff;"><span class="glyphicon glyphicon-save" aria-hidden="true"></span> Click to <strong style="color: navy;">Download Raw Data</strong> <span class="glyphicon glyphicon-info-sign" id="raw-data-info"></span></a>').appendTo('#download-raw-data');

        var rawDataTooltip = "Raw Data of all Comments used for the Visualisation.";
        $("#raw-data-info").attr("data-toggle", "tooltip").attr("title", rawDataTooltip).attr("data-placement", "bottom");

        //
        $.ajax({
            dataType: "json",
            url: "/get_comment/" + threadID,
            success: processTitleAndCards
        });

        function processTitleAndCards(d) {
            op = d;
            console.log(op);
            threadTitle.empty();
            threadTitle.append($("<div class='panel-body'><h4><a target='_blank' href='http://reddit.com" + op['permalink'] + "'>" + op['title'] + " <img src='http://www.redditstatic.com/spreddit2.gif'></a></h4></div>"));
            var context_url = "/get_context/" + op['id'];
            $.ajax({
                dataType: "json",
                url: context_url,
                success: function (con) {
                    // ALL DATA AVAILABLE HERE!

                    drawEverything(data);
                    processCardData(con);
                }
            });
        }

    } else {
        drawEverything(data);
    }


}


function drawEverything(data) {
    width = d3.select("#main-vis").node().getBoundingClientRect().width - margin.left - margin.right;
    $("#slider-complete").show("slow");
    $("#main-vis-legend").show("slow");
    ldata = $.map(data, function (value) {
        return [value];
    });

    //
    // threadTitle.append($("<br><p>Time Since Last Comment: " + sinceLast['h'] + ":" + sinceLast['m'] + ":" + sinceLast['s'] + "</p>"))

    if (ldata.length < 100) {
        updateThreadWarning("Thread my not have enough Comments!");
        // threadWarning.empty();
        // threadWarning.append($("<div class='panel-body'><h4><strong style='color: red'>Thread my not have enough Comments!</strong></h4></div>"));
    } else {
        updateThreadWarning("Thread seems OK!");
        // threadWarning.empty();
        // threadWarning.append($("<div class='panel-body'>" + "SOME DETAILS WHY I CHOOSE THIS THREAD HERE!" + "</div>"));
    }


    ////////////////////////////////
    ////////////////////////////////
    ////////////////////////////////


    //clears the old visualisation and start text
    // d3.select("#start-text").remove();

    $("#start-text").hide();
    if (!sliderInitialized) {

        // d3.select("#vis-body").selectAll("svg").remove();
    } else {
        d3.select("#main-vis").selectAll("svg").remove();

    }


    if (!sliderInitialized) {
        var timeline = d3.select("#timeline-visualisation")
            .append("svg")
            .attr("width", width + margin.left)
            .attr("height", "50px")
            .append("g")
            .attr("transform", "translate(" + margin.left + ", 20)");

        var sinceLast = secondsToTime(Math.round((new Date() - new Date(ldata[ldata.length - 1]['created_utc'] * 1000)) / 1000));
        $("#time-since-last").empty();
        $("#time-since-last").append($("<div class='panel-body'><h5>" + "Time Since Last Comment: " + sinceLast['h'] + ":" + sinceLast['m'] + ":" + sinceLast['s'] + "</h5></div>"));

        // threadTitle.append($("<div class='panel-body'><h5>" + "Time Since Last Comment: " + sinceLast['h'] + ":" + sinceLast['m'] + ":" + sinceLast['s'] + "</h5></div>"));

    }

    var svg = d3.select("#main-vis")
        .append("svg")
        .attr("id", "svgd")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    ////////////////////////////////
    //////      AUTHORS     ////////
    ////////////////////////////////


    authors = {};
    for (var comment in data) {
        var author = data[comment]["author"];
        if (author in authors) {
            authors[author].push(data[comment]);
        } else {
            authors[author] = [data[comment]];
        }
    }

    var authorRanking = {};
    for (var author in authors) {
        var allComments = authors[author];
        var rankingTotal = 0;
        if (rankingMode == 1) {
            for (var i = 0; i < allComments.length; i++) {
                rankingTotal += allComments[i]["ranking"];
            }
        } else {
            for (var i = 0; i < allComments.length; i++) {
                rankingTotal += allComments[i]["ranking2"];
            }
        }
        authorRanking[rankingTotal] = author;
    }


    var rankingList = Object.getOwnPropertyNames(authorRanking).sort().reverse();


    var numOfAuthorsToShow = 10;
    var authorsToShow = [];
    for (var i = 0; i < numOfAuthorsToShow; i++) {
        authorsToShow.push(authorRanking[rankingList[i]]);
    }

    if (op['author'] in authorsToShow) {
        console.log("op already in best authors");
    } else {
        authorsToShow.push(op['author']);
    }

    console.log("Authors to show: ", authorsToShow);
    ////////////////////////////////
    ////////////////////////////////
    ////////////////////////////////


    scoreScale = d3.scale.linear()
        .domain([d3.min(ldata, function (d) {
            return d['score']
        }), d3.max(ldata, function (d) {
            return d['score']
        })])
        .range([5, 15]);

    var opacityScale = d3.scale.linear()
        .domain([d3.min(ldata, function (d) {
            return d['replies']
        }), d3.max(ldata, function (d) {
            return d['replies']
        })])
        .range([0.4, 1]);

    //////      Y-AXIS     ////////
    var yScale = d3.scale.ordinal()
        .domain(authorsToShow)
        .rangeBands([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var offset = (height / authorsToShow.length) / 2;

    var yMap = function (d) {
        if (typeof d === "string") {
            return yScale(d);
        }
        if (yScale(d["author"]) === undefined) {
            return -10000;
        } else {
            return yScale(d["author"]) + offset;
        }


    };

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(-10,0)")
        .call(yAxis);
    ////////////////////////////////

    //////      X-AXIS     ////////

    if (!sliderInitialized) {
        // if (startDate == undefined && endDate == undefined) {
        startDate = d3.min(ldata, function (d) {
                return d['created_utc'] - 600;
            }) * 1000;
        endDate = d3.max(ldata, function (d) {
                return d['created_utc'] + 600;
            }) * 1000;
    }


    var xScale = d3.time.scale()
        .domain([startDate, endDate])
        .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10);

    var xMap = function (d) {
        var temp = xScale(new Date(d["created_utc"] * 1000));
        if (temp >= 0) {
            return temp;
        } else {
            return -1000;
        }
        // return xScale(new Date(d["created_utc"] * 1000));
    };

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

    ////////////////////////////////


    ////////////////////////////////
    /////    Y-RANGE-BANDS    //////
    ////////////////////////////////

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            var tipText = "";
            tipText += "<strong>Score: <span style='color:red'>" + d["score"] + "</span></strong>";
            tipText += "<br><strong>Replies: <span style='color:red'>" + d["replies"] + "</span></strong>";
            tipText += "<p>" + d["body"].substring(0, numOfCharsToShowInTooltip);

            if (tipText.length > numOfCharsToShowInTooltip) {
                tipText += "...</p>";
            } else {
                tipText += "</p>";
            }

            tipText += "<p id='clickForDetails'><span style='color:red'>Click for details!</span></p>";
            return tipText;
        });

    svg.call(tip);

    function highlightLane(d, i) {
        d3.select(this)
            .attr("fill", "rgb(244, 163, 70)")
            .attr("fill-opacity", 0.5);
    }

    function restoreOldColor(d, i) {
        if (d == op['author']){
            d3.select(this)
                .attr("fill", opColor)
                .attr("fill-opacity", 0.5);
        } else if (i % 2 == 0) {
            d3.select(this)
                .attr("fill", "rgb(222, 222, 222)")
                .attr("fill-opacity", 0.5);
        } else {
            d3.select(this)
                .attr("fill", "rgb(166, 166, 166)")
                .attr("fill-opacity", 0.5);
        }
    }

    svg.selectAll("rect")
        .data(authorsToShow)
        .enter()
        .append("rect")
        .attr("width", width + margin.left)
        .attr("height", offset * 2)
        .attr("x", 0 - margin.left)
        .attr("y", function (d) {
            return yMap(d);
        })
        .attr("fill", function (d, i) {
            if (d == op['author']) {
                return opColor;
            } else if ((i % 2) === 0) {
                return "rgb(222, 222, 222)";
            } else {
                return "rgb(166, 166, 166)";
            }
        })
        .attr("fill-opacity", 0.5)
        .on("mouseover", highlightLane)
        .on("mouseout", restoreOldColor);

    ////////////////////////////////
    ////////////////////////////////
    ////////////////////////////////


    ////////////////////////////////
    //////     COMMENTS     ////////
    ////////////////////////////////

    if (!sliderInitialized) {
        timeline.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, 10)")
            .call(xAxis);

        timeline.selectAll("circle")
            .data(ldata)
            .enter()
            .append("circle")
            .attr("r", 2.5)
            .attr("cx", function (d) {
                return xMap(d);
            })
            .attr("cy", 0)
            .attr("fill", "green");
    }


    svg.selectAll("circle")
        .data(ldata)
        .enter()
        .append("circle")
        .attr("r", function (d) {
            return scoreScale(d['score']);
        })
        .attr("cx", function (d) {
            return xMap(d);
        })
        .attr("cy", function (d) {
            return yMap(d);
        })
        .attr("fill", function(d) {
            if (d['replies'] == bestReplies){
                return "rgb(83, 172, 83)";
            }
            if (d['score'] == bestScore) {
                return "rgb(82, 82, 224)";
            }
            return "firebrick";
        })
        .attr("fill-opacity", function (d) {
            return opacityScale(d['replies']);
        })
        .on("click", function (d) {
            console.log(d);
            sendToLogger("mainvis comment clicked: " + d['id']);

            $("#second-level").show("slow");
            // $(window).scrollTop($('#second-level').offset().top);
            $('html, body').animate({
                scrollTop: $("#second-level").offset().top
            }, 1000);
            d3.select(this)
                .attr("fill", "yellow");
            clickedCommentID = d['id'];
            parentOfClickedID = d['parent_id'];
            // console.log(d);
            loadSecondLevel(d);
            // secondLevelVis(d);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


    ////////////////////////////////
    ////////////////////////////////
    ////////////////////////////////


    ////////////////////////////////
    ///////  RADIO BUTTONS  ////////
    ////////////////////////////////

    d3.selectAll("#change-ranking input[name=mode]").on("change", function () {
        changeRankingMode();
        mainVis(data);
    });

    ////////////////////////////////
    ////////////////////////////////
    ////////////////////////////////


    ////////////////////////////////
    //////   x-rangeSlider   ///////
    ////////////////////////////////

    if (!sliderInitialized) {
        sliderInitialized = true;

        $("#slider-labels")
            .css("float", "center")
            // .css("margin-right" , margin.right)
            .css("margin-left", 0);

        $("#x-range-slider")
            .css("float", "center")
            // .css("margin-right" , margin.right)
            .css("margin-left", margin.left)
            .css("margin-right", "15px");

        $("#end-date")
            .css("text-align", "right")
            .css("background-color", "transparent");

        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
            minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'
                , '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39'
                , '40', '41', '44', '43', '44', '45', '46', '47', '48', '49', '50', '51', '54', '55', '54', '55', '56', '57', '58', '59'],
            seconds = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'
                , '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39'
                , '40', '41', '44', '43', '44', '45', '46', '47', '48', '49', '50', '51', '54', '55', '54', '55', '56', '57', '58', '59'];

        $("#x-range-slider").slider({
            range: true,
            min: startDate,
            max: endDate,
            values: [startDate, endDate],
            slide: function (event, ui) {
                var nsd = new Date(ui.values[0]);
                var ned = new Date(ui.values[1]);

                var dayStart = days[nsd.getUTCDay()],
                    monthStart = months[nsd.getUTCMonth()],
                    dateStart = nsd.getUTCDate(),
                    hourStart = hours[nsd.getUTCHours()],
                    minuteStart = minutes[nsd.getUTCMinutes()],
                    secondStart = seconds[nsd.getUTCSeconds()];
                $("#start-date").html("" + dayStart + " " + dateStart + " " + monthStart + " " + hourStart + ":" + minuteStart + ":" + secondStart);

                var dayEnd = days[ned.getUTCDay()],
                    monthEnd = months[ned.getUTCMonth()],
                    dateEnd = ned.getUTCDate(),
                    hourEnd = hours[ned.getUTCHours()],
                    minuteEnd = minutes[ned.getUTCMinutes()],
                    secondEnd = seconds[ned.getUTCSeconds()];
                $("#end-date").html("" + dayEnd + " " + dateEnd + " " + monthEnd + " " + hourEnd + ":" + minuteEnd + ":" + secondEnd);

                xScale.domain([nsd.getTime(), ned.getTime()]);

                svg.transition().duration(750)
                    .select(".x.axis").call(xAxis);

            },
            stop: function (event, ui) {
                console.log(ui.values);
                startDate = ui.values[0];
                endDate = ui.values[1];
                sendToLogger("new start date: " + startDate);
                sendToLogger("new end date: " + endDate);

                mainVis(data);
            }
        });

    }
}



////////////////////////////////
//////   populate cards  ///////
////////////////////////////////

function processCardData(d) {
    var quantile90 = Math.round(ldata.length * 0.9);
    var quantile90timestamp = ldata[quantile90]['created_utc'];
    var lifetimeAbsolute = secondsToTime(quantile90timestamp - op['created_utc']);
    populateCard("#authors-card", "Total Authors", Object.keys(authors).length, "The number of unique authors contributing to the thread");
    populateCard("#total-comments-card", "Total Comments", ldata.length, "The total number of comments retrieved from the thread");
    populateCard("#first-level-comments-card", "First Level Comments", d['children'].length, "First Level Comments are comments which directly reply to the original post");
    populateCard("#thread-lifetime-card", "Thread Lifetime", "" + lifetimeAbsolute['h'] + ":" + lifetimeAbsolute['m'] + ":" + lifetimeAbsolute['s'], "Time period in which the first 90% of all comments were posted");



    // data-toggle="tooltip" title="Hooray!"

    $('[data-toggle="tooltip"]').tooltip();
}

////////////////////////////////
////////////////////////////////
////////////////////////////////

