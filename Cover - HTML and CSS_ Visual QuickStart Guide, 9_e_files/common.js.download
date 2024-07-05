define([], function () {

	return {

		makeFirebaseFriendly: function (path) {
			return path.toLowerCase().replace(/\s/g, "_").replace(/\./g, "_");
		},

		getISBNFromLocation: function () {
			var isbn_regex = /\/(\d*)\//;
			var isbn = window.location.pathname.match(isbn_regex);
			if (isbn && isbn.length > 1) return isbn[1];
			else return undefined;
		}
};

});