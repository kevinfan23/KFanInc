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

//color arrays
var colors = new Array(
  [62,35,255],
  [60,255,60],
  [255,35,98],
  [45,175,230],
  [255,0,255],
  [255,128,0]);

var step = 0;
//color table indices for: 
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0,1,2,3];

//transition speed
var gradientSpeed = 0.005;

$(document).ready(function(){
	setInterval(displayTime, 1000);
	setInterval(updateGradient,10);
	contactOverlay();
});

/*******    Gradient functions    ******/
function updateGradient()
{
  
  if ( $===undefined ) return;
  
var c0_0 = colors[colorIndices[0]];
var c0_1 = colors[colorIndices[1]];
var c1_0 = colors[colorIndices[2]];
var c1_1 = colors[colorIndices[3]];

var istep = 1 - step;
var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
var color1 = "rgb("+r1+","+g1+","+b1+")";

var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
var color2 = "rgb("+r2+","+g2+","+b2+")";

 $('#rainbow').css({
   background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
    background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
  
  step += gradientSpeed;
  if ( step >= 1 )
  {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];
    
    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    
  }
}

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
	$('#contact').on('tap',function() {
        $('#overlay-contact, .social, .content').fadeIn(500)
    });
    
	$('#contact').on('click', function() {
		$('#overlay-contact, .social, .content').fadeIn(500);
	});
	
	$(document).on('taphold',function() {
        $('#overlay-contact, .social, .content').fadeOut(300)
    });
    
	$(document).on('click','#overlay-contact',function() {
        $('#overlay-contact, .social, .content').fadeOut(300)
    });
}