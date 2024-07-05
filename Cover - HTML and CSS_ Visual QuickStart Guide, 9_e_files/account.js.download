define(["database", "jquery.ui"], function (Database) {
	function daysBetween (day1, day2) {
		var d1 = new Date(day1);
		var d2 = new Date(day2);

		var first = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());

		var offset = Math.floor((d2 - first) / (1000 * 60 * 60 * 24));

		return offset;
	}

	$.widget("que.Account", {

		options: {},

		_create: function () {
			this.element.find(".close-button").click($.proxy(this.onClickClose, this));

			Database.getUserData("history", $.proxy(this.onHistory, this));

			this.element.find("#version").text("Version " + Database.getVersion());

			this.element.find("button#clear-all-progress").click($.proxy(this.onClickResetProgress, this));

			this.showPageLimitHistory();
		},

		closeOtherPanels: function () {
			$(".slide-panel.showing").hide("slide", {direction:"right"}).removeClass("showing");
		},

		onClickClose: function () {
			this.closePanel();
		},

		openPanel: function () {
			this.closeOtherPanels();

			this.element.show("slide", {direction: "right"}).addClass("showing");
			this.element.find(".comment.animated").removeClass("animated");

			this.showPageLimitHistory();
		},

		closePanel: function () {
			this.element.hide("slide", {direction: "right"}).removeClass("showing");
		},

		togglePanel: function () {
			if (this.element.is(":visible")) {
				this.closePanel();
			} else {
				this.openPanel();
			}
		},

		onHistory: function (record) {
			if (record === null) {
				// store first visit and days since that visit, ie: 2/9/2016 (is day 0), then integer array: [2, 7, 14, 21, 22, 58, 161]
				var today = Math.floor(new Date().getTime());
				record = { firstVisit: today };

				Database.setUserData("history", record);
			} else {
				if (record.visits == undefined) record.visits = [];

				var days = daysBetween(record.firstVisit, new Date());

				if (record.visits.indexOf(days) == -1) {
					record.visits.push(days);
				}

				Database.setUserData("history", record);

				this.updateFunFacts(record);
			}
		},

		updateFunFacts: function (record) {
			// first visit
			var d = new Date(record.firstVisit);
			this.addFunFact("Your first visit was " + d.toLocaleDateString() + ".");

			this.addFunFact("You've made " + record.visits.length + " total visit" + (record.visits.length > 1 ? "s." : "."));

			// days since last visit
			if (record.visits.length > 1) {
				var latest = record.visits[record.visits.length - 1];
				var next = record.visits[record.visits.length - 2];
				var between = latest - next;
				this.addFunFact("It's been " + between + " day" + (between > 1 ? "s" : "") + " since your last visit.");

				// days in a row
				var last, count = 1;
				for (var i = record.visits.length - 1; i >= 0; i--) {
					if (last == undefined) last = record.visits[i];
					else if (last - record.visits[i] == 1) {
						count++;
					} else {
						break;
					}
				}

				this.addFunFact("You've visited " + count + " day" + (count > 1 ? "s" : "") + " in a row.");
			}

			// 11/16: overall title data isn't available via InformIT
			//Database.getTitleData($.proxy(this.onGetTitleData, this));
		},

		onGetTitleData: function (snapshot) {
			if (snapshot) {
				var count = 0, totalPercent = 0, maxPercent = undefined;
				var val = snapshot.val();
				for (each in val) {
					if (each != "userdata") {
						count++;

						var db = $.evalJSON(val[each]);
						var items = db.items;
						var completed = 0 ;
						for (var i = 0; i < items.length; i += 2) {
							if (items[i + 1] == "c") {
								completed++;
							}
						}
						var pct = completed / (items.length / 2);
						if (pct > maxPercent || maxPercent == undefined) {
							maxPercent = pct;
						}
						totalPercent += pct;
					}
				}

				var averagePercent = Math.round((totalPercent / count) * 100);

				this.addFunFact("You have " + count + " Web Edition or Streaming Video title" + (count > 1 ? "s" : "") + " in your account.");
				this.addFunFact("Your average completion per title is " + averagePercent + "%.");
				this.addFunFact("Your max completion for a title is " + Math.round(maxPercent * 100) + "%.");
			}
		},

		addFunFact: function (s) {
			var el = this.element.find(".fun-facts");

			var p = $("<p>", { text: s });
			el.append(p);
		},

		onClickResetProgress: function (event) {
			var r = confirm("Are you sure you want to clear all the checkmarks for your reading progress in " + Database.getTitle() + " so far?");
			if (r == true) {
				Database.clearAllProgress();
				$(".toc#contents-pane").TOCTree("setStatus", Database.getItems());
			}
		},

		showPageLimitHistory: function () {
			if (Database.isJustVisitingCustomer()) {
				var allowed = this.options && this.options.manifest && this.options.manifest.pageLimited;

				if (allowed) {
					// TODO: don't bother showing page limit history if we have "paid" access
					var el = this.element.find("#page-limit-info");

					el.empty().append("<h3>Pages Limits</h3><h4>Allowed: " + allowed + " total</h4>");

					var pages = Database.getPagesViewed().sort(function (a, b) {
						return a - b;
					});

					var viewed = $("<h4>Viewed: </h4>");
					el.append(viewed);

					for (var i = 0; i < pages.length; i++) {
						viewed.append("<span>" + pages[i] + "</span>");
					}
				}
			} else {
				var el = this.element.find("#page-limit-info");

				el.empty();
			}
		}
	});
});