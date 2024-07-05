define(["jquery.ui"], function () {

	var ROW_HEIGHT = 35;
	
	$.widget("que.VideoOverlay", {

		options: {},

		_create: function () {
			this.elements = {};
			this.slots = [undefined, undefined, undefined, undefined, undefined];
		},
		
		add: function (options) {
			var d = $("<div>", { class: "overlay-block", html: options.text });
			
			if (options.callback) {
				d.click(options.callback);
			}
			
			var slot = this.putInSlot(d);
			
			this.element.append(d);
			
			this.elements[options.id] = d;
		},
		
		remove: function (id) {
			var el = this.elements[id];
			
			if (el) {
				delete this.elements[id];
				
				this.removeFromSlot(el);
				
				el.addClass("animated fadeOutUp").animate( { _nothing: 0 }, { duration: 750, done: function () { el.remove(); } } );
			}
		},
		
		putInSlot: function (el) {
			for (var i = 0; i < this.slots.length; i++) {
				if (this.slots[i] == undefined) {
					this.slots[i] = el;
					el.css( { top: ROW_HEIGHT * i } );
					el.addClass("animated fadeInDown");
					break;
				}
			}
		},
		
		removeFromSlot: function (el) {
			for (var i = 0; i < this.slots.length; i++) {
				if (this.slots[i] == el) {
					this.slots[i] = undefined;
					break;
				}
			}
		},
		
		doit: function () {
			console.log("ok, I'll do it!");
		},

		_destroy: function () {
		},

		_setOption: function ( key, value ) {
			switch (key) {
				default:
					//this.options[ key ] = value;
					break;
			}

			this._super( "_setOption", key, value );
		}
	});
});
