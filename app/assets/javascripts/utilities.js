//AQI index
var index = 0;

//weather variables
var degreeUnit = 'f';
var local;
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
        local = position.coords.latitude + ',' + position.coords.longitude;
        getWeather(local, degreeUnit);
    });
}
else {
    getWeather('Los Angeles');
}

//loading varibale
var checkmarkIdPrefix = "loadingCheckSVG-";
var checkmarkCircleIdPrefix = "loadingCheckCircleSVG-";
var verticalSpacing = 50;
var upward_moving_group = document.getElementById("phrases");
var start_time = new Date().getTime();
var phrases = ["Wake up at 8:00AM", "Gym", "Go to class", "Work", "Sleep at 12:30AM", "Wake up at 8:00AM", "Gym", "Go to class", "Work", "Sleep at 12:30AM"];
 
//note card
var typingTimer;
var doneTypingInterval = 10;
var finaldoneTypingInterval = 1000;

/*** Function calling ***/
	renderAQI();
	addPhrasesToDocument(phrases);
	animateLoading();
	renderNotes();
	setInterval(updateWeather, 3000); //Update the weather every 3000ms.
	utilitiesOverlay();


/*******    WeatherApp functions    ******/
function updateWeather(){
	/* Update weather */
	if (document.getElementById("toggle").checked) {
		degreeUnit = 'c';
	}
	else {
		degreeUnit = 'f';
	}
	getWeather(local, degreeUnit);
}

function getWeather(location, unit) {	
		
	$.simpleWeather({
    location: location,
    woeid: '',
    unit: unit,
    success: function(weather) {
	    var city = weather.city;
        var temp = weather.temp + '&deg;';
        var wcode = weather.code + '.svg';
        var wind = '<p>' + weather.wind.speed + '</p><p>' + weather.units.speed + '</p>';
        var humidity = weather.humidity + ' %';
  
		$(".location").html(city);
        $(".temperature").html(temp);
        $(".weathericon").val(wcode);
        $(".windspeed").html(wind);
        $(".humidity").html(humidity);
    },
    
    error : function(error) {
            $(".error").html('<p>' + error + '</p>');
    }
  });
}

/*******    AQI Gauge functions    ******/
function renderAQI() {
	getAQI();
	setTimeout(spinner, 2000);
}

function spinner() {
    var classNames = [
      {
        className: 'green',
        title: 'good'
      },
      {
        className: 'yellow',
        title: 'moderate'
      },
      {
        className: 'orange',
        title: 'unhealty'
      },
      {
        className: 'red',
        title: 'bad'
      },
      {
        className: 'black',
        title: 'hazardous'
      }
    ];

	// Convert aqi inidex from Breezometer standard to US/CHN standard
	var aqi_color = 0;
	if (index <= 50) {
		aqi_color = 0;
	}
	else if (index > 50 && index <= 100) {
		aqi_color = 1;
	}
	else if (index > 100 && index <= 200) {
		aqi_color = 2;
	}
	else if (index > 200 && index <= 300) {
		aqi_color = 3;
	}
	else {
		aqi_color = 4;
	}
    var svg = document.getElementsByClassName('gauge')[0],
        title = svg.getElementsByClassName('gauge_rating')[0];

    svg.className = "gauge " + classNames[aqi_color].className;
    title.innerHTML = classNames[aqi_color].title;
    svg.getElementsByClassName('gauge_index')[0].innerHTML = "AQI: " + index;     
}

function getAQI() {
    $.ajax({
        type:'GET',
        url:"https://api.breezometer.com/baqi/?location=zhengzhou,+henan,+china&fields=country_aqi&key=37d4b9c6e1c24609a4edee8d3eda9522",
        success: function(data) {
            index = data.country_aqi;
        },
        dataType : 'json',

    });
}

/*******    Loading Screen functions    ******/
function animateLoading() {
    var now = new Date().getTime();
    upward_moving_group.setAttribute("transform", "translate(0 " + upward_moving_group.currentY + ")");
    upward_moving_group.currentY -= 1.35 * easeInOut(now);
    if (now - start_time < 30000 && upward_moving_group.currentY > -710) {
      requestAnimationFrame(animateLoading);
    }
}

function createSVG(tag, properties, opt_children) {
  var newElement = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for(prop in properties) {
    newElement.setAttribute(prop, properties[prop]);
  }
  if (opt_children) {
    opt_children.forEach(function(child) {
      newElement.appendChild(child);
    })
  }
  return newElement;
}

