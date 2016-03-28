// Time variables
var currentTime = new Date();
var day = currentTime.getDay();
var date = currentTime.getDate();
var month = currentTime.getMonth();
var year = currentTime.getFullYear();
var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
var meridiem = "AM";

var clockDiv;
var dayDiv;
var dateDiv;

$(document).ready(function(){
	setInterval(displayTime, 1000);
	contactOverlay();
});

function displayTime() {
	
	currentTime = new Date();
	
	// Get time variables
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
	
	// Adding zeros to the digits
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	
	if (hours === 0) {
		hours = 12;
	}
	else if (hours < 10) {
		hours = '0' + hours;
	}
	else if (hours > 12) {
		hours = hours -12;
		meridiem = "PM";
	}

	// Change colors according to the day of the week
	var day_color;
	switch(day) {
		case 0:
			day_color = "rgb(215, 86, 47)";
			break;
		case 1:
			day_color = "rgb(255, 191, 114)";
			break;
		case 2:
			day_color = "rgb(248, 240, 135)";
			break;
		case 3:
			day_color = "rgb(183, 227, 192)";
			break;
		case 4:
			day_color = "rgb(175, 238, 238)";
			break;
		case 5:
			day_color = "rgb(135, 206, 250)";
			break;
		case 6:
			day_color = "rgb(219, 186, 229)";
			break;
		default:
			break;
	}
	document.getElementById('day').style.color = day_color;


	// Render text
    clockDiv = document.getElementById('clock');
	clockDiv.innerText = hours + ":" + minutes + ":" + seconds + " " + meridiem;
	dayDiv = document.getElementById('day');
	dayDiv.innerText = days[day];
	dateDiv = document.getElementById('date');
	dateDiv.innerText = months[month] + " " + date + ", " + year;
}

/*******    Overlay functions    ******/
function contactOverlay() {
	$('#contact').on('click', function() {
		$('#overlay-contact, .social, .content').fadeIn(500);
	});
	
	$(document).on('click','#overlay-contact',function() {
        $('#overlay-contact, .social, .content').fadeOut(300)
    });
}