class Dayli {
    constructor(year, date) {
        this.year = year;
        this.date = date;
        this.docRef = firebase.firestore().collection(this.year).doc(this.date);
    }
    
    update() {
        console.log('getting data for ' + this.date + '-' + this.year + '...');
        this.docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log('found data...');
                displayData(doc.data());
            } else {
                console.log('creating data...');
                return this.createDoc();
            }
        }).catch(function(error) {
            console.log(error);
            return false;
        });
    }
    
    createDoc() {
        console.log('creating new doc...');
        this.docRef.set({
            meditation: false,
            composition: false,
        }).catch(function(error) {
            console.log(error);
        });
    }
    
    markDone(goal) {
        console.log('marking done...');
        var data = {};
        data[goal] = true;
        this.docRef.update(data).then(function() {
            return true;
        }).catch(function(error) {
            console.log(error);
            return false;
        });
    }
}

function getDate() {
    var date = new Date();
    $('#date').text(date.toDateString());
    var year = String(date.getFullYear());
    var date = String(date.getMonth()+1) + '-' + String(date.getDate());
    return {
        year: year,
        date: date,
    };
}

function displayData(data) {
    console.log('displaying data...');
    var complete = true;
    for (var d in data) {
        if (data[d] == true) {
            $('#' + d).fadeOut('slow');
        } else if (data[d] == false) {
            complete = false;
        }
    }
    if (complete) {
        $('#content').fadeOut('slow', function() {
            $('#complete').fadeIn('slow');
        });
    }
}

$(document).ready(function() {
    var date = getDate();
    dayli = new Dayli(date.year, date.date);
    dayli.update();
    
    $('.card').click(function(ev) {
        var goal = $(ev.target).closest('.card').attr('id');
        if (dayli.markDone(goal)) {
            dayli.update();
        }
    });
    
    $('#header').fadeIn('slow');
    $('#content').fadeIn('slow');
});
