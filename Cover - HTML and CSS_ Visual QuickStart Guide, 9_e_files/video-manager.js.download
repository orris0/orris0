define(["bootstrap-dialog", "database", "imagesloaded", "common", "bootstrap-notify", "videojs", "videojs-markers", "jquery.onscreen", "jquery.scrollTo", "iframe-holder", "jquery.ui"], function (BootstrapDialog, Database, imagesLoaded, Common) {

	// NOTE: I don't understand why I couldn't use this.waitingForAutoAdvance; somehow the instance of VideoManager passed into iframe-holder wasn't the same (!)

	String.prototype.toHHMMSS = function () {
		var sec_num = parseInt(this, 10);
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours < 10) { hours   = "0" + hours; }
		if (minutes < 10) { minutes = "0" + minutes; }
		if (seconds < 10) { seconds = "0" + seconds; }

		var time = (hours == "00" ? "" : hours + ":")
			+ (minutes == "00" && hours == "00" ? "" : minutes)
			+ ":" + seconds;

		return time;
	};

	function HashInURL (url) {
		if (url) {
			var n = url.lastIndexOf("#");
			if (n != -1) return url.substr(n);
			else return "";
		} else {
			return "";
		}
	}

	function URLWithoutHash (url) {
		if (url === undefined) return url;

		// eliminate relative path notations
		url = url.replace(/^\.\.\//, "");

		// change Habitat's .xhtml to .html
		url = url.replace(/\.xhtml/, ".html");

		if (url) {
			var n = url.lastIndexOf("#");
			if (n != -1) return url.substr(0, n);
			else return url;
		} else
			return url;
	}

	function URLPageOnly (url) {
		if (url) {
			var n = url.lastIndexOf("/");
			if (n != -1) return url.substr(n + 1);
			else return url;
		} else
			return url;
	}

	function iFrameElementsOnScreen (elements, iframe) {
		var visible = [];
		var $iframe = $(iframe);

		// NOTE: iOS fix has to account for scrolling because getBoundingClientRect doesn't
		var h = $(window).height() + $(window).scrollTop();//$(".the-iframe-holder").scrollTop();

		for (var i = 0; i < elements.length; i++) {
			var elem = elements[i];
			var rect = elem.getBoundingClientRect();
			if ( (rect.top >= 0 && rect.top <= h) ||
				(rect.bottom >= 0 && rect.bottom <= h) ||
				(rect.height >= h && rect.top <= h && rect.bottom >= h)) {
				visible.push(elem);
			}
		}

		return $(visible);
	}

	function onPlayContent (element, options) {
		var depth = options.depth;

		if (options.markCurrent) {
			$("#video").VideoManager("markItemCompleted", options.markCurrent);
		}

		var opts = {};
		if (options.options) opts = options.options;

		// bit of a calling kludge here:
		$("#video").VideoManager("playFromTOC", depth, opts);
	}

	// rather than having to add this custom button to the video.js build (in v4 at least), I just added the button manually (below)
	/*
	videojs.BackButton = videojs.Button.extend({});

	videojs.BackButton.prototype.buttonText = 'Back 10';

	videojs.BackButton.prototype.buildCSSClass = function (){
		return 'vjs-back-button ' + videojs.Button.prototype.buildCSSClass.call(this);
	};

	videojs.BackButton.prototype.onClick = function (){
		var t = this.player().currentTime();
		this.player().currentTime(t - 10);
	};
	*/

	function getParameterByName (loc, name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(loc);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	function throttle(fn, threshhold, scope) {
		threshhold || (threshhold = 250);
		var last,
			deferTimer;
		return function () {
			var context = scope || this;

			var now = +new Date,
				args = arguments;
			if (last && now < last + threshhold) {
				// hold on to it
				clearTimeout(deferTimer);
				deferTimer = setTimeout(function () {
					last = now;
					fn.apply(context, args);
				}, threshhold);
			} else {
				last = now;
				fn.apply(context, args);
			}
		};
	}

	function decodeEntities (encodedString) {
		var textArea = document.createElement('textarea');
		textArea.innerHTML = encodedString;
		return textArea.value;
	}

	function iOSversion () {
		if (/iP(hone|od|ad)/.test(navigator.platform)) {
			// supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
			var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
			return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
		}

		/* worked fine on my Safari 10.0.1, so disable this
		if (/MacIntel/.test(navigator.platform)) {
			if ( /10\.0\.1 Safari/.test(navigator.appVersion) ) {
				return [10];
			}
		}
		*/
	}

	function clickCrossSell () {
		console.log("ok");
	}

	var totalVideoTime = undefined;
	var lastVideoQuartile = undefined;

	$.widget("que.VideoManager", {
		_create: function () {
			this.initialize(this.options.toc, this.options.el, this.options.player, this.options.markers, this.options.options);
		},

		initialize: function (toc, el, player, markers, options) {
			this.toc = toc;
			this.el = el;
			this.markers = markers;
			this.player = player;
			this.name = "Larry";
			this.options = options;
			this.initialPageLoad = false;
			this.markerOptions = {
				markers: [],
				markerStyle: {
					"width": "8px",
					"background-color": "rgb(218, 197, 93)"
				},
				markerTip: {
					display: true,
					text: function (marker) {
						return marker.text;
					}
				},
				onMarkerClick: $.proxy(this.onClickTimelineMarker, this)
			};

			if (options.title)
				document.title = options.title;

			Database.initialize(toc, options.title, $.proxy(this.onDatabaseUpdate, this));
			Database.setPageLimit(options.pageLimited);
			if (options.pageLimited) {
				this.registeredCustomerCheck(function (registered) {
					Database.setIsJustVisitingCustomer(!registered);
				});
			}

			$(".toc#contents-pane").TOCTree("setStatus", Database.getItems());

			this.updateProgress();

			this.pop = Popcorn(el, {frameAnimation: true});

			/*
			 var backButton = new videojs.BackButton(this.player);
			 this.player.controlBar.addChild(backButton);
			 */

			// add the Back Button manually
			var backButton = new videojs.Button(this.player);
			backButton.addClass("vjs-back-button");
			backButton.on("click", function () {
				var t = this.player().currentTime();
				this.player().currentTime(t - 10);
			});
			this.player.controlBar.addChild(backButton);

			var transcriptButton = new videojs.Button(this.player);
			transcriptButton.addClass("vjs-transcript-button");
			transcriptButton.on("click", $.proxy(this.onToggleTranscript, this));
			this.player.controlBar.addChild(transcriptButton);

			if (this.options && this.options.allowNotes) {
				var noteButton = new videojs.Button(this.player);
				noteButton.addClass("vjs-note-button");
				noteButton.on("click", $.proxy(this.showNotesPanel, this));
				this.player.controlBar.addChild(noteButton);
			}

			//  NOTE: Not sure why this stopped working and I had to switch to the straight HTML5 event
//			this.player.on("play", $.proxy(this.onVideoStarted, this));
			$("video")[0].addEventListener("play", $.proxy(this.onVideoStarted, this));

			this.player.on("ended", $.proxy(this.onVideoEnded, this));
			this.player.on("timeupdate", $.proxy(this.onVideoTimeUpdate, this));
			this.player.on("loadedmetadata", $.proxy(this.onLoadedMetadata, this));
			this.player.on("error", $.proxy(this.onVideoError, this));

			$(".toc#contents-pane").on("playvideo", onPlayContent).on("closesearch", $.proxy(this.onCloseSearch, this));

			$(".toc#contents-pane").on("downloadvideo", $.proxy(this.onDownloadVideo, this));

			$(".toc#contents-pane").on("showSelectedUpdates", $.proxy(this.showSelectedUpdates, this));

			window.onpopstate = function (event) {
				var loc = document.location.search;
				$("#video").VideoManager("tryToGotoLocationSearch", loc);
			};

			$(window).scroll($.proxy(this.onScrollContent, this));

			this.player.markers(this.markerOptions);

			this.currentIndex = undefined;

			this.trackID = 1;
			this.busyScrolling = false;
			this.waitingForAutoAdvance = false;
			this.waitingForIFrameToLoad = false;

			this.registerGoogleAnalytics(this.options.title);
		},

		instance: function () {
			return this;
		},

		getCurrentIndex: function () {
			return this.currentIndex;
		},

		currentItemIsVideo: function () {
			if (this.currentIndex != undefined) {
				return this.toc[this.currentIndex].video != undefined;
			} else {
				return false;
			}
		},

		currentItemHasContent: function () {
			if (this.currentIndex != undefined) {
				return this.toc[this.currentIndex].src != undefined;
			} else {
				return false;
			}
		},

		currentItemIsCompletable: function () {
			if (this.iframe) {
				return this.iframe.iFrameHolder("instance").isCompletable();
			}
			return false;
		},

		currentItemIsComplete: function () {
			if (this.iframe) {
				var c = this.iframe.iFrameHolder("instance").isComplete();
				return c;
			}
			return false;
		},

		setCurrentIndex: function (index) {
			// THEORY: when switching, mark the current section completed (should probably be: have we scrolled past everything)
			if (!this.currentItemIsVideo() && this.currentItemHasContent()) {
				// THEORY: the item we're on has programmatic completion status
				if (this.currentItemIsCompletable()) {
					var complete = this.currentItemIsComplete();
					if (complete) {
						this.markItemCompleted(this.currentIndex);
					} else {
						this.markItemIncomplete(this.currentIndex);
					}
				} else {
					if (this.currentIndex != undefined && this.currentIndex != index) {
						this.markItemCompleted(this.currentIndex);
					}

					// THEORY: consecutive sections (of non-video content) are marked complete when going from section to section
					if (index == this.currentIndex + 1) {
						this.markItemCompleted(this.currentIndex);
					}
				}

				if (index != undefined) {
					this.markItemStarted(index);
				}
			}

			this.currentIndex = index;

			this.updateUI();

			this.saveCurrentVideoIndex();
		},

		saveCurrentVideoIndex: function () {
			Database.saveCurrentIndex(this.currentIndex);
		},

		onVideoTimeUpdate: function (event) {
			// highlight and scroll to current transcript position
			var t = this.player.currentTime();

			// track video progress via analytics (25%, 50%, 75%)
			if (totalVideoTime != undefined) {
				var pct = t / totalVideoTime;
				var quartile = Math.floor(pct / .25);
				if (quartile > 0 && quartile < 4 && quartile != lastVideoQuartile) {
					lastVideoQuartile = quartile;
					var file = event.target.currentSrc;
					ga("send", "event", "video", "progress-" + (quartile * 25) + "%", file);
				}
			}

			if (this.hasTranscript) {
				var me = this;
				var p = this.element.find(".video-transcript p");
				p.removeClass("current");
				p.each(function (index, item) {
					var el = $(item);
					var begin = el.attr("data-begin");
					var end = el.attr("data-end");
					if (t > begin && t < end) {
						el.addClass("current");
						me.element.find(".video-transcript").scrollTo(el, 500, { interrupt: true });
						return false;
					}
				});
			}

			this.saveCurrentVideoTime();
		},

		saveCurrentVideoTime: function () {
			var t = this.player.currentTime();
			Database.saveCurrentTime(t);
		},

		getCurrentVideoTime: function () {
			return Database.getCurrentTime();
		},

		tryToGotoLocationSearch: function (loc) {
			// check for link from query parameter
			var link = getParameterByName(loc, "link");
			if (link) {
				this.playFromTOC(link, {pause: true, history: false, time: this.getCurrentVideoTime()});
				return true;
			}
			return false;
		},

		loadMostRecentVideo: function () {
			var found = this.tryToGotoLocationSearch(location.search);

			var index = Database.getCurrentIndex();

			this.initialPageLoad = true;

			if (index == undefined) {
				this.loadFirstVideo();
			} else if (!found) {
				this.playFromTOC(index, {pause: true, time: this.getCurrentVideoTime()});
			}
		},

		loadFirstVideo: function () {
			var index = this.getFirstVideoFromTOC();

			if (index == undefined) {
				index = 0;
			}

			this.playFromTOC(index, {pause: true});
		},

		playFirstVideo: function () {
			var index = this.getFirstVideoFromTOC();

			this.playFromTOC(index, {});
		},

		playFromTOC: function (index, options) {
			totalVideoTime = undefined;
			lastVideoQuartile = undefined;

			if (options && options.skipToNextSource) {
				while (index < this.toc.length && URLWithoutHash(this.toc[index].src) == options.previousSource) {
					index++;
				}

				if (index >= this.toc.length) return;
			}

			if (options && (options.history == undefined || options.history == true)) {
				var staging = "";
				if (window.location.search.indexOf("staging") != -1) {
					staging = "&staging";
				}
				history.pushState(null, null, "?link=" + index + staging);
			}

			this.syncTOCToContent(index);

			if (Database.isJustVisitingCustomer()) {
				var limited = this.pageIsLimited(index);

				if (limited) {
					this.blockPage(true);
				} else {
					if (this.pageHasCost(index)) {
						this.recordPageView(index);
					}
					this.blockPage(false);
				}
			}

			var src = this.toc[index].src;

			if (this.toc[index].disabled) {
				src = "paywall.html?index=" + index;
			} else {
				this.sendGoogleAnalytics(this.toc[index].desc);
			}

			// if this is iframe content, open it now; otherwise, it's video
			if (src) {
				if (this.toc[index].class) {
					options.class = this.toc[index].class;
				}

				this.playExtraFromTOC(index, options);

				$(".iframe-holder").show();
				$(".video-holder").hide();

				return;
			}

			// iframe content exits; video-only from here down:

			if (this.iframe && this.iframe.iFrameHolder) {
				try {
					this.iframe.iFrameHolder("clearContent");
				} catch (e) {
					// no clearContent function
				}
			}

			while (index < this.toc.length && !this.toc[index].video) {
				index++;
			}

			if (index >= this.toc.length) return;

			var src = this.toc[index].video;

			// NOTE: commented this out; it broke in iOS 11 (10/5/2017)
			// var dontUseiOS10Patch = $("html").hasClass("dontUseiOS10Patch");
			// var alwaysUseRedirect = $("html").hasClass("use-redirect");

			$("video").attr("crossorigin", null);

			if (src.indexOf(".mov") != -1 || src.indexOf(".mp4") != -1) {
				// NOTE: commented this out; it broke in iOS 11 (10/5/2017)
				/*
				var ver = iOSversion();
				if (alwaysUseRedirect || (ver && ver[0] >= 10 && !dontUseiOS10Patch)) {
					this.playRedirectedURL(src);
				} else {
					this.player.src({type: "video/mp4", src: src});
				}
				*/
				this.player.src({type: "video/mp4", src: src});
			} else {
				// NOTE: commented this out; it broke in iOS 11 (10/5/2017)
				/*
				var ver = iOSversion();
				console.log("vers: " + ver);

				if (alwaysUseRedirect || (ver && ver[0] >= 10 && !dontUseiOS10Patch)) {
					this.playRedirectedURL(src + ".mp4");
				} else {
					this.player.src([
						{type: "video/mp4", src: src + ".mp4"},
						{type: "video/webm", src: src + ".webm"},
						{type: "video/ogg", src: src + ".ogv"}
					]);
				}
				*/
				this.player.src([
					{type: "video/mp4", src: src + ".mp4"},
					{type: "video/webm", src: src + ".webm"},
					{type: "video/ogg", src: src + ".ogv"}
				]);
			}

			if (options && options.time) {
				this.player.currentTime(options.time);
			}

			$(".iframe-holder").hide();
			$(".video-holder").show();

			$("#main_video").show();

			if (options && options.pause) {
			} else {
				this.player.play();
			}

			this.setCurrentIndex(index);

			var showAllMarkers = options && options.showAllMarkers;

			this.addMarkers(showAllMarkers);

			this.removeAllTriggers();
			this.addTriggersForThisVideo();

			this.onNewContentShowing();
		},

		// THEORY: links within the epub need to be overridden so the iframe src gets updated and the location bar stays current
		triggerInternalLink: function (href) {
			var this_href = URLWithoutHash(href);

			if (this_href) {
				// try to find where this internal link is in the toc and go there
				for (var i = 0; i < this.toc.length; i++) {
					// check epub content
					var other_href = URLWithoutHash(this.toc[i].src);
					if (other_href && other_href.indexOf(this_href) != -1) {
						var hash = VideoManager.HashInURL(href);
						this.playFromTOC(i, {hash: hash});
						break;
					}
					// check video content
					other_href = URLWithoutHash(this.toc[i].video);
					if (other_href && other_href.indexOf(this_href) != -1) {
						this.playFromTOC(i, {});
						break;
					}
				}
			} else {
				var iframe = $("iframe").eq(0);

				this.scrollToHash(iframe, {hash: href}, false);
			}
		},

		findInternalLink: function (href) {
			var this_href = URLWithoutHash(href);

			if (this_href) {
				// try to find where this internal link is in the toc and go there
				for (var i = 0; i < this.toc.length; i++) {
					// check epub content
					var other_href = URLWithoutHash(this.toc[i].src);
					if (other_href && other_href.indexOf(this_href) != -1) {
						return true;
					}
					// check video content
					other_href = URLWithoutHash(this.toc[i].video);
					if (other_href && other_href.indexOf(this_href) != -1) {
						return true;
					}
				}
			}

			return false;
		},

		getTOCNames: function (list) {
			for (var j = 0; j < list.length; j++) {
				var this_href = list[j].href;

				// if the hint is in the format "Lesson 1.1 | Learn how JavaScript is used" only use the part after the | separator to look for it in the TOC
				if (this_href.indexOf("|") != -1) {
					this_href = this_href.substr(this_href.indexOf("|") + 1).trim();
				}

				var title = undefined;
				for (var i = 0; i < this.toc.length; i++) {
					// check epub content
					var other_href = URLWithoutHash(this.toc[i].src);
					if (other_href && other_href.indexOf(this_href) != -1) {
						title = this.toc[i].desc;
						break;
					}

					// check video content
					other_href = URLWithoutHash(this.toc[i].video);
					if (other_href && other_href.indexOf(this_href) != -1) {
						title = this.toc[i].desc;
						break;
					}

					// check TOC descriptions
					if (this_href == this.toc[i].desc) {
						// use the full hint name if it has a | separator
						if (list[j].href.indexOf("|") != -1)
							title = list[j].href;
						else
							title = this_href;
						// if this is a video TOC entry, link to it; otherwise, use the next TOC entry
						if (this.toc[i].video)
							list[j].href = this.toc[i].video;
						else
							list[j].href = this.toc[i + 1].video;
						break;
					}
				}

				if (title != undefined) {
					list[j].title = title;
				}
			}

			return list;
		},

		onDoneScrolling: function () {
			this.busyScrolling = false;
		},

		scrollToHash: function (iframe, options, immediate) {
			var index, hash;

			if (options.hash == undefined) {
				if (options.index == undefined) {
					index = this.currentIndex;
				} else {
					index = options.index;
				}

				if (this.toc[index])
					hash = VideoManager.HashInURL(this.toc[index].src);
			} else {
				hash = options.hash;
			}

			immediate = (immediate == undefined) ? false : immediate;

			var el = iframe ? iframe.contents().find(hash) : [];
			var dest = 0;

			if (iframe && iframe.contents()) {
				var el = iframe.contents().find(hash);

				// if there's no #hashtag in the url or on the page, just navigate to the first non-button
				if (!el.length) {
					el = iframe.contents().find("body").children("*:not(.button)").first();
				}

				if (el.length) {
					var top = el.offset().top;
					dest = top - 30;

					if (this.initialPageLoad == false) {
						el.attr("tabindex", -1).focus();
					}

				}
			}

			this.initialPageLoad = false;

			/*
			// kludge for iOS scrolling (I don't like this one bit)
			var scrollingDOM;
			if ($(".the-iframe-holder").height() == $("iframe").height()) {
				// desktop
				scrollingDOM = iframe.contents().find("html,body");
			} else {
				// iOS
				scrollingDOM = $(".the-iframe-holder");
			}
			*/
			scrollingDOM = $(window);

			if (immediate) {
				scrollingDOM.scrollTop(dest);
			} else {
				// this should stop it from overriding the scroll-to-hash that comes next with an actual hash
				if (dest != 0)
					this.busyScrolling = true;
					scrollingDOM.stop().animate({scrollTop: dest}, {
						duration: 1000,
						complete: $.proxy(this.onDoneScrolling, this)
					});
			}
		},

		onIFrameLoaded: function (iframe) {
			this.waitingForAutoAdvance = false;
			this.waitingForIFrameToLoad = false;

			this.onNewContentShowing(iframe);
		},

		onNewContentShowing: function (iframe) {
			$("#comments-panel").Comments("showCommentIconsInIframe", iframe);
			$("#notes-panel").Notes("showNoteIconsInIframe", iframe);
		},

		showLoading: function (note) {
			//console.log("+1 " + note);
			var d = $(".loading-indicator").data("show-count");
			if (d == undefined) d = 1;
			else d += 1;

			$(".loading-indicator").data("show-count", d);

			if (d > 0) $(".loading-indicator").show();
			else $(".loading-indicator").hide();
		},

		hideLoading: function (note) {
			//console.log("-1 " + note);
			var d = $(".loading-indicator").data("show-count");
			if (d == undefined || d < 0) d = 0;
			else d -= 1;

			$(".loading-indicator").data("show-count", d);

			if (d > 0) $(".loading-indicator").show();
			else $(".loading-indicator").hide();
		},

		addIFrame: function (params) {
			var src = this.toc[params.index].src;

			if (this.toc[params.index].disabled) {
				src = "paywall.html?index=" + params.index;
			}

			if (this.iframe == undefined) {
				var iframe = $("<div>").iFrameHolder({
					manager: this,
					src: src,
					index: params.index,
					scrollTo: params.scrollTo,
					infinite_scrolling: this.options.infinite_scrolling,
					hash: params.hash,
					highlight: params.highlight,
					type: params.type,
					disabledContent: params.disabledContent,
					class: params.class
				});

				iframe.appendTo(".iframe-holder");

				iframe.on("jump", onPlayContent);

				this.iframe = iframe;
			} else {
				var options = {
					manager: this,
					src: src,
					index: params.index,
					scrollTo: params.scrollTo,
					infinite_scrolling: this.options.infinite_scrolling,
					hash: params.hash,
					highlight: params.highlight,
					type: params.type,
					disabledContent: params.disabledContent,
					class: params.class
				};

				this.waitingForIFrameToLoad = true;
				this.iframe.iFrameHolder("loadNewContent", options);
			}
		},

		playExtraFromTOC: function (index, options) {
			var reloadAnyway = false;

			if (options == undefined) options = {};
			if (options.replaceAll == undefined) options.replaceAll = true;

			if (options.replaceAll == true) {
				// check to see if any of the current iframes have our source
				var src = this.toc[index].src;

				if (this.toc[index].disabled) {
					src = "paywall.html?index=" + index;
					//reloadAnyway = true;
				}

				var new_source = URLWithoutHash(src);
				var existing = $(".iframe-holder").find("iframe").map(function (ind, item) {
					var src = $(item).attr("src");
					if (new_source == URLWithoutHash(src)) {
						return item;
					}
					return null;
				});

				if (!reloadAnyway && existing.length) {
					// same page we're already on
					existing.attr({"data-index": index}).show();

					this.scrollToHash(existing, {index: index, hash: options.hash});

					if (options.highlight) {
						this.iframe.iFrameHolder("highlight", options.highlight);
					}
				} else {
					// external content
					if (src.substr(0, 4).toLowerCase() === "http") {
						window.open(src);
						return;
					}

					if (!options.hash) {
						// scroll to top
						this.scrollToHash(this.iframe, {}, true);
					}

					this.showLoading("new content");

					this.addIFrame({
						index: index,
						scrollTo: true,
						hash: options.hash,
						highlight: options.highlight,
						type: this.options.type,
						disabledContent: this.toc[index].disabled,
						class: options.class
					});
				}

				$("#main_video").hide();
				this.player.pause();
			}

			this.setCurrentIndex(index);

			var showAllMarkers = options && options.showAllMarkers;

			this.addMarkers(showAllMarkers);

			this.removeAllTriggers();
			this.addTriggersForThisVideo();
		},

		getFirstVideoFromTOC: function () {
			for (var i = 0; i < this.toc.length; i++) {
				var d = this.toc[i];
				if (d.video) {
					return i;
				}
			}

			return undefined;
		},

		advanceTOC: function (options) {
			if (this.currentIndex < this.toc.length - 1) {
				this.playFromTOC(this.currentIndex + 1, options);
			}
		},

		onVideoStarted: function (event) {
			this.markItemStarted(this.currentIndex);

			var file = event.target.currentSrc;
			if (file) {
				ga("send", "event", "video", "play", file);
			}
		},

		onVideoEnded: function () {
			this.markItemCompleted(this.currentIndex);

			var file = event.target.currentSrc;
			ga("send", "event", "video", "end", file);

			this.advanceTOC();
		},

		onVideoError: function (error) {
			console.log("Sorry. Video playback error.");
		},

		onPageScrolledToEnd: function () {
			this.markItemCompleted(this.currentIndex);

			var previousSrc = URLWithoutHash(this.toc[this.currentIndex].src);

			//this.advanceTOC( { previousSource: previousSrc, skipToNextSource: true } );
			this.advanceTOC({previousSource: previousSrc, skipToNextSource: true, replaceAll: false});
		},

		markItemStarted: function (index) {
			var completed = Database.getItemProperty(index, "completed");
			if (!completed) {
				Database.setItemProperty(index, "started", true);
				$(".toc#contents-pane").TOCTree("markStarted", index);
			}
		},

		markCurrentItemStarted: function () {
			this.markItemStarted(this.currentIndex);
		},

		markCurrentItemCompleted: function () {
			this.markItemCompleted(this.currentIndex);
		},

		markItemCompleted: function (index) {
			Database.setItemProperty(index, "completed", true);
			$(".toc#contents-pane").TOCTree("markCompleted", index);

			// for videos, check to see if all of this item's parent's children are complete
			switch (this.options.type) {
				case "metadata": // ie, video
					var p = this.toc[index].parent;
					if (p) {
						var p_index = p.index;
						var p_complete = $(".toc").TOCTree("checkForAllChildrenComplete", p_index);
						if (p_complete) {
							this.markItemCompleted(p_index);
						}
					}
					break;
			}

			this.updateProgress();
		},

		markItemIncomplete: function (index) {
			Database.setItemProperty(index, "completed", false);
			$(".toc#contents-pane").TOCTree("markIncomplete", index);

			this.updateProgress();
		},

		updateUI: function () {
			$(".nav-list.toc a").removeClass("active animated tada");
			$(".nav-list.toc a").eq(this.currentIndex).hide(0).addClass("active animated slideInLeft").show(0);
		},

		updateProgress: function () {
			var pct = Math.round(Database.getPercentageComplete() * 100);
			$("#completed-progress").css("width", pct + "%");//.attr("aria-valuenow", pct);
			// this is used by .progress::after (works on all browsers?)
			$(".progress").attr("data-progress", pct + "% Complete");
			$("#accessible-progress").text(pct + "% Complete");

			this.possiblyShowCrossSell(pct);
		},

		possiblyShowCrossSell: function (pct) {
			if (pct > 10 && this.options.crossSell) {
				if (Database.getTitleProperty("cross-sell-shown") != true) {
					Database.setTitleProperty("cross-sell-shown", true);

					var me = this;

					setTimeout(function () { me.showCrossSell(); }, 5000);
				}
			}
		},

		// [{time,text}]
		addTimelineMarkers: function (markers) {
			if (markers === undefined) markers = [];

			this.markerOptions.markers = markers;
		},

		onClickTimelineMarker: function (marker) {
			$("#notes-panel").Notes("gotoNote", marker.noteKey);
		},

		addMarkers: function (showAllMarkers) {
			return;

			this.addTimelineMarkers();

			var curDepth = this.toc[this.currentIndex].depth;

			var data = [];
			var counter = 0;

			for (var i = 0; i < this.markers.length; i++) {
				var m = this.markers[i];

				if (m.depth == curDepth) {
					var item = {};

					var txt = m.type == "epub" ? (m.text ? m.text : "Click here to read more") : m.text;

					item.depth = (counter++).toString();

					switch (m.type) {
						case "epub":
							item.short = "<i class='fa fa-book'></i>";
							break;
						case "files":
						case "code":
							item.short = "<i class='fa fa-file-code-o'></i>";
							break;
						case "extra":
							item.short = "<i class='fa fa-question-circle'></i>";
							break;
						case "sandbox":
							item.short = "<i class='fa fa-desktop'></i>";
							break;
						default:
							console.log(m.type);
							break;
					}

					item.desc = txt;
					item.callback = $.proxy(this.onClickMarker, this, i);
					item.timestamp = String(m.start).toHHMMSS();
					item.id = i;

					data.push(item);
					/*

					 //					var el = $("<div>", { class: "alert trackalert" }).attr("role", "alert");
					 var el = $("<div>", { class: "trackalert" });
					 if (!showAllMarkers) el.addClass("x-hidden");


					 var r = $("<div>", { class: "row"}).appendTo(el);

					 var d1 = $("<div>", { class: "col-xs-9" }).appendTo(r);
					 var d2 = $("<div>", { class: "col-xs-3" }).appendTo(r);

					 var defaultPlacement = true;

					 switch (m.type) {
					 case "code":
					 //el.addClass("alert-danger");
					 break;
					 case "sandbox":
					 //el.addClass("alert-info");
					 break;
					 case "quiz":
					 //el.addClass("alert-warning");
					 break;
					 case "files":
					 //el.addClass("alert-danger");
					 break;
					 case "epub":
					 var coverURL = "epubs/" + m.src + "/OEBPS/html/graphics/" + m.cover;

					 //el.addClass("alert-success");

					 var cover = $("<img>", { src: coverURL, class: "tiny-thumbnail" });
					 d2.append(cover);

					 break;
					 case "extra":
					 //el.addClass("alert-danger");
					 break;
					 }

					 $("<span>", {class: "badge", text: String(m.start).toHHMMSS()}).appendTo(d1);

					 $("<span>", {html: " " + txt}).appendTo(d1);

					 el.click($.proxy(this.onClickMarker, this, i));

					 container.append(el);

					 if (!m.elements) m.elements = {};
					 m.elements.alert = el;
					 */
					m.alert = i;
				}
			}

			if (data.length) {
				$(".resource-list").TOCTree("option", "data", data);
			}
		},

		addTriggersForThisVideo: function () {
			var curDepth = this.toc[this.currentIndex].depth;

			for (var i = 0; i < this.markers.length; i++) {
				var m = this.markers[i];
				if (m.depth == curDepth) {
					//var el = m.elements ? m.elements.alert : undefined;
					this.pop.timebase({
						start: m.start, end: m.end, alert: m.alert, id: this.trackID++, text: m.text,
						callback: $.proxy(this.onClickMarker, this, i)
					});
				}
			}
		},

		removeAllTriggers: function () {
			if (this.trackID && this.pop) {
				for (var i = 0; i < this.trackID; i++) {
					if (this.pop.removeTrackEvent)
						this.pop.removeTrackEvent(i);
				}

				delete this.pop;
			}

			this.pop = Popcorn(this.el, {frameAnimation: true});

			this.trackID = 1;
		},

		onClickMarker: function (index) {
			this.player.pause();

			var me = this;

			var m = this.markers[index];

			switch (m.type) {
				case "code":
					var contents = m.html;

					BootstrapDialog.show({
						title: "Code Listing",
						message: contents,
						size: BootstrapDialog.SIZE_WIDE,
						onshown: function (dialog) {
							dialog.getModalBody().find(".code-listing").prepend('<span class="btn-clipboard">Copy</span>');
							dialog.getModalBody().find(".btn-clipboard").click($.proxy(me.onClipboard, me));
						},
					});

					break;

				case "sandbox":
					var contents = m.html;

					var wh = $(window).outerHeight();
					contents = contents.replace("__window height__", (wh * .75));

					BootstrapDialog.show({
						title: "Sandbox",
						message: contents,
						size: BootstrapDialog.SIZE_WIDE,
					});

					break;

				case "quiz":
					var contents = "Quiz goes here.";

					BootstrapDialog.show({
						title: "Quiz",
						message: contents,
						size: BootstrapDialog.SIZE_WIDE,
					});

					break;

				case "files":
					var contents = "<ul><li>File1.cpp</li><li>File2.cpp</li><li>Data_input.txt</li></ul>";

					BootstrapDialog.show({
						title: "Project Files",
						message: contents,
						size: BootstrapDialog.SIZE_WIDE,
						buttons: [{label: 'Download All', action: $.proxy(me.onDownload, me)}]
					});

					break;

				case "epub":
					var coverURL = "epubs/" + m.src + "/OEBPS/html/graphics/" + m.cover;
					var cover = "<img class='img-thumbnail' src='" + coverURL + "'/>";

					var contents = '<div class="row"><div class="col-xs-2"><a class="center-block text-center" href="https://www.informit.com/store/learning-node.js-a-hands-on-guide-to-building-web-applications-9780321910578" target="_blank">' + cover + '<p class="small">Link to the Book</p></a></div><div class="col-xs-10"><iframe src="epubs/' + m.src + '/OEBPS/html/' + m.page + '" width="100%" height="__window height__" frameborder="0"></iframe></div></div>';
					var wh = $(window).outerHeight();
					contents = contents.replace("__window height__", (wh * .75));

					BootstrapDialog.show({
						title: "<span class='lead'>Read more.</span> An excerpt from <strong>" + m.title + "</strong>",
						message: contents,
						size: BootstrapDialog.SIZE_WIDE
						/* To inject CSS:
						 onshown: function (dialogRef) {
						 var frm = $("iframe")[0].contentDocument;
						 var otherhead = frm.getElementsByTagName("head")[0];
						 var link = frm.createElement("link");
						 link.setAttribute("rel", "stylesheet");
						 link.setAttribute("type", "text/css");
						 link.setAttribute("href", "http://fonts.googleapis.com/css?family=Bitter");
						 otherhead.appendChild(link);
						 var body = frm.getElementsByTagName("body")[0];
						 console.log(body);
						 }*/
					});

					break;

				case "extra":
					var contents = '<iframe src="' + m.src + '" width="100%" height="__window height__" frameborder="0"></frame>';

					var wh = $(window).outerHeight();
					contents = contents.replace("__window height__", (wh * .75));

					BootstrapDialog.show({
						title: "Try This…",
						message: contents,
						size: BootstrapDialog.SIZE_WIDE
					});

					break;
			}
		},

		openExtraPage: function (url) {
			var contents = '<iframe src="' + url + '" width="100%" height="__window height__" frameborder="0"></frame>';

			var wh = $(window).outerHeight();
			contents = contents.replace("__window height__", (wh * .75));

			BootstrapDialog.show({
				/*title: "Try This…",*/
				message: contents,
				size: BootstrapDialog.SIZE_WIDE
			});
		},

		onClipboard: function (event) {
			event.stopPropagation();

			$.notify({
				// options
				message: 'Code copied to clipboard.',
			}, {
				// settings
				type: 'info',
				allow_dismiss: false,
				delay: 3000,
				z_index: 5000,
				animate: {
					enter: 'animated fadeInDown',
					exit: 'animated fadeOutUp'
				},
			});
		},

		onDownload: function (event) {
			$.notify({
				// options
				message: 'Downloaded.',
			}, {
				// settings
				type: 'success',
				allow_dismiss: false,
				delay: 3000,
				z_index: 5000,
				animate: {
					enter: 'animated fadeInDown',
					exit: 'animated fadeOutUp'
				},
			});
		},

		onDownloadVideo: function (event, file) {
			$.notify({
				// options
				message: 'Video Download ' + file + ' starting ...',
			}, {
				// settings
				type: 'success',
				allow_dismiss: false,
				placement: {
					from: "bottom",
					align: "left"
				},
				delay: 3000,
				z_index: 5000,
				animate: {
					enter: 'animated fadeInDown',
					exit: 'animated fadeOutUp'
				}
			});
		},

		isShowingAll: function () {
			return this.pop.SHOWING_ALL;
		},

		getPreviousSection: function (index) {
			if (index == undefined) index = this.currentIndex;

			index = parseInt(index);

			// return the title of the next entry with a different src (ie, a different section)
			var curSrc = URLWithoutHash(this.toc[index].src) || this.toc[index].video;

			for (var i = index - 1; i >= 0; i--) {
				var nextSrc = URLWithoutHash(this.toc[i].src) || this.toc[i].video;
				if (nextSrc != curSrc) {
					var indexToReturn = i;
					// return the first one with this new source
					for (j = i - 1; j >= 0; j--) {
						var nextNextSrc = URLWithoutHash(this.toc[j].src) || this.toc[j].video;
						if (nextNextSrc != nextSrc) {
							indexToReturn = j + 1;
							break;
						}
					}
					return {index: indexToReturn, title: this.toc[indexToReturn].desc, src: nextSrc};
				}
			}

			return null;
		},

		getNextSection: function (index) {
			if (index == undefined) index = this.currentIndex;

			index = parseInt(index);

			// return the title of the next entry with a different src (ie, a different section)
			var curSrc = URLWithoutHash(this.toc[index].src) || this.toc[index].video;

			for (var i = index + 1; i < this.toc.length; i++) {
				var nextSrc;
				if (this.toc[i]) {
					nextSrc = URLWithoutHash(this.toc[i].src);
				} else if (this.toc[i] && this.toc[i].video) {
					nextSrc = this.toc[i].video;
				}

				if (nextSrc != undefined && nextSrc != curSrc) {
					return {index: i, title: this.toc[i].desc, src: nextSrc};
				}
			}

			return null;
		},

		// using header text (as opposed to Habitat IDs)
		findCurrentItem: function () {
			var foundindex = undefined;

			var me = this;

			var iframes = $("iframe.content:onScreen");

			var curSrc = URLPageOnly(URLWithoutHash(this.toc[this.getCurrentIndex()].src));

			$(iframes.get().reverse()).each(function (index, item) {
				var iframe = $(item);
				var headers = iframe.contents().find("h1, h2, h3, h4");
				var headersOnScreen = iFrameElementsOnScreen(headers, iframe);
				for (var i = headersOnScreen.length - 1; i >= 0; i--) {
					var screen_item = headersOnScreen[i];
					var h = $(screen_item);
					//var t = h.text().replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g, " ");
					var t = h.text();
					for (var j = 0; j < me.toc.length; j++) {
						// THEORY: look for matching header text in this src file only
						// WARNING: Habitat compatibility
						if (me.toc[j] && me.toc[j].src) {
							var thisSrc = URLPageOnly(URLWithoutHash(me.toc[j].src));
							var desc = decodeEntities(me.toc[j].desc);
							if (desc == t && curSrc == thisSrc) {
								foundindex = j;
								break;
							}
						}
					}
					if (foundindex != undefined)
						break;
				}
			});

			return foundindex;
		},

		// using Habitat IDs (as opposed to header text)
		findCurrentItem_byID: function () {
			var me = this;

			var iframes = $("iframe:onScreen");

			var foundIndex = null;

			$(iframes.get().reverse()).each(function (index, item) {
				if (foundIndex) {
					return foundIndex;
				}

				var iframe = $(item);

				// look for the bottom-most h1, h2 on screen
				var headers = iframe.contents().find("h1, h2");
				var headersOnScreen = iFrameElementsOnScreen(headers, iframe);
				for (var i = headersOnScreen.length - 1; i >= 0; i--) {
					var id = "#" + headersOnScreen.eq(i).attr("id");
					for (var j = 0; j < me.toc.length; j++) {
						if (me.toc[j].hash == id) {
							foundIndex = j;
							return;
						}
					}
				}

				// THEORY OF A WORKAROUND: if there's an h1 or h2 with an ID not in the TOC, use the HTML's id (this is a Habitat export problem, I think)
				// HABITAT EXPORT WORKAROUND: check the iframe's html's id (the toc id's don't match the H1/H2 id's)
				if (headersOnScreen.length && !foundIndex) {
					var headers = iframe.contents().find("html");
					var headersOnScreen = iFrameElementsOnScreen(headers, iframe);
					for (var i = headersOnScreen.length - 1; i >= 0; i--) {
						var id = "#" + headersOnScreen.eq(i).attr("id");
						for (var j = 0; j < me.toc.length; j++) {
							if (me.toc[j].hash == id) {
								foundIndex = j;
								return;
							}
						}
					}
				}
			});

			return foundIndex;
		},

		onScrollContent: function (event) {
			if (!this.busyScrolling && !this.waitingForIFrameToLoad) {
				var curIndex = this.getCurrentIndex();

				this.syncTOCToContent();

				var newIndex = this.getCurrentIndex();
				if (curIndex != newIndex) {
					history.pushState(null, null, "?link=" + newIndex);
				}

				if (this.options.infinite_scrolling === true) {
					this.checkForAutoAdvance();
				}

				if (this.iframe && this.iframe.iFrameHolder)
					this.iframe.iFrameHolder("onScroll", event);
			}
		},

		syncTOCToContent: function (index) {
			if (index == undefined)
				index = this.findCurrentItem();

			if (index) {
				var isNew = false;

				if (index != this.getCurrentIndex()) {
					this.setCurrentIndex(index);
					isNew = true;

					this.element.trigger("onNewTOC");
				}

				var entry = $(".toc#contents-pane li[data-index=" + index + "]");

				$(".toc#contents-pane .current").removeClass("current");
				entry.addClass("current");

				if (isNew) {
					entry.parents("li").find("> ul").show(300);

					setTimeout(function () {
						$(".toc#contents-pane").TOCTree("refreshAllDroppers", index);
					}, 0);
				}

				var scroller = $("#contents-pane .scroller");
				var t = scroller.scrollTop();
				var h = scroller.height();
				var p = entry[0].getBoundingClientRect().top + t - h * .6;
				var dest = p;
				var currTarget = scroller.attr("data-scrolltarget");
				var diff = (currTarget - dest);
				if (currTarget == undefined || Math.abs(diff) > 20) {
					scroller.attr("data-scrolltarget", dest);
					scroller.stop().animate(
						{
							scrollTop: dest
						},
						{
							duration: 1000,
							complete: function () {
							}
						}
					);
				}
			}
		},

		checkForAutoAdvance: function () {
			// check for auto-advance
			var h_container = $("#video").scrollTop() + $("#video").height();
			var h_scroller = $("#video .iframe-holder").height();

			var distToScroll = h_container - h_scroller;

			if (this.waitingForAutoAdvance) return;

			if (distToScroll >= 0) {
				var obj = this.getNextSection();

				if (obj) {
					this.waitingForAutoAdvance = true;

					this.addIFrame({index: obj.index, scrollTo: false});

					this.setCurrentIndex(obj.index);
				}
			}
		},

		registerGoogleAnalytics: function (title) {
			(function (i, s, o, g, r, a, m) {
				i['GoogleAnalyticsObject'] = r;
				i[r] = i[r] || function () {
					(i[r].q = i[r].q || []).push(arguments)
				}, i[r].l = 1 * new Date();
				a = s.createElement(o),
					m = s.getElementsByTagName(o)[0];
				a.async = 1;
				a.src = g;
				m.parentNode.insertBefore(a, m)
			})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

			// my ga code:
			//ga('create', 'UA-48406787-4', 'auto');

			// andy's code (effective 10/16/15):
			ga('create', 'UA-433761-35', 'auto');

			ga('set', {
				'appName': title
			});
		},

		sendGoogleAnalytics: function (pagename) {
			// NOTE: 8/25/15 switched from screenview to pageview

			//ga('send', 'screenview', {'screenName': pagename});

			ga('send', 'pageview', {'title': pagename});

			//ga('send', 'event', 'video', 'started');
			//ga('send', 'event', data.category, data.action, data.label);
		},

		onCloseSearch: function () {
			if (this.iframe && this.iframe.iFrameHolder)
				this.iframe.iFrameHolder("unhighlight");
		},

		// after loading video, add any closed captioning
		onLoadedMetadata: function (event) {
			totalVideoTime = event.target.duration;

			var captions = this.toc[this.currentIndex].captions;

			if (captions) {
				// try to avoid cross-origin errors b/t s3 and informIT
				$("video").attr("crossorigin", "anonymous");

				$(this.el).find("track").remove();

				var track = document.createElement("track");
				track.kind = "captions";
				track.label = "English";
				track.srclang = "en";
				track.src = captions;

				/* to auto-show captions:
				 function ontrackadded(event) {
				 event.track.mode = "showing";
				 }

				 this.player.textTracks().onaddtrack = ontrackadded;
				 */

				$(this.el).append(track);
			}

			var transcript = this.toc[this.currentIndex].transcript;
			if (transcript) {
				function timeStringToSeconds (s) {
					var h = parseInt(s.substr(0, 2));
					var m = parseInt(s.substr(3, 2));
					var sec = parseInt(s.substr(6, 2));
					var ms = parseInt(s.substr(9, 1));
					return (h * 60 * 60) + (m * 60) + sec + (ms / 10);
				}

				var me = this;

				$.get(transcript, function (data) {
					var t = $(data);
					var allText = t.find("div p");
					$(".video-transcript").html(allText);

					allText.click($.proxy(me.onClickTranscript, me));

					allText.each(function (index, item) {
						var el = $(item);
						var begin = timeStringToSeconds(el.attr("begin"));
						var end = timeStringToSeconds(el.attr("end"));
						el.attr( { "data-begin": begin, "data-end": end } );
					});
				})
					.fail(function () {
						console.log("transcript failed to load");
					});

				this.element.find(".video-holder").addClass("has-transcript");

				this.hasTranscript = true;
			} else {
				this.element.find(".video-holder").removeClass("has-transcript");

				this.hasTranscript = false;
			}
		},

		onClickTranscript: function (event) {
			var t = $(event.currentTarget).attr("data-begin");
			this.player.currentTime(t);
		},

		onToggleTranscript: function (event) {
			var holder = this.element.find(".video-holder");
			if (holder.hasClass("transcript-visible")) {
				holder.removeClass("transcript-visible");
			} else {
				holder.addClass("transcript-visible");
			}
			this.element.find(".vjs-transcript-button").blur();
		},

		getIDForCurrentIndex: function () {
			if (this.currentIndex == undefined)
				return undefined;
			else
				return this.toc[this.currentIndex].id;
		},

		getTOCTitleForID: function (id) {
			for (var i = 0; i < this.toc.length; i++) {
				var t = this.toc[i];
				if (t.id == id) {
					return t.desc;
				}
			}
			return undefined;
		},

		getReferenceForCurrentItem: function () {
			if (this.currentIndex == undefined)
				return undefined;
			else {
				var obj = { id: this.toc[this.currentIndex].id };
				if (this.currentItemIsVideo()) {
					obj.time = this.player.currentTime();
				}
				return obj;
			}
		},

		getHashForID: function (id) {
			for (var i = 0; i < this.toc.length; i++) {
				var t = this.toc[i];
				if (t.id == id) {
					return t.hash;
				}
			}
			return undefined;
		},

		getDatabase: function () {
			return Database;
		},

		onDatabaseUpdate: function () {
			$(".toc#contents-pane").TOCTree("setStatus", Database.getItems());
		},

		getSelectedUpdates: function () {
			return $(".toc#contents-pane").TOCTree("getSelectedUpdates");
		},

		showSelectedUpdates: function () {
			this.iframe.iFrameHolder("showSelectedUpdates");
		},

		getNumberOfUpdates: function () {
			return $(".toc#contents-pane").TOCTree("getNumberOfUpdates");
		},

		playRedirectedURL: function (src) {
			var me = this;

			function onReturnedResponse (resp) {
				console.log("onReturnedResponse");
				console.log(oReq.responseURL);
				console.log("was:");
				console.log(src);
				if (src != oReq.responseURL) {
					console.log("reloading");
					me.player.src({type: "video/mp4", src: oReq.responseURL});
					me.player.play();
				}
			}

			var oReq = new XMLHttpRequest();
			//oReq.addEventListener("load", onReturnedResponse);
			oReq.addEventListener("progress", onReturnedResponse);
			oReq.open("GET", src);
			oReq.send();
		},

		showNotesPanel: function () {
			$("#notes-panel").Notes("openPanel");
		},

		clearAllProgress: function () {
			Database.clearAllProgress();
		},

		recordPageView: function (index) {
			var old_limit = Database.getRemainingViews();

			Database.trackPageLimit(index);

			var cur_limit = Database.getRemainingViews();

			if (old_limit > cur_limit) {
				$.notify({
					// options
					message: 'You have ' + cur_limit + ' page views remaining.',
				}, {
					// settings
					type: 'info',
					allow_dismiss: true,
					delay: 3000,
					z_index: 5000,
					animate: {
						enter: 'animated fadeInDown',
						exit: 'animated fadeOutUp'
					},
				});
			}
		},

		blockPage: function (block) {
			if (block) {
				$("#video").addClass("blocked");
			} else {
				$("#video").removeClass("blocked");
			}
		},

		pageIsLimited: function (index) {
			index = parseInt(index);

			var cost = this.toc[index].cost;

			if (cost === undefined || cost > 0) {
				if (Database.getRemainingViews() <= 0) {
					var pages = Database.getPagesViewed();
					if (pages.indexOf(index) !== -1) {
						return false;
					}
					return true;
				}
			}
			return false;
		},

		pageHasCost: function (index) {
			var cost = this.toc[index].cost;

			return (cost === undefined) ? true : (cost > 0);
		},

		registeredCustomerCheck: function (callback) {
			$.get("../optional_file.html", function (data) {
				callback(true);
			}).fail(function (err) {
				callback(false);
			});
		},

		showCrossSell: function () {
			var bug_me_not = Database.getTitleProperty("bug_me_not");

			if (bug_me_not == true) return;

			var htmlString =
				'<div>Enjoying this title? You might want to check out this other popular title:' +
					'<a id="sell-link" target="_blank" href="https://www.informit.com/store/learn-python-3-the-hard-way-a-very-simple-introduction-9780134693651">' +
						'<div class="book-title">' +
							'<img src="https://informit.com/ShowCover.aspx?isbn=0134693655&amp;type=f" alt="Learn Python 3 the Hard Way: A Very Simple Introduction to the Terrifyingly Beautiful World of Computers and Code" class="product" width="160">' +
							'<div class="info">' +
								'<p class="title">Learn Python 3 the Hard, Hard, Hard Way</p>' +
								'<p class="discount">Use discount code: <span class="discount-code">cross35</span><br><span class="percent">… 35% off!</span></p>' +
							'</div>' +
						'</div>' +
					'</a>' +
					'<div class="footer">' +
						'<div class="checkbox">' +
							'<label><input id="cease" type="checkbox" value="">Don\'t show me any more of these messages</label>' +
						'</div>'
					'</div>' +
				'</div>';

			var preload = $(htmlString);

			// wait until everything's loaded to show this:
			imagesLoaded(preload, doShowCrossSell);

			function doShowCrossSell (obj) {
				$.notify({
					message: htmlString
				}, {
					// settings
					type: 'sales',
					allow_dismiss: true,
					placement: {
						from: "top",
						align: "center"
					},
					offset: 0,
					delay: 0,
					z_index: 5000,
					animate: {
						enter: 'animated fadeInDown',
						exit: 'animated fadeOutUp'
					},
					onClose: onCloseCrossSell,
					onShow: onShowCrossSell
					/*,
					template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
					 '<div>It looks like you\'re getting a lot of use out of this book. You might want to check out this other popular title:' +
					 '<a target="_blank" href="https://www.informit.com/store/learn-python-3-the-hard-way-a-very-simple-introduction-9780134693651">' +
					 '<div class="book-title">' +
					 '<img src="https://informit.com/ShowCover.aspx?isbn=0134693655&amp;type=f" alt="Learn Python 3 the Hard Way: A Very Simple Introduction to the Terrifyingly Beautiful World of Computers and Code" class="product" width="160">' +
					 '<span class="title" data-notify="title">{1}</span>' +
					 '<span data-notify="topic">{2}</span>' +
					 '</div></a></div>' +
					 '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
					 '</div>'*/
				});

				var isbn = "";
				if (Common.getISBNFromLocation) {
					isbn = Common.getISBNFromLocation();
					if (isbn) {
						ga("send", "event", "interface", "cross-sell-show", isbn);
					}
				}
			}

			function onCloseCrossSell () {
				var checkbox = this.find("input#cease");
				var checked = checkbox.prop("checked");

				var isbn = "";
				if (Common.getISBNFromLocation) {
					isbn = Common.getISBNFromLocation();
				}

				if (checked) {
					Database.setTitleProperty("bug_me_not", true);

					if (isbn) {
						ga("send", "event", "interface", "cross-sell-stop", isbn);
					}
				} else {
					if (isbn) {
						ga("send", "event", "interface", "cross-sell-close", isbn);
					}
				}
			}

			function onShowCrossSell () {
				var a = $(this).find("a#sell-link");
				a.click(function () {
					var isbn = "";
					if (Common.getISBNFromLocation) {
						isbn = Common.getISBNFromLocation();
						if (isbn) {
							ga("send", "event", "interface", "cross-sell-click", isbn);
						}
					}
				});
			}
		}
	});

	var VideoManager = {};
	VideoManager.HashInURL = HashInURL;

	return VideoManager;
});