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

function createCalendar(date, complete) {
    console.log(complete);
    calendar = jsCalendar.new('#calendar', date);
    
    $('.jsCalendar > table').css({
        'margin': 'auto'
        'background-color': 'transparent',
        'color': 'var(--greyscale)',
    });
    
    calendar.onMonthChange(function(event, date) {
        styleSelected();
    });
    calendar.select(complete);
    styleSelected();
}

function styleSelected() {
    $('.jsCalendar > td')
        .not('.jsCalendar-current, .jsCalendar-selected')
        .css('background-color', '');
    $('.jsCalendar-current').css('background-color', 'var(--accent)');
    $('.jsCalendar-selected').css({
        'background-color': 'var(--brand)',
        'border', 'none',
    });
}

$(document).ready(function() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = String(date.getFullYear());
    
    monthli = new Monthli(day, month, year);
    monthli.listen();
    monthli.getComplete();
});
    
