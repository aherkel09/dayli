class Dayli {
    constructor(uid, year, date) {
        this.uid = uid;
        this.year = year;
        this.date = date;
        this.docRef = firebase.firestore().collection(this.uid + '-' + this.year).doc(this.date);
    }
    
    init() {
        this.addClick();
        this.getDoc();
    }
    
    addClick() {
        var _this = this;
        $('.card').off('click');
        $('.card').click(function(ev) {
            var goal = $(ev.target).closest('.card').attr('id');
            _this.markDone(goal);
        });
    }
    
    getDoc() {
        var _this = this;
        this.docRef.get().then(function(doc) {
            if (doc.exists) {
                var data = doc.data();
                var complete = _this.checkComplete(data);
                
                if (complete.length == Object.keys(data).length - 1) {
                    _this.complete();
                } else {
                    displayGoals(data, complete);
                }
            } else {
                _this.createDoc();
                displayAll();
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
        return complete;
    }
    
    complete() {
        this.docRef.update({
            complete: true,
        }).catch(function(error) {
            console.log(error);
        });
        completeDay(this.year, this.date);
    }
}

function displayGoals(data, goalArray) {
    $('#complete').fadeOut('slow', function() {
        $('#content').fadeIn('slow');
    });
    for (var d in data) {
        if (goalArray.includes(d)) { 
            $('#' + d).fadeOut('slow');
        } else if (d != 'complete') {
            $('#' + d).fadeIn('slow');
        }
    }
}

function displayAll() {
    $('#complete').fadeOut('slow', function() {
        $('#content').fadeIn('slow');
        $('.card').fadeIn('slow');
    });
}

function completeDay(year, date) {
    $('#content').fadeOut('slow', function() {
        $('#complete').fadeIn('slow');
    });
    var dayAndMonth = date.split('-');
    var selectDate = dayAndMonth[1] + '-' + dayAndMonth[0] + '-' + year;
    calendar.select(selectDate);
    styleSelected();
}
