/**
 * Created by Fascha on 27.11.2016.
 */


// In this script all listeners and other page related elements get initialized
$(document).ready(function() {




    window.onclick = function(event) {
        sendToLogger();
        console.log(event);
        console.log(typeof event.target);
        if(event.target.id == ""){
            sendToLogger("click," + event.clientX + "," + event.clientY)
        } else {
            sendToLogger("click," + event.target.id);
        }
    };

    window.onkeypress = function(event){
        if(event.keyCode == 49) {
            sendToLogger("Task started");
        } else if(event.keyCode == 50) {
            sendToLogger("Task completed")
        }
    };



    $("#btn-reset").on("click", function() {
        sendToLogger("btn-reset clicked");
        resetEverything();
    });

    $("#btn-back").on("click", function() {
        // $("#first-level-vis").show();
        // $("#second-level-vis").hide();
        $('html, body').animate({
            scrollTop: $("#first-level").offset().top
        }, 1000);
    });

    $("#btn-load").on("click", function() {

        sendToLogger("btn-load clicked");
        sendToLogger("requested url: "+ $("#input-url").val());

        var req = "/get_thread/" + $("#input-url").val().split("/")[6];

        sliderInitialized = false;

        appendLoadingBars();

        $.ajax({
            dataType: "json",
            url: req,
            success: mainVis
        });
    });

    $("#btn-disable-zoom").on("click", function() {
        disableZoom();
    });

    $("#download-graphics").on("click", function() {
        sendToLogger("download-btn clicked");

        var svgElement = document.getElementById('svgd');
        var simg = new Simg(svgElement);
        simg.download('mainVis');

    });


    $("#btn-start-exploring").on("click", function(){

        $("#btn-start-exploring").hide("slow");
        $("#start-text").hide("slow");
        $("#main-content").show("slow");

    });

    $("#btn-test").on("click", function() {
        sendToLogger("btn-test clicked");

        resetEverything();
        sliderInitialized = false;

        updateThreadWarning("Comment/Author-Ratio about 2 <br>Below 15% First Level Comments<br>Thread Lifetime around 1 Day");

        $("#cards").show();
        $("#timeline").show();
        appendLoadingBars();

        $.ajax({
            dataType: "json",
            url: "/get_thread/5hw7wo",
            success: mainVis
        });
    });
});

