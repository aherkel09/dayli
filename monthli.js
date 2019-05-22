class Monthli {
    constructor(year) {
        this.year = year;
        this.docRef = firebase.firestore().collection(this.year);
    }
    
    getComplete() {
        this.docRef.where('complete', '==', true).get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                console.log(doc.id);
            });
        });
    }
    
    listen() {
        this.docRef.where('complete', '==', true).onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
                console.log(change.doc.data());
            });
        });
    }    
}

function createCalendar(date) {
    calendar = jsCalendar.new('#calendar', date);
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
    monthli.getComplete();
    monthli.listen();
    
    createCalendar(date);
});
    
