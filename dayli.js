class Dayli {
    constructor(uid, year, date) {
        this.uid = uid;
        this.year = year;
        this.date = date;
        this.goalsRef = firebase.firestore().collection(this.uid).doc('goals');
        this.docRef = firebase.firestore().collection(this.uid + '-' + this.year).doc(this.date);
    }
    
    init() {
        var _this = this;
        this.goalsRef.get().then(function(doc) {
            if (doc.exists) {
                var goals = doc.data();
                _this.addClick();
                _this.getDoc(goals);
            } else {
                $('#goal-form').fadeIn('slow');
                $('#add-goal').click(function() {
                    var goal = $('#goal-input').val();
                    _this.addGoal(goal);
                });
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
                    displayGoals(data);
                }
            } else {
                _this.createDoc(goals);
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
    
    createDoc(goalObj) {
        var data = {complete: false};
        for (var g in goalObj) {
            data[goalObj[g]] = false;
        }
        this.docRef.set(data).catch(function(error) {
            console.log(error);
        });
        displayGoals(data);
    }
    
    addGoal(goal) {
        var data = {};
        data[goal] = goal;
        this.goalsRef.set(data).then(function() {
            $('#goal-input').val('');
            $('#added').text('added ' + goal).fadeIn('slow', function() {
                $('#added').fadeOut('slow');
            });
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

function displayGoals(data) {
    $('#complete').fadeOut('slow');
    $('#content').fadeOut('slow', function() {
        $('#goal-grid').empty();
        for (var d in data) {
            if (d != 'complete') {
                createWidget(d);
            }
        }
        $('#content').fadeIn('slow');
    });
}

function createWidget(goal) {
    $('#goal-grid').append('<div class="hidden card" id="' + goal + '"><h3>' + goal + '</h3></div>');
    $('#' + goal).fadeIn('slow');
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
