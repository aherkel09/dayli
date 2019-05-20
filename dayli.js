class Dayli {
    constructor(year, date) {
        this.docRef = firebase.firestore().collection(year).doc(date);
    }
    
    getDoc() {
        this.docRef.get().then(function(doc) {
            if (doc.exists) {
                return doc.data();
            } else {
                return false;
            }
        }).catch(function(error) {
            console.log(error);
            return false;
        });
    }
    
    createDoc() {
        this.docRef.set({
            meditation: false,
            composition: false,
        }).catch(function(error) {
            console.log(error);
        });
    }
    
    update() {
        var data = this.getDoc();
        if (data) {
            displayData(data);
        } else {
            this.createDoc();
        }
    }
    
    markDone(goal) {
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
    console.log(data);
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
