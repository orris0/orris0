(function (Popcorn) {  
	var overlay = "#video .overlay";
	var offsetX = 25;
    var USING_VIDEO_OVERLAYS = true;

	Popcorn.plugin("timebase", {
		_setup: function (track) {
		},
		
		frame: function (event, track) {
			if (!track.visible) {
				track._natives.show(track);
				track.visible = true;
			}
		},
		
		_teardown: function (track) {
			var vo = $(overlay).VideoOverlay("instance");
			vo.remove(track.id);
		},
		
		start: function (event, track) {
		},
		
		end: function (event, track) {
			if (track.visible) {
				track._natives.hide(track);
				track.visible = false;
			}
		},
		
		show: function (track) {
            if (USING_VIDEO_OVERLAYS) {
                var vo = $(overlay).VideoOverlay("instance");
                vo.add({id: track.id, text: track.text, callback: track.callback});
            }

			$(".resource-list").find("li[id=" + track.alert + "]").addClass("current");
			/*
			if ($(track.alert).hasClass("show-all")) {
				$(track.alert).addClass("current");
			}
			
			$(track.alert).css( { transform: "translateX(" + offsetX + "px)" } );
			$(track.alert).removeClass("x-hidden");
			setTimeout(function () {
				$(track.alert).css( { transform: "translateX(0)" } );
			}, 0);
			*/
		},
		
		hide: function (track) {
			var vo = $(overlay).VideoOverlay("instance");
			vo.remove(track.id);

			$(".resource-list").find("li[id=" + track.alert + "]").removeClass("current");
			/*
			if (!$(track.alert).hasClass("show-all")) {
				$(track.alert).removeClass("x-hidden current").css( { transform: "translateX(0)" } ).css( { transform: "translateX(" + offsetX + "px)" } ).animate( { _dummy: 0 }, { duration: 500, done: function (anim) { $(anim.elem).addClass("x-hidden"); } });
			} else {
				$(track.alert).removeClass("current");
			}
			*/
		}
	});
})(Popcorn);