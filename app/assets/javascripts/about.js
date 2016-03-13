$(document).ready(function(){
	initPanelTypes();
});

// Lists
var designList = [{ text: "UI/UX", value: "http://www.kfaninc.com/uiux" }, { text: "Graphical Design", value: "http://www.kfaninc.com/graphics" }, { text: "Writing & Speech", value: "http://www.kfaninc.com/blog" }];
var devList = [{ text: "Electrical Engineering", value: "electrical_engineering" }, { text: "Front End", value: "front_end" }, { text: "iOS", value: "ios" }];
var panelChooser = {
  'designList': designList,
  'devList': devList
};

// Initialize the Panel Type list loading
function initPanelTypes() {
  var $panelBtns = $('input[name=audience]', '#panel-type');
  var $panelType = $('input[name=audience]:checked', '#panel-type').val();

  // Initialize Selectize
  $("#panel-category").selectize({
    options: panelChooser[$panelType]
  });

  // When a panel type button is clicked, pass along the new value
  $panelBtns.on('change', function () {
    var newValue = $(this).val();
    switchPanelList(newValue);
  });

  // Switch Selectize list based on value
  function switchPanelList(newValue) {
    $("#panel-category")[0].selectize.clearOptions();
    $("#panel-category")[0].selectize.load(function (callback) {
      callback(panelChooser[newValue]);
    });
  }
}	

function loadSelection() {
	var direction = document.getElementById("panel-category").value;
	document.location.assign(direction);
}


// Toggle Buttons
$('.toggle-button_option').click(function() {
  $(this).addClass('js-checked').siblings().removeClass('js-checked');
});