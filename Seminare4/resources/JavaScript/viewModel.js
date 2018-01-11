function deleteCommentFromServer(user, recipe, timeCreated) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(JSON.parse(this.responseText));
        }


    };
    xmlhttp.open("GET", "http://localhost/~Likecoke/Seminare4/deleteCommentJSON.php?user=" + user +"&recipe=" + recipe +  "&timecreated=" + timeCreated, true);
    xmlhttp.send();

};

function addCommentsToServer(user, recipe, comment, timeCreated) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(JSON.parse(this.responseText));
        }


    };
    xmlhttp.open("GET", "http://localhost/~Likecoke/Seminare4/commentJSON.php?user=" + user +"&recipe=" + recipe +  "&comment=" + comment + "&timecreated=" + timeCreated, true);
    xmlhttp.send();


};


function cookieHandler(cookieName){
    try{
        if(cookieName == ""){
            throw "empty search term";
        }
        var cookiesArray = document.cookie.split(';');
        for( var i = 0; i< cookiesArray.length; i++){
            cookiesArray[i] = cookiesArray[i].trim();

            //Search for in the beginning of string
            var searchCookie = cookiesArray[i].search("^" + cookieName);

            if(searchCookie == 0){

                return cookiesArray[i].substring(cookieName.length+1);
            }

        }
        return null;
    }
    catch(error){
        alert(error);

    }


};

function getComments(recipe, callback, callbackObject) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var cArray = JSON.parse(this.responseText);

            callback.call(callbackObject, cArray);


        }


    };

    xmlhttp.open("GET", "http://localhost/~Likecoke/Seminare4/commentsJSON.php?recipe=" + recipe, true);
    xmlhttp.send();


}


function ViewModel(recipe){
    var self = this;
    self.recipe = recipe;
    self.commentArray = ko.observableArray();
    self.cookie = ko.observable(cookieHandler('user'));
    self.newComment = ko.observable();
    self.commentAs = ko.computed(function () {
        return 'Comment as: ' + self.cookie();

    });


    self.deleteComment = function (comment) {

        self.commentArray.remove(comment);
        deleteCommentFromServer(comment.username, self.recipe, comment.timecreated);
    };
    self.addComment = function () {

        var timeCreated = Date.now();
        self.commentArray.push({"timecreated": timeCreated, "username": self.cookie(),"text": self.newComment() });
        addCommentsToServer(self.cookie(), self.recipe, self.newComment(), timeCreated);
        self.newComment("");

    };

    self.loadCommentsAndApplyBindings = function () {
        getComments(self.recipe, function (array){

            this.commentArray =  ko.observableArray(array);

            ko.applyBindings(this);

        }, self);


    };

}



function createViewModel(recipe) {

            var viewModel = new ViewModel(recipe);
            viewModel.loadCommentsAndApplyBindings();

}