function createPhraseSvg(phrase, yOffset) {
  var text = createSVG("text", {
    fill: "white",
    x: 50,
    y: yOffset,
    "font-size": 18,
    "font-family": "Arial"
  });
  text.appendChild(document.createTextNode(phrase));
  return text;
}

function createCheckSvg(yOffset, index) {
  var check = createSVG("polygon", {
    points: "21.661,7.643 13.396,19.328 9.429,15.361 7.075,17.714 13.745,24.384 24.345,9.708 ",
    fill: "rgba(255,255,255,1)",
    id: checkmarkIdPrefix + index
  });
  var circle_outline = createSVG("path", {
    d: "M16,0C7.163,0,0,7.163,0,16s7.163,16,16,16s16-7.163,16-16S24.837,0,16,0z M16,30C8.28,30,2,23.72,2,16C2,8.28,8.28,2,16,2 c7.72,0,14,6.28,14,14C30,23.72,23.72,30,16,30z",
    fill: "white"
  })
  var circle = createSVG("circle", {
    id: checkmarkCircleIdPrefix + index,
    fill: "rgba(255,255,255,0)",
    cx: 16,
    cy: 16,
    r: 15
  })
  var group = createSVG("g", {
    transform: "translate(10 " + (yOffset - 20) + ") scale(.9)"
  }, [circle, check, circle_outline]);
  return group;
}

function addPhrasesToDocument(phrases) {
  phrases.forEach(function(phrase, index) {
    var yOffset = 30 + verticalSpacing * index;
    document.getElementById("phrases").appendChild(createPhraseSvg(phrase, yOffset));
    document.getElementById("phrases").appendChild(createCheckSvg(yOffset, index));
  });
}

function easeInOut(t) {
  var period = 200;
  return (Math.sin(t / period + 100) + 1) /2;
}

/*******    Note Card functions    ******/
function renderNotes() {
	var today = new Date();
var m = today.getMonth() + 1;
var d = today.getDate();
var y = today.getFullYear();

m = checkTime(m);
d = checkTime(d);

$('.notes-content, .notes-title').keydown(function() {
  	clearTimeout(typingTimer);
  	if ($('.notes-content, .notes-title').val) {
    	typingTimer = setTimeout(function() {
      	$(".rest").removeClass('active');
	 		$(".notes-dot").removeClass('saved');
    	}, doneTypingInterval);
  	}
});

$('.notes-content, .notes-title').keyup(function() {
  	clearTimeout(typingTimer);
  	typingTimer = setTimeout(function() {
    	$('.rest').addClass('active');
	 	$('.notes-dot').addClass('saved');
		$('.notes-comment').html('Last updated on ' + d + '/' + m + '/' + y)
  	}, finaldoneTypingInterval);
});

document.onpaste = function(event){
  	var items = (event.clipboardData || event.originalEvent.clipboardData).items;
  	for (index in items) {
    	var item = items[index];
  	}
}
}

function previewFile() {
	var file = document.querySelector('input[type=file]').files[0];
  	var reader  = new FileReader();

  	reader.onloadend = function () {
    	reader.result;
	 	$('.notes-content').append('<img src="' + reader.result + '" />');
  	}

  	if (file) {
    	reader.readAsDataURL(file);
		clearTimeout(typingTimer);
		typingTimer = setTimeout(function() {
			$('.rest').addClass('active');
			$('.notes-dot').addClass('saved');
			$('.notes-comment').html('Last updated on ' + d + '/' + m + '/' + y)
		}, finaldoneTypingInterval);
  	} else {
  	}
}

function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

/* Utilities effects */
function utilitiesOverlay() {
	$('#utilities').on('click', function() {
		$('#overlay-utilities, .twitter-streaming, .weather-app, .instagram-favorite, .gauge, #loading-page, .notes-wrapper').fadeIn(500);
	});
	
	$(document).on('click','#overlay-utilities',function() {
        $('#overlay-utilities, .twitter-streaming, .weather-app, .instagram-favorite, .gauge, #loading-page, .notes-wrapper').fadeOut(300);
        $(".menu").fadeOut(300);
    });
    
    $('#overlay-utilities').on('tap',function() {
        $('#overlay-utilities, .twitter-streaming, .weather-app, .instagram-favorite, .gauge, #loading-page, .notes-wrapper').fadeOut(300);
        $(".menu").fadeOut(300);
    });
}