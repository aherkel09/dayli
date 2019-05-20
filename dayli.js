class Dayli {
    constructor(year, date) {
        this.year = year;
        this.date = date;
        this.docRef = firebase.firestore().collection(this.year).doc(this.date);
    }
    
    update() {
        var _this = this;
        this.docRef.get().then(function(doc) {
            if (doc.exists) {
                displayData(doc.data());
            } else {
                _this.createDoc();
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
    
    markDone(goal) {
        var _this = this;
        var data = {};
        data[goal] = true;
        this.docRef.update(data).then(function() {
            _this.update();
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

function displayData(data) {
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
        dayli.markDone(goal);
    });
    
    $('#header').fadeIn('slow');
    $('#content').fadeIn('slow');
});
