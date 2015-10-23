$(document).ready(function() {

    // replace with your server url
    var server_url = "http://localhost:3000/";

    //Painting
    var canvas, stage;
    var drawingCanvas;
    var oldPt;
    var oldMidPt;
    var title;
    var color;
    var stroke;
    var colors = "#000";
    var index;

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    //Socket
    window.socket = io(server_url);
    // Add a connect listener
    window.socket.on('connect', function() {
        //console.log('Connect successfully');
    });

    var xAxis = 4;
    window.socket.on('receive', function(payload) {
        // console.log(payload);


        if (payload.type === "draw") {
            drawingCanvas.graphics.clear().setStrokeStyle(10, 'round', 'round').beginStroke(payload.data.colors).moveTo(payload.data.midPt.x, payload.data.midPt.y).curveTo(payload.data.oldPt.x, payload.data.oldPt.y, payload.data.oldMidPt.x, payload.data.oldMidPt.y);
            stage.update();
        }
    });

    function colorToHex(color) {
        if (color.substr(0, 1) === '#') {
            return color;
        }
        var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

        var red = parseInt(digits[2]);
        var green = parseInt(digits[3]);
        var blue = parseInt(digits[4]);

        var rgb = blue | (green << 8) | (red << 16);
        return digits[1] + '#' + rgb.toString(16);
    };

    function updateMaxHeight() {
        canvas.width = $(window).width();
        canvas.height = $(window).height();
    }

    // Call updateMaxHeight when browser resize event fires
    $(window).on("resize", updateMaxHeight);

    $(".color-item .inner").click(function() {
        $(".color-item").css("border", "none");
        $(this).parent().css("border", "2px solid #fe8a00");
        $(".color-item").removeClass('bounceIn');

        colors = $(this).children("div").css("background-color");
        colors = colorToHex(colors);
        setTimeout(function() {
            $(".color_list").css("display", "none");
        }, 500);


    });

    $(".color-item").css("opacity", "0");

    $(".color-tool").click(function() {
        $(".color_list").css("display", "block");

        $(".color-item").css("opacity", "1");
        $(".color-item").addClass("bounceIn");

        $(".color-item").one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
            function(e) {
                $(".color-item").removeClass('bounceIn');
            });
    });

    $(".color-clear").click(function() {
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    });


    function init() {
        canvas = document.getElementById("myCanvas");
        canvas.width = $(window).width();
        canvas.height = $(window).height();

        index = 0;
        // colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];

        //check to see if we are running in a browser with touch support
        stage = new createjs.Stage(canvas);
        stage.autoClear = false;
        stage.enableDOMEvents(true);

        createjs.Touch.enable(stage);
        createjs.Ticker.setFPS(24);

        drawingCanvas = new createjs.Shape();

        stage.addEventListener("stagemousedown", handleMouseDown);
        stage.addEventListener("stagemouseup", handleMouseUp);


        stage.addChild(drawingCanvas);
        stage.update();
    }

    function handleMouseDown(event) {
        if (!event.primary) {
            return;
        }
        if (stage.contains(title)) {
            stage.clear();
            stage.removeChild(title);
        }

        color = colors;
        //stroke = Math.random() * 30 + 10 | 0;
        stroke = 10;
        oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
        oldMidPt = oldPt.clone();
        stage.addEventListener("stagemousemove", handleMouseMove);
    }

    function handleMouseMove(event) {
        //console.log(colors);
        if (!event.primary) {
            return;
        }
        var midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);

        drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(colors).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

        socket.emit("send", {
            type: "draw",
            data: {
                colors: colors,
                midPt: midPt,
                oldPt: oldPt,
                oldMidPt: oldMidPt
            }
        });

        oldPt.x = stage.mouseX;
        oldPt.y = stage.mouseY;

        oldMidPt.x = midPt.x;
        oldMidPt.y = midPt.y;

        stage.update();
    }

    function handleMouseUp(event) {
        if (!event.primary) {
            return;
        }
        stage.removeEventListener("stagemousemove", handleMouseMove);
    }

    init();


    if ($(window).width() < 700) {
        $(".dev_info").hide();
    }

    $(".text-dev").typed({
        strings: ["front-end by <a class='contact_url' href='https://www.linkedin.com/in/choungchamnab'>CHOUNG CHAMNAB</a> ^3000back-end by <a class='contact_url' href='https://github.com/Joden-Lay'>DOUNG EANGLAY</a>"],
        typeSpeed: 100
    });
});
