class Monthli {
    constructor(uid, day, month, year) {
        this.day = day;
        this.month = month;
        this.year = year;
        this.docRef = firebase.firestore().collection(this.uid + '-' + this.year);
    }
    
    listen() {
        this.docRef.where('complete', '==', true).onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
                console.log(change.doc.data());
            });
        });
    } 
    
    getComplete() {
        var _this = this;
        var date = this.day + '-' + this.month + '-' + this.year;
        var complete = [];
        this.docRef.where('complete', '==', true).get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                var dateComplete = doc.id.split('-');
                // format completed date to mm-dd-yyyy & push to array
                complete.push(dateComplete[1] + '-' + dateComplete[0] + '-' + _this.year);
            });
            var calendar = new Calendar(_this.uid, date, complete);
            calendar.init();
        });
    }
}
