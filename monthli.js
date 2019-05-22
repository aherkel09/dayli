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

$(document).ready(function() {
    var date = new Date();
    var year = String(date.getFullYear());
    
    monthli = new Monthli(year);
    monthli.getComplete();
    monthli.listen();
    
    var element = document.getElementById('calendar');
    calendar = jsCalendar.new(element, date);
});
    
