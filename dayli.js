function displayDate() {
    var date = new Date();
    $('#date').text(date.toDateString()).fadeIn('slow');
}

$(document).ready(function() {
    displayDate();
});
