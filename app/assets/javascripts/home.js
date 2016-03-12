/*******    Global Variables    ******/

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
 
//timeline
var timelines = $('.cd-horizontal-timeline'),
	eventsMinDistance = 60;
	
//note card
var typingTimer;
var doneTypingInterval = 10;
var finaldoneTypingInterval = 1000;

/*******    main function    ******/
$(document).ready(function(){
        	
    /* Contacts & Utilities*/
	setInterval(updateGradient,10);
	contactOverlay();
	utilitiesOverlay();
	renderAQI();
	addPhrasesToDocument(phrases);
	animateLoading();
	renderNotes();
	setInterval(updateWeather, 3000); //Update the weather every 3000ms.
	refreshDiv();
	
	/* Arrow hover effects */
    $('.cd-timeline-navigation a.next').hover(function(){ $(this).animate({height:'70px'}, 'medium');}, 
    function() { $(this).animate({height:'48px'},'medium');});
    
    $('.cd-timeline-navigation a.prev').hover(function(){ $(this).animate({height:'30px'}, 'medium');}, 
    function() { $(this).animate({height:'46px'},'medium');});
    
    (timelines.length > 0) && initTimeline(timelines);
	showNewContent();
	
});

/*******    Timeline functions    ******/
function initTimeline(timelines) {
	timelines.each(function(){
		var timeline = $(this),
			timelineComponents = {};
		//cache timeline components 
		timelineComponents['timelineWrapper'] = timeline.find('.events-wrapper');
		timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
		timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
		timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
		timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
		timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
		timelineComponents['timelineNavigation'] = timeline.find('.cd-timeline-navigation');
		timelineComponents['eventsContent'] = timeline.children('.events-content');

		//assign a left postion to the single events along the timeline
		setDatePosition(timelineComponents, eventsMinDistance);
		//assign a width to the timeline
		var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
		//the timeline has been initialize - show it
		timeline.addClass('loaded');

		//detect click on the next arrow
		timelineComponents['timelineNavigation'].on('click', '.next', function(event){
			event.preventDefault();
			showNewContent(timelineComponents, timelineTotWidth, 'next');
		});
		//detect click on the prev arrow
		timelineComponents['timelineNavigation'].on('click', '.prev', function(event){
			event.preventDefault();
			showNewContent(timelineComponents, timelineTotWidth, 'prev');
		});
		//detect click on the a single event - show new event content
		timelineComponents['eventsWrapper'].on('click', 'a', function(event){
			event.preventDefault();
			timelineComponents['timelineEvents'].removeClass('selected');
			$(this).addClass('selected');
			updateOlderEvents($(this));
			updateFilling($(this), timelineComponents['fillingLine'], timelineTotWidth);
			updateVisibleContent($(this), timelineComponents['eventsContent']);
		});

		//on swipe, show next/prev event content
		timelineComponents['eventsContent'].on('swipeleft', function(){
			var mq = checkMQ();
			( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'next');
		});
		timelineComponents['eventsContent'].on('swiperight', function(){
			var mq = checkMQ();
			( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'prev');
		});

		//keyboard navigation
		$(document).keyup(function(event){
			if(event.which=='37' && elementInViewport(timeline.get(0)) ) {
				showNewContent(timelineComponents, timelineTotWidth, 'prev');
			} else if( event.which=='39' && elementInViewport(timeline.get(0))) {
				showNewContent(timelineComponents, timelineTotWidth, 'next');
			}
		});
	});
}

function showNewContent(timelineComponents, timelineTotWidth, string) {
	//go from one event to the next/previous one
	var visibleContent =  timelineComponents['eventsContent'].find('.selected'),
		newContent = ( string == 'next' ) ? visibleContent.next() : visibleContent.prev();

	if ( newContent.length > 0 ) { //if there's a next/prev event - show it
		var selectedDate = timelineComponents['eventsWrapper'].find('.selected'),
			newEvent = ( string == 'next' ) ? selectedDate.parent('li').next('li').children('a') : selectedDate.parent('li').prev('li').children('a');
			
		updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotWidth);
		updateVisibleContent(newEvent, timelineComponents['eventsContent']);
		newEvent.addClass('selected');
		selectedDate.removeClass('selected');
		updateOlderEvents(newEvent);
		updateTimelinePosition(string, newEvent, timelineComponents);
	}
}

