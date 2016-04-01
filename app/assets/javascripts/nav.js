// Sequence is important!!! draggable() before overlay to ensure no overlay triggered during dragging
$("#draggable").draggable();
navOverlay();

function navOverlay() {
	$('#draggable').on('click', function() {
		$('.menu').fadeIn(500);
	});
	$('#close').on('click', function() {
		$('.menu').fadeOut(300);
	});
}