/*
 * jquery.smarthistory.js
 *
 * Copyright (c) 2010 Kazuhito Hokamura
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuhito Hokamura (http://webtech-walker.com/)
 * @version  0.0.1
 *
 * Page transition jQuery plugin, useing history.pushState.
 *
 */

(function($) {

$.fn.smarthistory = function(opt) {
	if ( !('pushState' in history) ) {
		return this;
	}

	opt = $.extend({
		target: '',
		defaultData: '',
		cache: true,
		before: function() {},
		change: function() {}
	}, opt);

	window.addEventListener('popstate', function(event) {
		var state = event.state || {};
		var data = state.data;
		if (data) {
			opt.change(data, event);
		}
		else {
			history.replaceState({data: opt.defaultData}, null, null);
		}
	});

	var cache = {};

	return this.live('click', function(event) {
		event.preventDefault();
		var $elem = $(this);
		var target = $.isFunction(opt.target) ? opt.target.call(this) : opt.target;
		var href = $elem.attr('href');
		opt.before.call(this);

		if (opt.cache && target in cache) {
			console.log('use cache');
			opt.change(cache[target]);
			history.pushState({data: cache[target]}, href, href);
		}
		else {
			$.get(target)
				.done(function(data) {
					opt.change(data);
					history.pushState({data: data}, href, href);
					if (opt.cache) {
						cache[target] = data;
					}
				})
				.fail(function() {
					location.href = target;
				});
		}
	});
};

})(jQuery);
