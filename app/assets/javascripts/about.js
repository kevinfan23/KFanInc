// Lists
var designList = [{ text: "Product Design", value: "product_design" }, { text: "User Interface Design", value: "ui" }, { text: "User Experience Design", value: "ux" }, { text: "Branding", value: "branding" }, { text: "Print", value: "print" }];
var devList = [{ text: "Front End", value: "front_end" }, { text: "Back End", value: "back_end" }, { text: "iOS", value: "ios" }, { text: "Android", value: "android" }, { text: "Dev Ops", value: "devops" }];
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

// Toggle Buttons
$('.toggle-button_option').click(function() {
  $(this).addClass('js-checked').siblings().removeClass('js-checked');
});