function updateTimelinePosition(string, event, timelineComponents) {
	//translate timeline to the left/right according to the position of the selected event
	var eventStyle = window.getComputedStyle(event.get(0), null),
		eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
		timelineWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', '')),
		timelineTotWidth = Number(timelineComponents['eventsWrapper'].css('width').replace('px', ''));
	var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

    if( (string == 'next' && eventLeft > timelineWidth - timelineTranslate) || (string == 'prev' && eventLeft < - timelineTranslate) ) 	{
        translateTimeline(timelineComponents, - eventLeft + timelineWidth/2, timelineWidth - timelineTotWidth);
    }
}

function translateTimeline(timelineComponents, value, totWidth) {
	var eventsWrapper = timelineComponents['eventsWrapper'].get(0);
	value = (value > 0) ? 0 : value; //only negative translate value
	value = ( !(typeof totWidth === 'undefined') &&  value < totWidth ) ? totWidth : value; //do not translate more than timeline width
	setTransformValue(eventsWrapper, 'translateX', value+'px');
	//update navigation arrows visibility
	(value == 0 ) ? timelineComponents['timelineNavigation'].find('.prev').addClass('inactive') : 		timelineComponents['timelineNavigation'].find('.prev').removeClass('inactive');
	(value == totWidth ) ? timelineComponents['timelineNavigation'].find('.next').addClass('inactive') : 	timelineComponents['timelineNavigation'].find('.next').removeClass('inactive');
}

function updateFilling(selectedEvent, filling, totWidth) {
	//change .filling-line length according to the selected event
	var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
		eventLeft = eventStyle.getPropertyValue("left"),
		eventWidth = eventStyle.getPropertyValue("width");
	eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', ''))/2;
	var scaleValue = eventLeft/totWidth;
	setTransformValue(filling.get(0), 'scaleX', scaleValue);
}

function setDatePosition(timelineComponents, min) {
	for (i = 0; i < timelineComponents['timelineDates'].length; i++) { 
		var distance = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]),
		    distanceNorm = Math.round(distance/timelineComponents['eventsMinLapse']) + 2;
		timelineComponents['timelineEvents'].eq(i).css('left', distanceNorm*min+'px');
	}
}

function setTimelineWidth(timelineComponents, width) {
	var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length-1]),
		timeSpanNorm = timeSpan/timelineComponents['eventsMinLapse'],
		timeSpanNorm = Math.round(timeSpanNorm) + 4,
		totalWidth = timeSpanNorm*width;
	timelineComponents['eventsWrapper'].css('width', totalWidth+'px');
	updateFilling(timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents['fillingLine'], totalWidth);
	updateTimelinePosition('next', timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents);
	return totalWidth;
}

function updateVisibleContent(event, eventsContent) {
	var eventDate = event.data('date'),
		visibleContent = eventsContent.find('.selected'),
		selectedContent = eventsContent.find('[data-date="'+ eventDate +'"]'),
		selectedContentHeight = selectedContent.height();

	if (selectedContent.index() > visibleContent.index()) {
		var classEnetering = 'selected enter-right',
			classLeaving = 'leave-left';
	} else {
		var classEnetering = 'selected enter-left',
			classLeaving = 'leave-right';
	}

	selectedContent.attr('class', classEnetering);
	visibleContent.attr('class', classLeaving).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
		visibleContent.removeClass('leave-right leave-left');
		selectedContent.removeClass('enter-left enter-right');
	});
	eventsContent.css('height', selectedContentHeight+'px');
}

function updateOlderEvents(event) {
	event.parent('li').prevAll('li').children('a').addClass('older-event').end().end().nextAll('li').children('a').removeClass('older-event');
}

