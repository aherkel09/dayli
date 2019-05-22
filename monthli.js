class Monthli {
    constructor(year) {
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
        var complete = [];
        this.docRef.where('complete', '==', true).get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                var date = doc.id.split('-');
                // format date to mm-dd & push to array
                complete.push(date[1] + '-' + date[0]);
            });
        });
        return complete;
    }
}

function createCalendar(date, complete) {
    calendar = jsCalendar.new('#calendar', date).select(complete);
    $('.jsCalendar > table')
        .css('margin', 'auto')
        .css('background-color', 'transparent')
        .css('color', 'var(--greyscale)');
    $('.jsCalendar-current')
        .css('background-color', 'var(--accent)');
}

$(document).ready(function() {
    var date = new Date();
    var year = String(date.getFullYear());
    
    monthli = new Monthli(year);
    monthli.listen();
    var complete = monthli.getComplete();
    
    createCalendar(date, complete);
});
    
