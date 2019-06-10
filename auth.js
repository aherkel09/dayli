import { Dayli } from 'dayli.js'
import { Monthli } from 'monthli.js'

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
            _this.getUserData(user.uid);
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
        var date = getDate(new Date());
        
        /*
        var dayli = new Dayli(userId, date.year, date.date);
        dayli.init();
        
        var monthli = new Monthli(userId, date.day, date.month, date.year);
        monthli.getComplete();
        */
        
        $('#content').fadeIn('slow');
    }
}

function submitAuthRequest() {
    var auth = new Auth($('#email').val(), $('#password').val());
    auth.googleSignIn();
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
    $('#header').fadeIn('slow');
    $('#auth').fadeIn('slow');
});
    
    
