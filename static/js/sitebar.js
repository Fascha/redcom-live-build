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

