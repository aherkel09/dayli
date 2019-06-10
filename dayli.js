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
            if (doc.exists) { // make sure user has goals
                _this.getDoc(doc.data()); // get today's data
            } else {
                toggleGoalForm();
            }
        }).catch(function(error) {
            console.log(error);
        });
        
        $('#add-goal').click(function() {
            var goal = $('#goal-input').val();
            _this.addGoal(goal);
        });
    }
    
    getDoc(goals) {
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
        this.displayGoals(data);
    }
    
    addGoal(goal) {
        var data = {};
        data[goal] = goal;
        this.goalsRef.update(data).then(function() {
            $('#goal-input').val('');
            $('#added').text('added ' + goal).fadeIn('slow', function() {
                $('#added').fadeOut('slow');
            });
        }).catch(function(error) {
            console.log(error);
        });
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

function toggleGoalForm() {
    $('#goal-form').fadeToggle('slow');
    var plusMinus = $('#goal-prompt').text().split(' ').splice(-1);
    if (plusMinus == '+') {
        $('#goal-prompt').text('add goals -');
    } else {
        $('#goal-prompt').text('add goals +');
    }
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
