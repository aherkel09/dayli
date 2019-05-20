function createDate(docRef) {
    docRef.set({
        complete: false,
        meditation: false,
        composition: false,
    }).catch(function(error) {
        console.log(error);
    });
}

function checkDate() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = String(date.getFullYear());
    var monthAndDay = month + '-' + day;
    $('#date').text(date.toDateString());
    
    var ref = firebase.firestore().collection(year).doc(monthAndDay);
    ref.get().then(function(doc) {
        if (doc.exists) {
            updateGoalsFromDB();(doc.data());
        } else {
            createDate(ref);
        }
    }).catch(function(error) {
        console.log(error);
    });
}

function updateGoalsFromDB(data) {
    var complete = true;
    for (var d in data) {
        if (data[d] == true) {
            $('#' + d).fadeOut('slow');
        } else if (data[d] == false) {
            complete = false;
        }
    }
    
    if (complete) {
        alert('Done for the day!');
    }
}

function markDone(ev) {
    var goal = $(ev.target).closest('.card').attr('id');
    console.log('Marking ' + goal + ' done...');
}

$(document).ready(function() {
    checkDate();
    $('.card').click(function(ev) {
        markDone(ev);
    });
    $('#content').fadeIn('slow');
});
