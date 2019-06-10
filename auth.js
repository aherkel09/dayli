class Auth {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    
    createUser() {
        var _this = this;
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(function() {
            _this.getUserData();
        }).catch(function(error) {
            $('#invalid-auth').text(error.message);
        });
    }
    
    signIn() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(function() {
            _this.getUserData();
        }).catch(function(error) {
            $('#invalid-auth').text(error.message);
        });
    }
    
    signOut() {
        firebase.auth().signOut().then(function() {
            $('#content').remove();
            $('#calendar').remove();
        }).catch(function(error) {
            $('#invalid-auth').text(error.message);
        });
    }
    
    getUserData() {
        console.log('getting data...');
        var date = getDate(new Date());
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = String(date.getFullYear());
        
        var dayli = new Dayli(date.year, date.date);
        dayli.init();
        
        var monthli = new Monthli(day, month, year);
        monthli.getComplete();
        
        $('#content').fadeIn('slow');
    }
}

function submitAuthRequest(requestType) {
    var auth = new Auth($('#email').val(), $('#password').val());
    
    if (requestType == 'signup') {
        auth.createUser();
    } else if (requestType == 'login') {
        auth.signIn();
    }
}

$(document).ready(function() {
    $('#header').fadeIn('slow');
    $('#auth').fadeIn('slow');
});
    
    
