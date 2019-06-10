class Dayli {
    constructor(uid, year, date) {
        this.uid = uid;
        this.year = year;
        this.date = date;
        this.goalsRef = firebase.firestore().collection(this.uid + '-' + this.year).doc(this.date);
        this.docRef = firebase.firestore().collection(this.uid + '-' + this.year).doc(this.date);
    }
    
    init() {
        var _this = this;
        this.goalsRef.get().then(function(doc) {
            if (doc.exists) {
                var goals = doc.data();
                createWidgets(goals);
                _this.addClick();
                _this.getDoc(goals);
            } else {
                console.log('no goals yet!');
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
    
    addClick() {
        var _this = this;
        $('.card').off('click');
        $('.card').click(function(ev) {
            var goal = $(ev.target).closest('.card').attr('id');
            _this.markDone(goal);
        });
    }
    
    getDoc(goals) {
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
                _this.createDoc(goals);
                displayAll();
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
    
    createDoc(goalObj) {
        var data = {};
        for (var g in goalObj) {
            data[goalObj[g]] = false;
        }
        this.docRef.set(data).catch(function(error) {
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

function createWidgets(goalObj) {
    for (var g in goalObj) {
        $('#goal-grid').append('<div class="card" id="' + goalObj[g] + '"><h3>' + goalObj[g] + '</h3></div>');
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
    dayliCalendar.select(selectDate); // global jsCalendar instance created in calendar.js
    styleSelected(); // defined in calendar.js
}
