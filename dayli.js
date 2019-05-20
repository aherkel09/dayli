function setDate() {
    var date = new Date();
    $('#date').text(date.toDateString());
}

function createDate(year, date) {
    firebase.firestore().collection(year).doc(date).set({
        complete: false,
    }).then(function(doc) {
        updateGoals(doc, create=true);
    }).catch(function(error) {
        console.log(error);
    });
}

function checkDate() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var monthAndDay = month + '-' + day;
    
    firebase.firestore().collection(year).doc(monthAndDay).get().then(function(doc) {
        if (doc.exists) {
            updateGoals(doc);
        } else {
            createDate(year, monthAndDay);
        }
    }).catch(function(error) {
        console.log(error);
    });
}

function updateGoals(doc, create=false) {
    var complete = true;
    var goals = ['meditation', 'composition'];
    
    for (var g in goals) {
        if (create) {
            doc.set({g: false});
        } else if (doc.data()[g] == true) {
            $('#' + g).fadeOut('slow');
        } else {
            complete = false;
        }
    }
    
    if (complete) {
        console.log('Done for the day!');
    }
}

$(document).ready(function() {
    setDate();
    $('.card').click(function(ev) {
        checkDate();
    });
    $('#content').fadeIn('slow');
});
