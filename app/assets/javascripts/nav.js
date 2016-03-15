// Sequence is important!!! draggable() before overlay to ensure no overlay triggered during dragging
$("#draggable").draggable();
navOverlay();

function navOverlay() {
	$('#draggable').on('click', function() {
		document.getElementById("menu-toggler").checked = true;	
		$('.menu').fadeIn(500);
});
	
	$(document).on('click','input',function() {
        $('.menu').fadeOut(300);
    });
}