function setDateText() {
    var date = new Date();
    $('#date').text(date.toDateString());
}

function createDate(docRef) {
    docRef.set({
        meditation: false,
        composition: false,
    }).catch(function(error) {
        console.log(error);
    });
}

function checkDate() {
    var ref = getRef();
    ref.get().then(function(doc) {
        if (doc.exists) {
            console.log(doc.data());
            updateGoalsFromDB(doc.data());
        } else {
            createDate(ref);
        }
    }).catch(function(error) {
        console.log(error);
    });
}

function getRef() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = String(date.getFullYear());
    var monthAndDay = month + '-' + day;
    return firebase.firestore().collection(year).doc(monthAndDay);
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
        $('#content').fadeOut('slow', function() {
            $('#complete').fadeIn('slow');
        });
    }
}

function markDone(ev) {
    var data = {};
    var goal = $(ev.target).closest('.card').attr('id');
    data[goal] = true;
    var ref = getRef();
    ref.update(data).then(function() {
        checkDate();
    }).catch(function(error) {
        console.log(error);
    });
}

$(document).ready(function() {
    setDateText();
    checkDate();
    $('.card').click(function(ev) {
        markDone(ev);
    });
    $('#content').fadeIn('slow');
});
