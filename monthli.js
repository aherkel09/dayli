class Monthli {
    constructor(year) {
        this.year = year;
        this.docRef = firebase.firestore().collection(this.year);
    }
    
    getComplete() {
        var complete = this.docRef.where('complete', '==', true);
        console.log(complete);
        return complete;
    }
}

$(document).ready(function() {
    var year = new Date().getFullYear();
    monthli = new Monthli(year);
    var complete = monthli.getComplete();
}
    
