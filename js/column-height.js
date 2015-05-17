// On page load
$(window).load(columnHeight);

// On window resize
$(window).resize( function () {
    // Clear all forced column heights before recalculating them after window resize
    $("#lcolumn").css("height", "");  
    $("#rcolumn").css("height", "");
    columnHeight();
});

// Make columns 100% in height
function columnHeight() {
    // Column heights should equal the document height minus the header height and footer height
    var newHeight = $('body').height() - $("header").outerHeight() + "px";
    $("#lcolumn").css("height", newHeight);
    $("#rcolumn").css("height", newHeight);
}