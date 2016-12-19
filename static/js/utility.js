/**
 * Created by Fabia on 15.12.2016.
 */

function secondsToTime(secs)
{
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



function populateCard(selector, heading, value) {
    $(selector).empty();
    $(selector)
        .append($("<div class='panel-body details-card'>")
            .append("<h4>" + heading + "</h4>")
            .append("<div class='details-value'><span class='percent'>" + value));
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
    var loading_gif_1 = new Image();
    var loading_gif_2 = new Image();
    var loading_gif_3 = new Image();
    loading_gif_1.src = "/static/img/ajax-loader.gif";
    loading_gif_2.src = "/static/img/ajax-loader.gif";
    loading_gif_3.src = "/static/img/ajax-loader.gif";
    $("#thread-title").empty();
    $("#thread-title").append(loading_gif_1);

    $("#authors-card").empty();
    $("#authors-card").append(loading_gif);

    $("#total-comments-card").empty();
    $("#total-comments-card").append(loading_gif);

    $("#first-level-comments-card").empty();
    $("#first-level-comments-card").append(loading_gif_2);

    $("#thread-lifetime-card").empty();
    $("#thread-lifetime-card").append(loading_gif_3);
}

function resetEverything() {

    sliderInitialized = false;

    d3.select("body").selectAll("svg").remove();

    $("#timeline").hide();
    $("#cards").hide();

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
    $("#thread-warning").append($("<div class='panel-body'><h4><strong style='color: red'>" + text + "</strong></h4></div>"));
}