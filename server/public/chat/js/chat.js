var KEY_ENTER = 13;

var isRender = false;
var tokenId = rand();
var otherImage = "";

function rand() {
    return Math.random().toString(36).substr(2); // remove `0.`
}

$(document).ready(function() {

    // replace with your server url
    var server_url = "http://localhost:3000/";

    var $input = $(".chat-input"),
        $sendButton = $(".chat-send"),
        $messagesContainer = $(".chat-messages"),
        $messagesList = $(".chat-messages-list"),
        $effectContainer = $(".chat-effect-container"),
        $infoContainer = $(".chat-info-container"),

        messages = 0,
        bleeding = 100,
        isFriendTyping = false,
        incomingMessages = 0,
        lastMessage = "",
        selfSrc = "";

    //$(".content").css("opacity", "0");

    $(".chat-input-bar").velocity({
        translateY: "150px"
    }, 0);

    $(".avt-click").click(function() {

        for (var i = 0; i < $(".avt-click").length; i++) {
            $(".avt-click").eq(i).addClass("zoomToEmpty");
        }

        if ($(this).attr("data-index") == 0) {
            selfSrc = "img/avt_boy.png";
        } else if ($(this).attr("data-index") == 1) {
            selfSrc = "img/avt_boy_long.png";
        } else if ($(this).attr("data-index") == 2) {
            selfSrc = "img/avt_girl.png";
        } else if ($(this).attr("data-index") == 3) {
            selfSrc = "img/avt_girl_long.png";
        }

        $(".avt-click").one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
            function(e) {
                $(".avt-click").css("transform", "scale(0)");
                $(".avt-loading").css("opacity", "1");

                setTimeout(function() {

                    //Update online count
                    // $(".online-count").text(0);

                    $(".avt-click").css("display", "none");
                    $(".avt-choice").velocity({
                        backgroundColor: "#B3E5FC"
                    }, {
                        complete: function() {
                            $(".chat-window").css("z-index", "6");
                            $(".chat-input-bar").velocity({
                                translateY: "0"
                            }, {
                                duration: 1200,
                                easing: "easeInOutQuad"
                            });

                            isRender = true;

                        }
                    });
                }, 2000);


            });
    });

    var lipsum = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    function gooOn() {
        setFilter('url(#goo)');
    }

    function gooOff() {
        setFilter('none');
    }

    function setFilter(value) {
        $effectContainer.css({
            webkitFilter: value,
            mozFilter: value,
            filter: value,
        });
    }

    function addMessage(message, self) {

        var $messageContainer = $("<li/>")
            .addClass('chat-message ' + (self ? 'chat-message-self' : 'chat-message-friend'))
            .appendTo($messagesList);

        //console.log(self);
        //Add Image
        var $imageContainer = $("<div/>").addClass((self ? 'self-avt' : 'fri-avt')).appendTo($messageContainer);

        if (self) {
            var $image = $("<img/>").addClass("fitImage").attr("src", selfSrc).appendTo($imageContainer);
        } else {
            var $image = $("<img/>").addClass("fitImage").attr("src", otherImage).appendTo($imageContainer);
        }


        if (self) {
            $image.velocity({
                translateX: "50px",
            }, 0);
        } else {
            $image.velocity({
                translateX: "-50px",
            }, 0);
        }
        if (self) {
            setTimeout(function() {

                $image.velocity({
                    translateX: "0px",
                }, {
                    "duration": 500,
                    "easing": "easeInOutQuad"
                });

            }, 200);
        } else {
            $image.velocity({
                translateX: "0px",
            }, {
                "duration": 500,
                "easing": "easeInOutQuad"
            });
        }


        function urlify(text) {
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, function(url) {
                return '<a class="chatLink" href="' + url + '">' + url + '</a>';
            })
            // or alternatively
            // return text.replace(urlRegex, '<a href="$1">$1</a>')
        }


        var $messageBubble;
        if (self) {
            $messageBubble = $("<div/>")
                .addClass("arrow_box_self")
                .addClass('chat-message-bubble')
                .addClass('dont-break-out')
                .appendTo($messageContainer);

            //var text = "Find me at http://www.example.com and also at http://stackoverflow.com";
            //var html = ;
            $messageBubble.html(urlify(message));
            //console.log(isURL(message));

            //            if (isURL(message)) {
            //                $link = $("<a/>");
            //                $link.addClass("chatLink");
            //                $link.attr("href", message);
            //                $link.text(message);
            //                $link.appendTo($messageBubble);
            //            } else {
            //                $messageBubble.text(message);
            //            }

        } else {
            $messageBubble = $("<div/>")
                .addClass("arrow_box_fri")
                .addClass('chat-message-bubble')
                .appendTo($messageContainer);
            $messageBubble.text(message);
        }

        var oldScroll = $messagesContainer.scrollTop();
        $messagesContainer.scrollTop(9999999);
        var newScroll = $messagesContainer.scrollTop();
        var scrollDiff = newScroll - oldScroll;
        TweenMax.fromTo(
            $messagesList, 0.4, {
                y: scrollDiff
            }, {
                y: 0,
                ease: Quint.easeOut
            }
        );

        return {
            $container: $messageContainer,
            $bubble: $messageBubble
        };
    }

    function sendMessage() {
        var message = $input.text();

        if (message == "") return;

        lastMessage = message;

        socket.emit("send", {
            type: "chat",
            data: {
                msg: message,
                image: selfSrc,
                token: tokenId
            }
        });

        var messageElements = addMessage(message, true),
            $messageContainer = messageElements.$container,
            $messageBubble = messageElements.$bubble;

        var oldInputHeight = $(".chat-input-bar").height();
        $input.text('');
        updateChatHeight();
        var newInputHeight = $(".chat-input-bar").height();
        var inputHeightDiff = newInputHeight - oldInputHeight

        var $messageEffect = $("<div/>")
            .addClass('chat-message-effect')
            .append($messageBubble.clone())
            .appendTo($effectContainer)
            .css({
                left: $input.position().left - 12,
                top: $input.position().top + bleeding + inputHeightDiff
            });


        var messagePos = $messageBubble.offset();
        var effectPos = $messageEffect.offset();
        var pos = {
            x: messagePos.left - effectPos.left,
            y: messagePos.top - effectPos.top
        }

        var $sendIcon = $sendButton.children("i");
        TweenMax.to(
            $sendIcon, 0.15, {
                x: 30,
                y: -30,
                force3D: true,
                ease: Quad.easeOut,
                onComplete: function() {
                    TweenMax.fromTo(
                        $sendIcon, 0.15, {
                            x: -30,
                            y: 30
                        }, {
                            x: 0,
                            y: 0,
                            force3D: true,
                            ease: Quad.easeOut
                        }
                    );
                }
            }
        );

        gooOn();


        TweenMax.from(
            $messageBubble, 0.8, {
                y: -pos.y,
                ease: Sine.easeInOut,
                force3D: true
            }
        );

        var startingScroll = $messagesContainer.scrollTop();
        var curScrollDiff = 0;
        var effectYTransition;
        var setEffectYTransition = function(dest, dur, ease) {
            return TweenMax.to(
                $messageEffect, dur, {
                    y: dest,
                    ease: ease,
                    force3D: true,
                    onUpdate: function() {
                        var curScroll = $messagesContainer.scrollTop();
                        var scrollDiff = curScroll - startingScroll;
                        if (scrollDiff > 0) {
                            curScrollDiff += scrollDiff;
                            startingScroll = curScroll;

                            var time = effectYTransition.time();
                            effectYTransition.kill();
                            effectYTransition = setEffectYTransition(pos.y - curScrollDiff, 0.8 - time, Sine.easeOut);
                        }
                    }
                }
            );
        }

        effectYTransition = setEffectYTransition(pos.y, 0.8, Sine.easeInOut);

        // effectYTransition.updateTo({y:800});

        TweenMax.from(
            $messageBubble, 0.6, {
                delay: 0.2,
                x: -pos.x,
                ease: Quad.easeInOut,
                force3D: true
            }
        );
        TweenMax.to(
            $messageEffect, 0.6, {
                delay: 0.2,
                x: pos.x,
                ease: Quad.easeInOut,
                force3D: true
            }
        );

        TweenMax.from(
            $messageBubble, 0.2, {
                delay: 0.65,
                opacity: 0,
                ease: Quad.easeInOut,
                onComplete: function() {
                    TweenMax.killTweensOf($messageEffect);
                    $messageEffect.remove();
                    if (!isFriendTyping)
                        gooOff();
                }
            }
        );

        messages++;

        //if (Math.random() < 0.65 || lastMessage.indexOf("?") > -1 || messages == 1) getReply();
    }

    function getReply() {
        if (incomingMessages > 2) return;
        incomingMessages++;
        var typeStartDelay = 1000 + (lastMessage.length * 40) + (Math.random() * 1000);
        setTimeout(friendIsTyping, typeStartDelay);

        var source = lipsum.toLowerCase();
        source = source.split(" ");
        var start = Math.round(Math.random() * (source.length - 1));
        var length = Math.round(Math.random() * 13) + 1;
        var end = start + length;
        if (end >= source.length) {
            end = source.length - 1;
            length = end - start;
        }
        var message = "";
        for (var i = 0; i < length; i++) {
            message += source[start + i] + (i < length - 1 ? " " : "");
        };
        message += Math.random() < 0.4 ? "?" : "";
        message += Math.random() < 0.2 ? " :)" : (Math.random() < 0.2 ? " :(" : "");

        var typeDelay = 300 + (message.length * 50) + (Math.random() * 1000);

        //        setTimeout(function () {
        //            receiveMessage(message);
        //        }, typeDelay + typeStartDelay);

        setTimeout(function() {
            incomingMessages--;
            if (Math.random() < 0.1) {
                getReply();
            }
            if (incomingMessages <= 0) {
                friendStoppedTyping();
            }
        }, typeDelay + typeStartDelay);
    }

    function friendIsTyping() {
        if (isFriendTyping) return;

        isFriendTyping = true;

        var $dots = $("<div/>")
            .addClass('chat-effect-dots')
            .css({
                top: -30 + bleeding,
                left: 10
            })
            .appendTo($effectContainer);
        for (var i = 0; i < 3; i++) {
            var $dot = $("<div/>")
                .addClass("chat-effect-dot")
                .css({
                    left: i * 20
                })
                .appendTo($dots);
            TweenMax.to($dot, 0.3, {
                delay: -i * 0.1,
                y: 30,
                yoyo: true,
                repeat: -1,
                ease: Quad.easeInOut
            })
        };

        var $info = $("<div/>")
            .addClass("chat-info-typing")
            .text("Your friend is typing...")
            .css({
                transform: "translate3d(0,30px,0)"
            })
            .appendTo($infoContainer)

        TweenMax.to($info, 0.3, {
            y: 0,
            force3D: true
        });

        gooOn();
    }

    function friendStoppedTyping() {
        if (!isFriendTyping) return

        isFriendTyping = false;

        var $dots = $effectContainer.find(".chat-effect-dots");
        TweenMax.to($dots, 0.3, {
            y: 40,
            force3D: true,
            ease: Quad.easeIn,
        });

        var $info = $infoContainer.find(".chat-info-typing");
        TweenMax.to($info, 0.3, {
            y: 30,
            force3D: true,
            ease: Quad.easeIn,
            onComplete: function() {
                $dots.remove();
                $info.remove();

                gooOff();
            }
        });
    }

    function receiveMessage(message) {
        var messageElements = addMessage(message, false),
            $messageContainer = messageElements.$container,
            $messageBubble = messageElements.$bubble;

        TweenMax.set($messageBubble, {
            transformOrigin: "60px 50%"
        })
        TweenMax.from($messageBubble, 0.4, {
            scale: 0,
            force3D: true,
            ease: Back.easeOut
        })
        TweenMax.from($messageBubble, 0.4, {
            x: -100,
            force3D: true,
            ease: Quint.easeOut
        })
    }

    function updateChatHeight() {
        $messagesContainer.css({
            height: 460 - $(".chat-input-bar").height()
        });
    }

    $input.keydown(function(event) {
        if (event.keyCode == KEY_ENTER) {
            event.preventDefault();
            sendMessage();
        }
    });
    $sendButton.click(function(event) {
        event.preventDefault();
        sendMessage();
        // $input.focus();
    });
    $sendButton.on("touchstart", function(event) {
        event.preventDefault();
        sendMessage();
        // $input.focus();
    });

    $input.on("input", function() {
        updateChatHeight();
    });

    gooOff();
    updateChatHeight();

    //Socket
    var socket = io(server_url + "chat");
    // Add a connect listener
    socket.on('connect', function() {
        console.log('Connect successfully : Inner iframe');

        $.get(server_url + "client-count", function(res) {
            console.log("qweqw", res);
            $(".online-count").text(res);
        });

        socket.emit("send", {
            type: "chat",
            action: "online"
        });
    });

    socket.on('receive', function(payload) {
        if (payload.type !== "chat") return;

        if (payload.action === "online") {
            return $.get(server_url + "client-count", function(res) {
                console.log("qweqw", res);
                $(".online-count").text(res);
            });
        }

        if (isRender) {
            if (payload.data.token !== tokenId) {
                otherImage = payload.data.image;
                receiveMessage(payload.data.msg);
            }
        } else {
            console.log("not render");
        }
    });

});
