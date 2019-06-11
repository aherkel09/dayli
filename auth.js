class Auth {
    init() {
        var _this = this;
        
        $('#signin').click(function() {
            _this.googleSignIn();
        });
        
        $('#signout').click(function() {
            _this.signOut();
        });
    }
    
    googleSignIn() {
        var _this = this;
        var provider = new firebase.auth.GoogleAuthProvider();
        
        firebase.auth().signInWithPopup(provider).then(function(result) {
            _this.showSignedIn(result.user.uid);
        }).catch(function(error) {
            console.log(error.message);
        });
    }
    
    signOut() {
        firebase.auth().signOut().then(function() {
            $('#content, #calendar, #goal-prompt, #goal-container, #date, #signout').fadeOut('slow', function() {
                $('#calendar').empty();
            });
            $('#signin').fadeIn('slow');
        }).catch(function(error) {
            $('#invalid-auth').text(error.message);
        });
    }
    
    showSignedIn(userId) {
        $('#signin').fadeOut('slow');
        $('#signout').fadeIn('slow');
        this.getUserData(userId);
    }
    
    getUserData(userId) {
        var date = getDate(new Date());
        
        var dayli = new Dayli(userId, date.year, date.date);
        dayli.init();
        
        var monthli = new Monthli(userId, date.day, date.month, date.year);
        monthli.getComplete();
        
        $('#goal-prompt, #content, #calendar').fadeIn('slow');
    }
}

function getDate(date) {
    var text = date.toDateString();
    var year = String(date.getFullYear());
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var date = String(month) + '-' + String(day);
    
    $('#date').fadeOut('slow', function() {
        $('#date').text(text).fadeIn('slow');
    });
    return {
        year: year,
        month: month,
        day: day,
        date: date,
    };
}
    
 $(document).ready(function() {
     var auth = new Auth();
     auth.init();
     
     firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
             auth.showSignedIn(user.uid);
         } else {
             $('#signin').fadeIn('slow');
             $('#signout').fadeOut('slow');
         }
     });
 });
