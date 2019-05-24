class Monthli {
    constructor(day, month, year) {
        this.day = day;
        this.month = month;
        this.year = year;
        this.docRef = firebase.firestore().collection(this.year);
    }
    
    listen() {
        this.docRef.where('complete', '==', true).onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
                console.log(change.doc.data());
            });
        });
    } 
    
    getComplete() {
        var date = this.day + '-' + this.month + '-' + this.year;
        var year = this.year;
        var complete = [];
        this.docRef.where('complete', '==', true).get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                var dateComplete = doc.id.split('-');
                // format completed date to mm-dd-yyyy & push to array
                complete.push(dateComplete[1] + '-' + dateComplete[0] + '-' + year);
            });
            createCalendar(date, complete);
        });
    }
}

function createCalendar(today, complete) {
    var calendar = jsCalendar.new('#calendar', today);
    $('.jsCalendar > table').css({
        'margin': 'auto',
        'background-color': 'transparent',
        'color': 'var(--greyscale)',
        'box-shadow': 'none',
    });
    $('.jsCalendar-current')
        .attr('id', today)
        .css('color', 'var(--brand)');
    
    calendar.select(complete);
    styleSelected();
    
    calendar.onDateClick(function(event, date) {
        $('.jsCalendar-current').removeClass('jsCalendar-current');
        $(event.target).closest('td').addClass('jsCalendar-current');
        showDay(date);
        styleSelected();
    });
    
    calendar.onMonthChange(function(event, date) {
        var thisMonth = today.split('-')[1];
        if (String(date.getMonth()+1) == thisMonth) {
            $('#' + today).css('color', 'var(--brand)');
        } else {
            $('#' + today).css('color', 'var(--greyscale)');
        }
        styleSelected();
    });
}

function showDay(date) {
    var dateObj = getDate(date);
    var dayli = new Dayli(dateObj.year, dateObj.date);
    dayli.init();
}

function styleSelected() {
    $('td').not('.jsCalendar-current, .jsCalendar-selected')
        .css('background-color', 'transparent');
    $('.jsCalendar-current').css('background-color', 'var(--dark)');
    $('.jsCalendar-selected').css({
        'background-color': 'var(--accent)',
        'border': 'none',
    });
}

$(document).ready(function() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = String(date.getFullYear());
    
    var monthli = new Monthli(day, month, year);
    monthli.getComplete();
});
