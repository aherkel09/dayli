class Dayli {
    constructor(year, date) {
        this.year = year;
        this.date = date;
        this.docRef = firebase.firestore().collection(this.year).doc(this.date);
    }
    
    getDoc() {
        var _this = this;
        this.docRef.get().then(function(doc) {
            if (doc.exists) {
                completeGoals(_this.checkComplete(doc.data()));
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
            complete: false,
        }).catch(function(error) {
            console.log(error);
        });
    }
    
    markDone(goal) {
        var _this = this;
        var data = {};
        data[goal] = true;
        this.docRef.update(data).then(function() {
            _this.getDoc();
        }).catch(function(error) {
            console.log(error);
        });
    }
    
    checkComplete(data) {
        var complete = [];
        for (var d in data) {
            if (data[d] == true && d != 'complete') {
                complete.push(d);
            }
        }
        
        console.log('data length: ' + data.length);
        console.log('complete length: ' + complete.length);
        
        // if all goal entries except 'complete' == true, mark day complete.
        if (complete.length == data.length - 1) {
            this.complete();
        }
        
        return complete;
    }
    
    complete() {
        this.docRef.update({
            complete: true,
        }).catch(function(error) {
            console.log(error);
        });
        completeDay();
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

function completeGoals(goalArray) {
    for (var g in goalArray) {
        $('#' + g).fadeOut('slow');
    }
}

function completeDay() {
    $('#content').fadeOut('slow', function() {
        $('#complete').fadeIn('slow');
    });
}

$(document).ready(function() {
    var date = getDate();
    dayli = new Dayli(date.year, date.date);
    dayli.getDoc();
    
    $('.card').click(function(ev) {
        var goal = $(ev.target).closest('.card').attr('id');
        dayli.markDone(goal);
    });
    
    $('#header').fadeIn('slow');
    $('#content').fadeIn('slow');
});