function getTranslateValue(timeline) {
	var timelineStyle = window.getComputedStyle(timeline.get(0), null),
		timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
         	timelineStyle.getPropertyValue("-moz-transform") ||
         	timelineStyle.getPropertyValue("-ms-transform") ||
         	timelineStyle.getPropertyValue("-o-transform") ||
         	timelineStyle.getPropertyValue("transform");

    if (timelineTranslate.indexOf('(') >=0) {
        var timelineTranslate = timelineTranslate.split('(')[1];
    	timelineTranslate = timelineTranslate.split(')')[0];
    	timelineTranslate = timelineTranslate.split(',');
    	var translateValue = timelineTranslate[4];
    } 
    else {
        var translateValue = 0;
    }
    return Number(translateValue);
}

function setTransformValue(element, property, value) {
	element.style["-webkit-transform"] = property+"("+value+")";
	element.style["-moz-transform"] = property+"("+value+")";
	element.style["-ms-transform"] = property+"("+value+")";
	element.style["-o-transform"] = property+"("+value+")";
	element.style["transform"] = property+"("+value+")";
}

//based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
function parseDate(events) {
	var dateArrays = [];
	events.each(function(){
		var singleDate = $(this),
			dateComp = singleDate.data('date').split('T');
		if( dateComp.length > 1 ) { //both DD/MM/YEAR and time are provided
			var dayComp = dateComp[0].split('/'),
				timeComp = dateComp[1].split(':');
		} else if( dateComp[0].indexOf(':') >=0 ) { //only time is provide
			var dayComp = ["2000", "0", "0"],
				timeComp = dateComp[0].split(':');
		} else { //only DD/MM/YEAR
			var dayComp = dateComp[0].split('/'),
				timeComp = ["0", "0"];
		}
		var	newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
		dateArrays.push(newDate);
	});
	return dateArrays;
}

function daydiff(first, second) {
	return Math.round((second-first));
}

function minLapse(dates) {
	//determine the minimum distance among events
	var dateDistances = [];
	for (i = 1; i < dates.length; i++) { 
		var distance = daydiff(dates[i-1], dates[i]);
		dateDistances.push(distance);
	}
	return Math.min.apply(null, dateDistances);
}

/*
	How to tell if a DOM element is visible in the current viewport?
	http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
*/
function elementInViewport(el) {
	var top = el.offsetTop;
	var left = el.offsetLeft;
	var width = el.offsetWidth;
	var height = el.offsetHeight;

	while(el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
		left += el.offsetLeft;
	}

	return (
		top < (window.pageYOffset + window.innerHeight) &&
		left < (window.pageXOffset + window.innerWidth) &&
		(top + height) > window.pageYOffset &&
		(left + width) > window.pageXOffset
	);
}

function checkMQ() {
	//check if mobile or desktop device
	return window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
}

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

/*******    Overlay functions    ******/
function contactOverlay() {
	$('#contact').on('click', function() {
		$('#overlay-contact, .social, .content').fadeIn(500);
	});
	
	$(document).on('click','#overlay-contact',function() {
        $('#overlay-contact, .social, .content').fadeOut(300)
    });
}

/* Utilities effects */
function utilitiesOverlay() {
	$('#utilities').on('click', function() {
		$('#overlay-utilities, .twitter-streaming, .weather-app, .instagram-favorite, .gauge, #loading-page, .notes-wrapper').fadeIn(500);
	});
	
	$(document).on('click','#overlay-utilities',function() {
        $('#overlay-utilities, .twitter-streaming, .weather-app, .instagram-favorite, .gauge, #loading-page, .notes-wrapper').fadeOut(300)
    });
}

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
    svg.getElementsByClassName('gauge_index')[0].innerHTML = "API: " + index;     
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

function refreshDiv(){
    // alert("In function");
     var container = document.getElementsByClassName("instagram-favorite");
     var content = container.innerHTML;
    //alert(content);
    container.innerHTML= content;
}