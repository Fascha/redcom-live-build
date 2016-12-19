/**
 * Created by Fascha on 27.11.2016.
 */


// In this script all listeners and other page related elements get initialized
$(document).ready(function() {

    $("#timeline").hide();
    $("#second-level-vis").hide();


    $("#btn-reset").on("click", resetEverything);

    $("#btn-back").on("click", function() {
        $("#first-level-vis").show();
        $("#second-level-vis").hide();
    });

    $("#btn-load").on("click", function() {


        var req = "/get_thread/" + $("#input-url").val().split("/")[6];

        sliderInitialized = false;

        $("#cards").show();
        $("#timeline").show();
        appendLoadingBars();

        $.ajax({
            dataType: "json",
            url: req,
            success: mainVis
        });
    });


    $("#btn-test").on("click", function() {
        sliderInitialized = false;

        updateThreadWarning("Comment/Author-Ratio about 2 <br>Below 15% First Level Comments<br>Thread Lifetime around 1 Day");

        $("#timeline").show();
        appendLoadingBars();

        $.ajax({
            dataType: "json",
            url: "/get_thread/5hw7wo",
            success: mainVis
        });
    });
});

