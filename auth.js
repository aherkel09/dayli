class Auth {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    
    createUser() {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function(error) {
            $('#invalid-auth').text(error.message);
        });
    }
    
    signIn() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function(error) {
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
    $('#auth').fadeIn('slow');
});
    
    
