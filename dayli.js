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
            var goal = $('#goal-input').val().toLowerCase();
            var amount = $('#amount-input').val();
            _this.addGoal(goal, amount);
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
            data[g] = [0, this.goalData[g]];
        }
        this.docRef.set(data).catch(function(error) {
            console.log(error);
        });
        this.displayGoals(data);
    }
    
    addGoal(goal, amount) {
        var data = {};
        if (amount && !isNaN(amount)) {
            data[goal] = Number(amount);
        } else {
            data[goal] = 1;
        }
        
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
                if (d != 'complete' && data[d][0] < data[d][1]) { // create goal widget for all incomplete goals
                    _this.createWidget(d, data[d]);
                }
            }
            $('#content').fadeIn('slow');
        });
    }
    
    createWidget(goal, progress) {
        $('#goal-grid').append(
            '<div class="goal card" id="' + goal + '"><h3>' + goal + '</h3></div>'
        );
        if (progress[1] > 1) {
            $('#' + goal).append(
                '<p>' + 
                    '<input size="4" class="progress-input" id="' + goal + '-progress" value="' + progress[0] + '">' + 
                    ' / ' + progress[1] + 
                '</p>'
            );
            this.addProgressListener(goal, progress[1]); // update progress on input change
        } else {
            this.addClick(goal); // add click event handler to single-step goal widgets
        }
            
    }

    addClick(goal) {
        var _this = this;
        $('#' + goal).off('click');
        $('#' + goal).click(function(ev) {
            _this.updateProgress(goal, 1, 1);
        });
    }
    
    addProgressListener(goal, amount) {
        var _this = this;
        $('#' + goal + '-progress').change(function() {
            var progress = $('#' + goal + '-progress').val();
            if (!isNaN(progress)) {
                _this.updateProgress(goal, Number(progress), amount)
            }
        });
    }
                
    updateProgress(goal, progress, amount) {
        var _this = this;
        var data = {};
        data[goal] = [progress, amount];
        this.docRef.update(data).then(function() {
            _this.getDoc();
        }).catch(function(error) {
            console.log(error);
        });
    }
    
    checkComplete(data) {
        var complete = [];
        for (var d in data) {
            if (!Array.isArray(data[d]) && data[d] == true && d != 'complete') { // support legacy data structure
                complete.push(d);
            } else if (data[d][0] >= data[d][1] && d != 'complete') {
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
        $('#goal-prompt').text('add/update goals \u25be');
    } else {
        $('#goal-prompt').text('add/update goals \u25b4');
    }
}

function toggleDay(ev) {
    $(ev.target).toggleClass('deselected-day');
}

function showAdded(goal) {
    $('#goal-input').val('');
    $('#added').text('your goal, ' + goal + ', has been updated. changes will appear starting tomorrow.').fadeIn('slow', function() {
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
