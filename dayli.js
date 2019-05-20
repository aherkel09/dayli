function setDate() {
    var date = new Date();
    $('#date').text(date.toDateString());
}

function markDone(ev) {
    $(ev.target).closest('.card').fadeOut('slow');
}

$(document).ready(function() {
    setDate();
    $('.card').click(function(ev) {
        markDone(ev);
    });
    $('#content').fadeIn('slow');
});
