class Dayli {
    constructor(uid, year, date) {
        this.uid = uid;
        this.year = year;
        this.date = date;
        this.goalRef = firebase.firestore().collection(this.uid).doc('goals');
        this.goalData = null;
        this.docRef = firebase.firestore().collection(this.uid + '-' + this.year).doc(this.date);
    }
    
    init() {
        var _this = this;
        this.goalRef.get().then(function(doc) {
            if (doc.exists) { // make sure user has goals
                _this.goalData = doc.data();
                _this.getDoc(); // get today's data
            } else {
                toggleGoalDisplay();
            }
        }).catch(function(error) {
            console.log(error);
        });
        
        $('#add-goal').click(function() {
            var goal = $('#goal-input').val();
            _this.addGoal(goal);
        });
    }
    
    getDoc() {
        var _this = this;
        this.docRef.get().then(function(doc) {
            if (doc.exists) { // check if doc for today exists
                var data = doc.data();
                var complete = _this.checkComplete(data);
                
                if (complete.length == Object.keys(data).length - 1) { // if all goals are marked complete
                    _this.complete();
                } else {
                    _this.displayGoals(data);
                }
            } else { // if no doc for today, create one
                _this.createDoc();
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
    
    createDoc() {
        var data = {complete: false};
        for (var g in this.goalData) {
            data[this.goalData[g]] = false;
        }
        this.docRef.set(data).catch(function(error) {
            console.log(error);
        });
        this.displayGoals(data);
    }
    
    addGoal(goal) {
        var data = {};
        data[goal] = goal;
        if (this.goalData != null) {
            this.goalRef.update(data).then(function() {
                showAdded(goal);
            });
        } else {
            this.goalRef.set(data).then(function() {
                showAdded(goal);
            });
        }
    }
    
    displayGoals(data) {
        var _this = this;
        $('#complete').fadeOut('slow');
        $('#content').fadeOut('slow', function() {
            $('#goal-grid').empty();
            for (var d in data) {
                if (d != 'complete' && data[d] == false) { // create goal widget for all incomplete goals
                    _this.createWidget(d);
                }
            }
            _this.addClick(); // add click event handler to all goal widgets
            $('#content').fadeIn('slow');
        });
    }
    
    createWidget(goal) {
        $('#goal-grid').append(
            '<div class="goal card" id="' + goal + '"><h3>' + goal + '</h3></div>'
        );
    }

    addClick() {
        var _this = this;
        $('.card').off('click');
        $('.card').click(function(ev) {
            var goal = $(ev.target).closest('.card').attr('id');
            _this.markDone(goal);
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

function toggleGoalDisplay() {
    $('#goal-container').fadeToggle('slow');
    var upDown = $('#goal-prompt').text().split(' ').splice(-1);
    if (upDown == '\u25b4') {
        $('#goal-prompt').text('add goals \u25be');
    } else {
        $('#goal-prompt').text('add goals \u25b4');
    }
}

function showAdded(goal) {
    $('#goal-input').val('');
    $('#added').text(goal + ' has been added. it will appear starting tomorrow.').fadeIn('slow', function() {
        setTimeout(function() { $('#added').fadeOut('slow'); }, 3000);
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

$(document).ready(function() {
    $('#header').fadeIn('slow');
    $('#goal-prompt').click(function() {
        toggleGoalDisplay();
    });
});
