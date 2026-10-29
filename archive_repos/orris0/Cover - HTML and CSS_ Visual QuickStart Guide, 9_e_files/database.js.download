define(["common"], function (Common) {
	var masterURL = "https://memberservices.informit.com/";

	function shrink (itemsArray) {
		// bitwise method:
		var s = number_to_32bits(itemsArray.length);
		for (var i = 0; i < itemsArray.length; i++) {
			var it = itemsArray[i];
			if (it && it.completed) s.push(1, 1);
			else if (it && it.started) s.push(0, 1);
			else s.push(0, 0);
		}

		st = "~" + bitwise_compress(s);

		return st;

		/* lzw method:
		var s = [];
		for (var i = 0; i < itemsArray.length; i++) {
			var it = itemsArray[i];
			if (it) {
				s[i * 2] = it.started ? "s" : " ";
				s[i * 2 + 1] = it.completed ? "c" : " ";
			} else {
				s[i*2] = "  ";
			}
		}
		var st = s.join("");

		// lzw-compress it and prepend an *
		st = "*" + lzw_encode(st);

		return st;
		*/
	}

	function unshrink (st) {
		var itemsArray = [];

		// * = lzw-compressed
		if (st[0] === "*") {
			console.log("items compressed " + st.length);
			st = lzw_decode(st.substr(1));
			console.log("items uncompressed " + st.length);
		}

		// ~ = bitwised
		if (st[0] === "~") {
			console.log("items bitwised " + st.length);
			st = bitwise_expand(st.substr(1));
			console.log("items unbitwised " + st.length);
			var length = bits32_to_number(st.splice(0, 32));
			for (var i = 0; i < length; i++) {
				var n = st.splice(0, 2);
				obj = { started: false, completed: false };
				if (n[0] == 1) {
					obj.started = obj.completed = true;
				} else if (n[1] == 1) {
					obj.started = true;
				}
				itemsArray[i] = obj;
			}
		} else {
			var n = st.length / 2;
			for (var i = 0; i < n; i++) {
				var obj = {
					started: st[i * 2] == "s",
					completed: st[i * 2 + 1] == "c"
				};
				itemsArray[i] = obj;
			}
		}

		return itemsArray;
	}

	function number_to_32bits (n) {
		var r = [];
		for (var i = 31; i >= 0; i--) {
			if (n & Math.pow(2, i))
				r.push(1);
			else
				r.push(0);
		}
		return r;
	}

	function bits32_to_number (s) {
		var n = 0;
		for (var i = 0; i < 32; i++) {
			var c = s[i];
			if (c) n += Math.pow(2, 31 - i);
		}
		return n;
	}

	function bitwise_compress (s) {
		var st = "";
		var c = 0;
		var n = 7;
		for (var i = 0; i < s.length; i++) {
			var d = s[i];
			if (d)
				c += (d * Math.pow(2, n));
			n--;
			if (n < 0 || i === s.length - 1) {
				st += String.fromCharCode(c);
				n = 7;
				c = 0;
			}
		}
		return st;
	}

	function bitwise_expand (s) {
		var ar = [];
		for (var i = 0; i < s.length; i++) {
			for (var j = 7; j >= 0; j--) {
				var c = s.charCodeAt(i);
				if (c & Math.pow(2, j)) {
					ar.push(1);
				} else {
					ar.push(0);
				}
			}
		}

		return ar;
	}

	// FROM: https://gist.github.com/revolunet/843889
	// LZW-compress a string
	function lzw_encode (s) {
		var dict = {};
		var data = (s + "").split("");
		var out = [];
		var currChar;
		var phrase = data[0];
		var code = 256;
		for (var i=1; i<data.length; i++) {
			currChar=data[i];
			if (dict['_' + phrase + currChar] != null) {
				phrase += currChar;
			}
			else {
				out.push(phrase.length > 1 ? dict['_'+phrase] : phrase.charCodeAt(0));
				dict['_' + phrase + currChar] = code;
				code++;
				phrase=currChar;
			}
		}
		out.push(phrase.length > 1 ? dict['_'+phrase] : phrase.charCodeAt(0));
		for (var i=0; i<out.length; i++) {
			out[i] = String.fromCharCode(out[i]);
		}
		return out.join("");
	}

	// Decompress an LZW-encoded string
	function lzw_decode (s) {
		var dict = {};
		var data = (s + "").split("");
		var currChar = data[0];
		var oldPhrase = currChar;
		var out = [currChar];
		var code = 256;
		var phrase;
		for (var i=1; i<data.length; i++) {
			var currCode = data[i].charCodeAt(0);
			if (currCode < 256) {
				phrase = data[i];
			}
			else {
				phrase = dict['_'+currCode] ? dict['_'+currCode] : (oldPhrase + currChar);
			}
			out.push(phrase);
			currChar = phrase.charAt(0);
			dict['_'+code] = oldPhrase + currChar;
			code++;
			oldPhrase = phrase;
		}
		return out.join("");
	}

	function GetCommentsForTitle (isbn, callback) {
		var url = masterURL + "api/PersistentCustomerData/" + isbn + "/GetAllComments";

		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.setRequestHeader('Content-type', 'application/json');
		req.onload = function () {
			if (callback) {
				var data = JSON.parse(this.responseText);
				var comments = [];
				for (var each in data) {
					var d = data[each];
					try {
						var rec = JSON.parse(d.Value);
						rec.isbn = isbn;
						rec.id = d.Id;
						comments.push(rec);
					} catch (e) {
						console.log("Parse error in:");
						console.log(d.Value);
					}
				}
				callback(comments);
			}
		};
		req.send();
	}

	function PostCommentForTitle (isbn, commentJSONString, callback) {
		var url = masterURL + "api/PersistentCustomerData";
		var obj = { isbn: isbn, key: "comment", value: commentJSONString, isComment: true };
		var params = JSON.stringify(obj);
		var req = new XMLHttpRequest();
		req.open("POST", url, true);
		req.setRequestHeader('Content-type', 'application/json');
		req.onload = function (event) {
			var data = JSON.parse(this.responseText);
			if (callback)
				callback(data);
		};
		try {
			req.send(params);
		} catch (e) {
			console.log("PostCommentForTitle error:")
			console.log(e);
		}
	}

	function GetDataForTitle (isbn, key, callback) {
		var url = masterURL + "api/PersistentCustomerData/" + isbn + "/" + key;
		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.setRequestHeader('Content-type', 'application/json');
		req.onload = function (event) {
			if (this.status != 404) {
				var response = JSON.parse(this.responseText);
				if (callback) {
					var data = JSON.parse(response.Value);
					callback(data);
				}
			} else {
				callback(null);
			}
		};

		try {
			req.send();
		} catch (e) {
			// probably a 404, no data for this title
			console.log("GetDataForTitle error:")
			console.log(e);

			if (callback) {
				callback(null);
			}
		}
	}

	function SetDataForTitle (isbn, key, value, callback) {
		var url = masterURL + "api/PersistentCustomerData";
		var obj = { isbn: isbn, key: key, value: value, isComment: false };
		var params = JSON.stringify(obj);
		var req = new XMLHttpRequest();
		req.open("PUT", url, true);
		req.setRequestHeader('Content-type', 'application/json');
		req.onload = function (event) {
			if (callback)
				callback(this.responseText);
		};
		req.send(params);
	}

	var Database = {

		timestamp: undefined,
		items: [],
		currentIndex: undefined,
		callbacks: [],
		last_save: undefined,
		attemptedRemoteLoad: false,
		pages: undefined,
		pageLimit: undefined,
		_isJustVisitingCustomer: undefined,

		getVersion: function () {
			return "1.0.6";
		},

		initialize: function (toc, title, updateCallback) {
			this.title = title;

			this.databaseRef = undefined;

			this.initialRemoteDataLoad();

			this.items = new Array(toc.length);
			for (var i = 0; i < this.items.length; i++) {
				var item = { started: false, completed: false };
				this.items[i] = item;
			}

			this.updateCallback = updateCallback;

			this.loadFromLocalStorage();
		},

		loadCommentsForISBN: function (isbn, callback) {
			GetCommentsForTitle(isbn, callback);
		},

		loadCommentsFromPersistentDB: function (callback) {
			if (Common.getISBNFromLocation) {
				var isbn = Common.getISBNFromLocation();
				if (!isbn || isbn == "9780134438009") isbn = "9780134382562";
				if (isbn) {
					GetCommentsForTitle(isbn, callback);
				}
			}
		},

		postCommentToPersistentDatabase: function (commentObject, callback) {
			var isbn = commentObject.isbn;
			if (!isbn)
				isbn = Common.getISBNFromLocation();

			if (isbn) {
				PostCommentForTitle(isbn, JSON.stringify(commentObject), callback);
			}
		},

		deleteComment: function (id, callback) {
			var url = masterURL + "api/PersistentCustomerData/" + id;
			var req = new XMLHttpRequest();
			req.open('DELETE', url, true);
			req.setRequestHeader('Content-type', 'application/json');
			req.onload = function (event) {
				var data;
				if (this.responseText)
					data = JSON.parse(this.responseText);

				if (callback)
					callback(data);
			};
			req.send();
		},

		loadNotesFromPersistentDB: function (callback) {
			if (Common.getISBNFromLocation) {
				var isbn = Common.getISBNFromLocation();
				if (!isbn || isbn == "9780134438009") isbn = "9780134382562";
				if (isbn) {
					GetNotesForTitle(isbn, callback);
				}
			}
		},

		loadFromLocalStorage: function () {
			if (Common.getISBNFromLocation) {
				var isbn = Common.getISBNFromLocation();
				var item = localStorage.getItem(isbn);
				if (item) {
					var db = JSON.parse(item);

					if (this.timestamp == undefined || db.timestamp > this.timestamp) {
						if (typeof db.items == "string") {
							this.items = unshrink(db.items);
						} else {
							this.items = db.items;
						}
						this.currentIndex = db.index;
						this.titleProperty = db.titleProperty;
						this.timestamp = db.timestamp;
					}
				}
			}
		},

		saveToLocalStorage: function () {
			var compressedItems = shrink(this.items);

			var time = new Date().getTime();

			var db = { timestamp: time, items: compressedItems, index: this.currentIndex, titleProperty: this.titleProperty };

			var to_json = JSON.stringify(db);

			try {
				var isbn = Common.getISBNFromLocation();
				localStorage.setItem(isbn, to_json);
			} catch (e) {
				// private browsing
			}

			// compare last_save as json string without timestamp
			var copy = JSON.parse(to_json);
			delete copy.timestamp;
			var to_save = JSON.stringify(copy);

			if (to_save != this.last_save) {
				this.saveToRemoteStorage("savedData", to_json);
				this.last_save = to_save;
			}
		},

		setItemProperty: function (index, property, value) {
			if (index >= this.items.length || this.items[index] == undefined) {
				this.items[index] = {};
			}

			this.items[index][property] = value;

			this.saveToLocalStorage();
		},

		getItemProperty: function (index, property) {
			var item = this.items[index];
			if (item)
				return item[property];
			else
				return undefined;
		},

		clearAllProgress: function () {
			for (var i = 0; i < this.items.length; i++) {
				this.items[i].completed = this.items[i].started = false;
			}

			this.setTitleProperty("cross-sell-shown", undefined);

			this.saveToLocalStorage();
		},

		saveCurrentIndex: function (index) {
			this.currentIndex = index;

			this.saveToLocalStorage();
		},

		getCurrentIndex: function () {
			return this.currentIndex;
		},

		saveCurrentTime: function (time) {
			if (this.currentIndex >= this.items.length) {
				this.items[this.currentIndex] = {};
			}

			this.items[this.currentIndex].time = time;

			this.saveToLocalStorage();
		},

		getCurrentTime: function () {
			if (this.currentIndex)
				return this.items[this.currentIndex].time;
			else
				return undefined;
		},

		getItems: function () {
			return this.items;
		},

		getPercentageComplete: function () {
			var completed = 0;
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i] && this.items[i].completed)
					completed++;
			}
			return (completed / this.items.length);
		},

		getTitleProperty: function (key) {
			if (this.titleProperty === undefined) {
				this.titleProperty = {};
			}

			return this.titleProperty[key];
		},

		setTitleProperty: function (key, val) {
			if (this.titleProperty === undefined) {
				this.titleProperty = {};
			}

			this.titleProperty[key] = val;

			this.saveToLocalStorage();
		},

		initialRemoteDataLoad: function (user) {
			this.loadFromRemoteStorage();

			for (var i = 0; i < this.callbacks.length; i++) {
				this.callbacks[i]();
			}

			this.callbacks = [];
		},

		callWhenReady: function (callback) {
			this.callbacks.push(callback);
		},

		saveToRemoteStorage: function (key, data) {
			// THEORY: don't save to remote until we've tried loading from the remote
			if (this.attemptedRemoteLoad) {
				var isbn = Common.getISBNFromLocation();
				SetDataForTitle(isbn, key, data, $.proxy(this.onSavedToRemoteStorage, this));
			}
		},

		loadFromRemoteStorage: function () {
			if (Common.getISBNFromLocation) {
				var isbn = Common.getISBNFromLocation();

				GetDataForTitle(isbn, "savedData", $.proxy(this.onLoadedFromRemoteStorage, this));
			}
		},

		onLoadedFromRemoteStorage: function (data) {
			this.attemptedRemoteLoad = true;

			if (data) {
				if (this.timestamp == undefined || data.timestamp > this.timestamp) {
					if (typeof data.items == "string") {
						this.items = unshrink(data.items);
					} else {
						this.items = data.items;
					}
					this.currentIndex = data.index;
					this.titleProperty = data.titleProperty;
					this.timestamp = data.timestamp;

					if (this.updateCallback) {
						this.updateCallback();
					}

					this.saveToLocalStorage();
				}
			}
		},

		onSavedToRemoteStorage: function (result) {
			//console.log("on saved");
			//console.log(result);
		},

		setUserData: function (key, value, callback) {
			var isbn = Common.getISBNFromLocation();
			var json_value = JSON.stringify(value);
			SetDataForTitle(isbn, key, json_value, callback);
		},

		getUserData: function (key, callback) {
			var isbn = Common.getISBNFromLocation();

			GetDataForTitle(isbn, key, function (data) {
				if (callback && data)
					callback(data);
			});
		},

		getTitleData: function (callback) {
			if (!this.remoteAuthorized) {
				this.callWhenReady($.proxy(this.getTitleData, this, callback));
			} else {
				if (this.customerID) {
					this.databaseRef.child("users/" + this.customerID).once("value", callback);
				}
			}
		},

		getTitlesRef: function () {
			if (this.databaseRef)
				return this.databaseRef.child("titles");
		},

		getTitle: function () {
			return this.title;
		},

		setPageLimit: function (limit) {
			this.pageLimit = limit;
		},

		loadPageLimit: function () {
			if (Common.getISBNFromLocation) {
				var isbn = Common.getISBNFromLocation();
				var pages = localStorage.getItem(isbn + "-pages");
				if (pages) {
					var db = JSON.parse(pages);

					if (this.pageTimestamp == undefined || db.timestamp > this.pageTimestamp) {
						this.pages = JSON.parse(lzw_decode(db.pages));
						this.pageTimestamp = db.timestamp;
					}
				} else {
					this.pages = [];
				}
			}
		},

		trackPageLimit: function (newPage) {
			newPage = parseInt(newPage);

			if (this.pages === undefined) {
				this.loadPageLimit();
			} else if (this.pages.indexOf(newPage) === -1) {
				this.pages.push(newPage);
			}

			var compressedPages = lzw_encode(JSON.stringify(this.pages));

			var time = new Date().getTime();

			var db = { timestamp: time, pages: compressedPages };

			var to_json = JSON.stringify(db);

			try {
				var isbn = Common.getISBNFromLocation();
				localStorage.setItem(isbn + "-pages", to_json);
			} catch (e) {
				// private browsing
			}
		},

		getPagesViewed: function () {
			if (this.pages === undefined) {
				this.loadPageLimit();
			}

			return this.pages;
		},

		getRemainingViews: function () {
			var pages = this.getPagesViewed();

			return this.pageLimit - pages.length;
		},

		isJustVisitingCustomer: function () {
			return this._isJustVisitingCustomer;
		},

		setIsJustVisitingCustomer: function (visiting) {
			this._isJustVisitingCustomer = visiting;
		}
	};

	return Database;
});