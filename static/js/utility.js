/**
 * Created by Fabia on 15.12.2016.
 */

function secondsToTime(secs)
{
    console.log(secs);
    secs = Math.round(secs);
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}



function populateCard(selector, heading, value, tooltip) {
    var id = heading.split(" ")[1].toLowerCase() + "-card-info";
    $(selector).empty();
    $(selector).append($("<div class='panel-body details-card'>")
        .append("<h4>" + heading + " <span class='glyphicon glyphicon-info-sign' id='" + id + "'></span></h4>")
        .append("<div class='details-value'><span class='percent'>" + value));

    console.log(id);
    console.log($(id));
    $("#" + id).attr("data-toggle", "tooltip").attr("title", tooltip).attr("data-placement", "bottom");

}


var rankingMode = 1;

function changeRankingMode() {
    if (rankingMode == 1) {
        rankingMode = 2;
    } else {
        rankingMode = 1;
    }
}


function appendLoadingBars() {
    $("#load-instructions").hide("slow");
    $("#first-level").show("fast");
    $("#information-center").show();
    $("#btn-start-exploring").hide("slow");
    $("#start-text").hide("slow");
    $("#main-content").show("slow");
    $("#slider-complete").hide();

    $("#tree").empty();
    $("#details-1").empty();
    $("#body-1").empty();
    $("#details-2").empty();
    $("#body-2").empty();

    // $("#second-level").hide();

    var loading_gif_1 = new Image();
    var loading_gif_2 = new Image();
    var loading_gif_3 = new Image();
    var loading_gif_4 = new Image();
    var loading_gif_main = new Image();
    loading_gif_1.src = "/static/img/ajax-loader.gif";
    loading_gif_2.src = "/static/img/ajax-loader.gif";
    loading_gif_3.src = "/static/img/ajax-loader.gif";
    loading_gif_4.src = "/static/img/ajax-loader.gif";
    loading_gif_main.src = "/static/img/big-loader.gif";

    $("#thread-title").empty();
    $("#thread-title").append(loading_gif_1);

    $("#authors-card").empty();
    $("#authors-card").append(loading_gif_4);

    $("#total-comments-card").empty();
    $("#total-comments-card").append(loading_gif);

    $("#first-level-comments-card").empty();
    $("#first-level-comments-card").append(loading_gif_2);

    $("#thread-lifetime-card").empty();
    $("#thread-lifetime-card").append(loading_gif_3);

    $("#main-vis").empty();
    $("#timeline-visualisation").empty();
    var lg = $("#loading-gif").append(loading_gif_main);
    lg.css("margin-top", "150px");
    lg.css("margin-bottom", "150px");
    lg.css("display", "block");
    lg.css("margin-left", "auto");
    lg.css("margin-right", "auto");

}

function resetEverything() {

    sliderInitialized = false;

    d3.select("body").selectAll("svg").remove();

    $("#timeline").hide();
    // $("#cards").hide();

    $("#time-since-last").empty();
    $("#timeline-visualisation").empty();
    // $("#main-vis").empty();
    $("#thread-title").empty();
    $("#thread-warning").empty();
    $("#details-1").empty();
    $("#details-2").empty();
    $("#tree").empty();
    $("#body-1").empty();
    $("#body-2").empty();


    $("#start-text").show();

}

function updateThreadWarning(text) {
    $("#thread-warning").empty();
    $("#thread-warning").append($("<div class='panel-body'><p><strong style='color: #333333'>" + text + "</strong></p></div>"));
}

function sendToLogger(text) {
    var logEntry;

    if (text != undefined){
        logEntry = new Date().getTime() + "," + text;
        console.log(text);
        $.ajax({
            url: "/log/" + logEntry
        });
    }

}