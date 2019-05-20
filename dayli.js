class Dayli {
    constructor(year, date) {
        this.docRef = firebase.firestore().collection(year).doc(date);
    }
    
    getDoc() {
        this.docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log(doc.data());
                this.update(doc.data());
            } else {
                this.createDoc();
            }
        }).catch(function(error) {
            console.log(error);
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
    
    update(data) {
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
    
    markDone(goal) {
        var data = {};
        data[goal] = true;
        this.docRef.update(data).then(function() {
            this.getDoc();
        }).catch(function(error) {
            console.log(error);
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

$(document).ready(function() {
    var date = getDate();
    console.log(date.year + ', ' + date.date);
    dayli = new Dayli(date.year, date.date);
    dayli.getDoc();
    $('.card').click(function(ev) {
        var goal = $(ev.target).closest('.card').attr('id');
        dayli.markDone(goal);
    });
    $('#header').fadeIn('slow');
    $('#content').fadeIn('slow');
});
