class Auth {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    
    googleSignIn() {
        var _this = this;
        var provider = new firebase.auth.GoogleAuthProvider();
        
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var user = result.user;
            $('#auth').fadeOut('slow');
            this.getUserData(user.uid);
        }).catch(function(error) {
            console.log(error.message);
        });
    }
    
    signOut() {
        firebase.auth().signOut().then(function() {
            $('#content').remove();
            $('#calendar').remove();
            $('#auth').fadeIn('slow');
        }).catch(function(error) {
            $('#invalid-auth').text(error.message);
        });
    }
    
    getUserData(userId) {
        console.log('getting data for ' + userId);
        var date = getDate(new Date());
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = String(date.getFullYear());
        
        /*
        var dayli = new Dayli(date.year, date.date);
        dayli.init();
        
        var monthli = new Monthli(day, month, year);
        monthli.getComplete();
        */
        
        $('#content').fadeIn('slow');
    }
}

function submitAuthRequest() {
    var auth = new Auth($('#email').val(), $('#password').val());
    auth.googleSignIn();
}

$(document).ready(function() {
    $('#header').fadeIn('slow');
    $('#auth').fadeIn('slow');
});
    
    
