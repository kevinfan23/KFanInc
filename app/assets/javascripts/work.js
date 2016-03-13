// just querying the DOM...like a boss!
var containerWidth = "700px";

var links = document.querySelectorAll(".itemLinks");
var wrapper = document.querySelector("#slider-wrapper");
 
// the activeLink provides a pointer to the currently displayed item
var activeLink = 0;

// function calling
$(".navbar").hide();
initSlider();
$("#slider-menu").click(function() {
	$(".navbar").fadeToggle("medium");
});

function initSlider() {
	// setup the event listeners
for (var i = 0; i < links.length; i++) {
    var link = links[i];
    link.addEventListener('click', setClickedItem, false);
 
    // identify the item for the activeLink
    link.itemID = i;
}
 
// set first item as active
links[activeLink].classList.add("active");
 
function setClickedItem(e) {
    removeActiveLinks();
 
    var clickedLink = e.target;
    activeLink = clickedLink.itemID;
 
    changePosition(clickedLink);
}

//add key listeners
$(document).keyup(function(event){
	if(event.which =='37') {
		goToPrevItem();
	} else if( event.which =='39') {
		goToNextItem();
	}
});

//add control listeners
$("#slider-prev").bind('click', goToPrevItem);
$("#slider-next").bind('click', goToNextItem);
}
 
function removeActiveLinks() {
    for (var i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
    }
}
 
// Handle changing the slider position as well as ensure
// the correct link is highlighted as being active
function changePosition(link) {
    var position = link.getAttribute("data-pos");
 
    var translateValue = "translate3d(" + position + ", 0px, 0)";
    wrapper.style[transformProperty] = translateValue;
 
    link.classList.add("active");
}
 
//
// Dealing with Transforms
//
var transforms = ["transform",
            "msTransform",
            "webkitTransform",
            "mozTransform",
            "oTransform"];
 
var transformProperty = getSupportedPropertyName(transforms);
 
// vendor prefix management
function getSupportedPropertyName(properties) {
    for (var i = 0; i < properties.length; i++) {
        if (typeof document.body.style[properties[i]] != "undefined") {
            return properties[i];
        }
    }
    return null;
}


function goToNextItem() {
    removeActiveLinks();
 
    if (activeLink < links.length - 1) {
        activeLink++;
    } else {
        activeLink = 0;
    }
 
    var newLink = links[activeLink];
    changePosition(newLink);
}

function goToPrevItem() {
    removeActiveLinks();
 
    if (activeLink != 0) {
        activeLink--;
    } else {
        activeLink = (links.length - 1);
    }
 
    var newLink = links[activeLink];
    changePosition(newLink);
}