/**
 * Created by Fascha on 27.11.2016.
 */


// In this script all listeners and other page related elements get initialized
$(document).ready(function() {

    $("#timeline").hide();
    $("#second-level-vis").hide();


    $("#btn-back").on("click", function() {
        $("#first-level-vis").show();
        $("#second-level-vis").hide();
    });

    $("#btn-load").on("click", function() {
        console.log($("#input-url").val());

        var req = "/get_thread/" + $("#input-url").val().split("/")[6];
        console.log(req);

        sliderInitialized = false;

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

        $("#timeline").show();
        appendLoadingBars();

        $.ajax({
            dataType: "json",
            url: "/get_thread/5hw7wo",
            success: mainVis
        });
    });
});

