$(function() {
	$('a').smarthistory({
		defaultData: $('html').html(),
		target: function() {
			return $(this).attr('href')
		},
		change: function(html) {
			$('.content').fadeOut('fast', function() {
				$(this).html( $(html).filter('.content') ).fadeIn();
			});
		}
	});
});
