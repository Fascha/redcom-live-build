/**
 * Created by laurademleitner on 26.11.16.
 */

var loading_gif = new Image();
loading_gif.src = "/static/img/ajax-loader.gif";

$("#choose-sub").on("click", "li", function () {
    // $("#current-sub").html(this.id);
    $("#current-sub").empty();
    $("#current-sub").append(loading_gif);

    $.ajax({
        dataType: "json",
        url: "/get_subreddit/" + this.id.split("/")[1],
        success: populateSitebar
    });
});

function populateSitebar(data) {
    $("#current-sub").empty();
    $("#current-sub").html(this.url.split("/")[2]);
    var subSelection = $("#sub-selection");
    subSelection.empty();
    subSelection.on("click", "a", function () {
        console.log(this);
        $("#thread-title").empty();
        $("#thread-title").append(loading_gif);
        var url = "/get_thread/" + this.id;
        $.ajax({
            dataType: "json",
            url: url,
            success: mainVis
        });
    });


    $.each(data, function (id, thread) {
        var link = "<a href=\"#\" id='" + thread["permalink"].split("/")[4] + "'\>";
        // var link = "<a href='#'>";
        subSelection.append("<li>" + link + "Score: " + thread["score"] + "<br>Author: " + thread["author"] + "<br># Comments: " + thread["num_comments"] + "</a></li>");
    });


}







//
//     The good old days of dick pics.
//     https://www.reddit.com/r/funny/comments/5mdlqz/the_good_old_days_of_dick_pics/
//

//

//
// A drone has crashed into a Boeing 737-700 passenger plane, causing extensive damage to the giant jet as it came into land at Mozambique Airport.
// https://www.reddit.com/r/worldnews/comments/5mg4vp/a_drone_has_crashed_into_a_boeing_737700/
//



$("#thread-1").on("click", function() {
    // Even after removing myself from all possible distractions, doing absolutely nothing at all is a more attractive prospect than writing my assignment.
    // https://www.reddit.com/r/Showerthoughts/comments/5mfdm1/even_after_removing_myself_from_all_possible/

    // https://www.reddit.com/r/todayilearned/comments/5kwgpv/til_that_by_examining_highresolution_satellite/
    sendToLogger("sitebar thread-1 clicked");
    // resetEverything();

    updateThreadWarning("About 0.5 First level Comment per Author<br>High Percantage of Comments from OP<br>Thread Lifetime around 1 Day");
    $("#input-url").html("https://www.reddit.com/r/Showerthoughts/comments/5mfdm1/even_after_removing_myself_from_all_possible/");
    var req = "/get_thread/" + "5mfdm1";
    sliderInitialized = false;
    // $("#cards").show();
    // $("#timeline").show();
    // appendLoadingBars();

    $.ajax({
        beforeSend:  appendLoadingBars,
        dataType: "json",
        url: req,
        success: mainVis
    });
});

$("#thread-2").on("click", function() {
    // Donald Trump was asked if he could quote any Bible verses.
    // https://www.reddit.com/r/Jokes/comments/5mi006/donald_trump_was_asked_if_he_could_quote_any/

    // https://www.reddit.com/r/AskReddit/comments/5k64a5/people_who_tried_lcd_how_was_your_first/
    sendToLogger("sitebar thread-2 clicked");

    // updateThreadWarning("Gained Attention after hitting Front page (9h)<br>1 Very popular comment which snowballed<br>Thread Lifetime around 1 Day");
    var req = "/get_thread/" + "5k64a5";
    sliderInitialized = false;

    $.ajax({
        beforeSend:  appendLoadingBars,
        dataType: "json",
        url: req,
        success: mainVis
    });
});

$("#thread-3").on("click", function() {
    // Now that the PS4PRO has been out for 2 months, what is everybody's thoughts on it?
    // https://www.reddit.com/r/Games/comments/5mf50z/now_that_the_ps4pro_has_been_out_for_2_months/

    // https://www.reddit.com/r/gaming/comments/5o5m5c/real_sized_titan_in_berlins_hauptbahnhof/
    sendToLogger("sitebar thread-3 clicked");

    // updateThreadWarning("Very Few First Level Comments<br>Well Distributed Comment Tree<br>Thread Lifetime around 1 Day");
    var req = "/get_thread/" + "5o5m5c";
    sliderInitialized = false;


    $.ajax({
        beforeSend:  appendLoadingBars,
        dataType: "json",
        url: req,
        success: mainVis
    });
});

$("#thread-4").on("click", function() {
    // [AMA] Ich bin ein Pädophiler
    // https://www.reddit.com/r/de_IAmA/comments/4pxtfc/ama_ich_bin_ein_p%C3%A4dophiler/

    // https://www.reddit.com/r/gaming/comments/5k0023/didnt_expect_that/
    sendToLogger("sitebar thread-4 clicked");


    // updateThreadWarning("OP responded almost 2 months<br>Typical AMA Comment Tree<br>Very Long Thread Lifetime");
    var req = "/get_thread/" + "5k0023";
    sliderInitialized = false;


    $.ajax({
        beforeSend:  appendLoadingBars,
        dataType: "json",
        url: req,
        success: mainVis
    });
});

$("#thread-5").on("click", function() {
    //     [AMA] Ich bin der "WoW-Lehrer" und mein erster Schüler hat gestern in Minecraft Matura/Abi gemacht. Fragt mich alles!
// https://www.reddit.com/r/de_IAmA/comments/4naw1e/ama_ich_bin_der_wowlehrer_und_mein_erster_sch%C3%BCler/

    // https://www.reddit.com/r/movies/comments/5ltyko/legendary_film_composer_hans_zimmer_will_perform/
    sendToLogger("sitebar thread-5 clicked");

    // updateThreadWarning("1:5 Ratio of First-Level:Total Comments<br>Typical AMA Comment Tree<br>Very Long Thread Lifetime");
    var req = "/get_thread/" + "5ltyko";
    sliderInitialized = false;
    $("#cards").show();

    $.ajax({
        beforeSend:  appendLoadingBars,
        dataType: "json",
        url: req,
        success: mainVis
    });
});

$("#thread-6").on("click", function() {
    // A drone has crashed into a Boeing 737-700 passenger plane, causing extensive damage to the giant jet as it came into land at Mozambique Airport.
    // https://www.reddit.com/r/worldnews/comments/5mg4vp/a_drone_has_crashed_into_a_boeing_737700/


    //https://www.reddit.com/r/dataisbeautiful/comments/5pi9sn/my_year_in_facebook_messages_created_with_d3js_oc/
    sendToLogger("sitebar thread-6 clicked");

    // updateThreadWarning("Burst of Comments(5-8) from some Authors in under 1h<br>Typical AMA Comment Tree<br>Very Long Thread Lifetime");
    var req = "/get_thread/" + "5pi9sn";
    sliderInitialized = false;


    $.ajax({
        beforeSend:  appendLoadingBars,
        dataType: "json",
        url: req,
        success: mainVis
    });
});
