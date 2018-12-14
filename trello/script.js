var config = {
    apiKey: "AIzaSyATpVCz2GPFTGzv2rf6N-ixSZfNwtTKnpI",
    authDomain: "trello-ded6d.firebaseapp.com",
    databaseURL: "https://trello-ded6d.firebaseio.com",
    projectId: "trello-ded6d",
    storageBucket: "trello-ded6d.appspot.com",
    messagingSenderId: "560969960333"
};

var db = firebase.initializeApp(config).database();

var loginInformationRef = db.ref('loginInformation');
var listsRef = db.ref('lists');

var storageRef = firebase.storage().ref();
var imagesRef = db.ref('images');

var listsRef = db.ref('lists');

var cardRef = db.ref('lists/0/listItem');

Vue.use(VueFire);


//Login, Registration, and Updates of new Users
var app = new Vue({
  el: "#login",
    
  data: function() {
    return {   
      inputtedUsername: "", 
      inputtedEmail: "",
      inputtedPhoto: "",    
      inputtedColor: "",
      header: "Enter/Update User Information Below",
      numUsers: 5,
      imageURL: "",
    };
  },
    
  firebase: {
      users:  loginInformationRef,
      images: imagesRef
  },
    
  methods: {
    logIn: function(){
        var formUsername = this.inputtedUsername;

        //jQuery.each(this.users, function(i) {  
        for (var i=0; i<this.numUsers; i++){
        if (this.users[i] !== null){
            if (formUsername == this.users[i].username || formUsername == this.users[i].email) {
                  $("#listContainer")[0].style.visibility = "visible";
                  $("#login")[0].style.visibility = "hidden";
                  $("body")[0].style.backgroundColor = this.users[i].backgroundColor;
                  $("#listElements")[0].style.visibility = "visible";
                  $("#userImg")[0].style.visibility = "visible";
                  //change card layout based on JSON file - look/cards/displayed/etc
                  this.imageURL = this.images[i].url;
              return;
              }
        }
        }
          alert("bad Email/username"); //UPDATE TO TEXT ON SCREEN
    
    },
    register: function(){
        $("#initialLogin")[0].style.visibility = "hidden";
        $("#createUser")[0].style.visibility = "visible";
    }, 
    storeImage: function() {
        var input = document.getElementById('files');
        if (input.files.length > 0) {
            var file = input.files[0];        
            storageRef.child('images/' + file.name)
                      .put(file)
                      .then(function (snapshot){
                            imagesRef.push({
                                url: snapshot.downloadURL
                            });
                        });
            input.value = '';
            }
    },   
    registerNewUser: function(){
        this.numUsers += 1;
        loginInformationRef.push({
            username: this.inputtedUsername,
            email: this.inputtedEmail,
            backgroundColor: this.inputtedColor,
            userNum: this.numUsers,
        });     
    },
    update: function(){
      if (this.inputtedUsername.length < 1 && this.inputtedEmail.length < 1 ){
          alert("Please input your username or email to update your settings.");
      }
      else {
          //change 0 to relevant location
          db.ref("loginInformation/0").update({
                username: this.inputtedUsername,
                email: this.inputtedEmail,
                backgroundColor: this.inputtedColor,
          });     
        }
          
    },
    handler: function(){
        this.storeImage();
        this.registerNewUser();
    }
  }
});
app.$mount('#login');


var app1 = new Vue({
    el: "#listContainer",
    data: function(){
        return {
            backgroundColorInput: "",

            Lists: [
                {num: 1,
                 listName: "Example List", 
                 listDescription: "Example List Description",
                 listStyle: "50em",
                 listItem: [
                     {
                         identifier: 0,
                         name: "Card 1",
                         description: "Card 1 Description", //can include HTML tags
                         listAssigned: "Example List",
                         created: "1/10/18",
                         due: "2/10/18",
                         percentageCompleted: 40,
                         category: "Monday",
                         imageAttachments: "",
                         toDoList: "",
                         comments: [],
                         assignedUsers: [],

                     }, 
                     {
                         identifier: 1,
                         name: "Card 2",
                         description: "Card 2 Description", //can include HTML tags
                         listAssigned: "Example List",
                         created: "1/10/18",
                         due: "2/10/18",
                         percentageCompleted: 40,
                         category: "Monday",
                         imageAttachments: "",
                         toDoList: "",
                         comments: "",
                         assignedUsers: "",

                     }

                 ],
                },
            ],
            
            listNameInput: "",
            listDescriptionInput: "",
            numLists: 1,

        
            listNameChangeInput: "",
            editViewInput: "",
            listDescriptionChangeInput: "",
            HTMLInput: "",
            //ARE THE ABOVE USED?

            newItemListInput: "",

            newListInput: "",

            listToBeEdited: 0,


            //CARD VARIABLES

            cardNameInput: "",
            cardDescriptionInput: "",
            cardIdentifier: 0,
            assignCardInput: "",
            cardCreatedInput: "",
            cardDueInput: "",
            cardCompletionInput: "",
            cardCategoryInput: "",
            cardToDoInput: "",

            expandName: "",
            expandDescription: "",
            expandListAssigned: "",
            expandDate: "",
            expandDue: "",
            expandPercentageCompleted: "",
            expandCategory: "",
            expandToDo : "",
            expandComments: "",
            expandUsers: "",
            
            cardNameChangeInput: "",
            
            categoryInput: "",
            categoryColorInput: "",
            
            categoryVisibilityInput: "", 
            dateVisibilityInput: "",
            
            commentInput: "",
            userInput: "",
            
            paramA: 0,
            paramB: 0,
            
            
            
        };
    },
    firebase: {
      lists:  listsRef,
    },
    methods: {
        
        //List Functions
        
        changeBackground: function (color) {
            if (color.includes('www.')){
                console.log("true");
                $("body")[0].style.backgroundImage = "url('"+color+"')";
            }
            else{
                $("body")[0].style.backgroundColor = color;
            }       
        },
        createList: function(name, description){
            this.numLists += 1;
            listsRef.push(
                {num: this.numLists,
                 listName: name,
                 listDescription: description,
                 listItem: [""],
                });
            this.Lists.push(
                {num: this.numLists,
                 listName: name,
                 listDescription: description,
                 listItem: []
                });
        },
        editList: function(listIdentifier){
            $("#listElementsContainer")[0].style.opacity = ".05";
            $("#listInputs")[0].style.opacity = ".05";
            $("#editListContainer")[0].style.visibility = "visible";
            this.listToBeEdited = listIdentifier;
        },
        closeEditList: function(){
            $("#listElementsContainer")[0].style.opacity = "1";
            $("#listInputs")[0].style.opacity = "1";
            $("#editListContainer")[0].style.visibility = "hidden";
        },
        deleteList: function(){
            this.numLists -= 1;
            this.Lists.splice(this.listToBeEdited-1, 1);
            //console.log(this.listToBeEdited);
            //console.log(this.lists.length+1);
            if (this.listToBeEdited === this.Lists.length+1){
                this.Lists.splice(this.listToBeEdited, 1);}
            db.ref("lists/0").remove();
            
        },
        edit: function(editNameInput, editDescriptionInput, editViewInput){
            this.Lists[this.listToBeEdited-1].listName = editNameInput;
            this.Lists[this.listToBeEdited-1].listDescription = editDescriptionInput;
            if (editViewInput === "Collapsed" || editViewInput === "collapsed"){
                console.log("collapsed");
                this.Lists[this.listToBeEdited-1].listStyle = "5%";
                
            }
            if (editViewInput === "Expanded" || editViewInput === "expanded"){
                console.log("expanded");
               this.Lists[this.listToBeEdited-1].listStyle = "100%"; 
            }
            db.ref("lists/0").update(
                {listName: editNameInput,
                 listDescription: editDescriptionInput,
                 listStyle: editViewInput,
                });
        },
        addListItem: function(newListItem, num){
            console.log("called");
            var y = this.Lists[num].listItem;
            //var x = this.lists[this.listToBeEdited].listItem.length;
            y.push(newListItem);
            db.ref("lists").push;
        },
        shiftLeft: function(listIdentifier){
            if (this.Lists[listIdentifier-2] === null || this.Lists[listIdentifier-1] === null){
                console.log("beginning of list");
            }
            else{
                var placeHolder = this.Lists[listIdentifier-2];
                var placeHolder2 = this.Lists[listIdentifier-1];

                this.Lists.splice(listIdentifier-2, 1, placeHolder2); 
                this.Lists[listIdentifier-2].num -= 1;

                this.Lists.splice(listIdentifier-1, 1, placeHolder);
                this.Lists[listIdentifier-1].num += 1;
            }
            
        },
        shiftRight: function(listIdentifier){
            
            if (this.Lists[listIdentifier-1] === null || this.Lists[listIdentifier] === null){
                console.log("end of list");
            }
            else{
                var placeHolder = this.Lists[listIdentifier-1];
                var placeHolder2 = this.Lists[listIdentifier];

                this.Lists.splice(listIdentifier-1, 1, placeHolder2); 
                this.Lists[listIdentifier-1].num -= 1;

                this.Lists.splice(listIdentifier, 1, placeHolder);
                this.Lists[listIdentifier].num += 1;
            }
        },
        
        //Card Functions
        openAddList: function(num){
            $("#listElementsContainer")[0].style.opacity = ".05";
            $("#listInputs")[0].style.opacity = ".05";
            $("#editItemContainer")[0].style.visibility = "visible";
            this.cardIdentifier = num;
        },
        closeAddCardList: function(){
            $("#listElementsContainer")[0].style.opacity = "1";
            $("#listInputs")[0].style.opacity = "1";
            $("#editItemContainer")[0].style.visibility = "hidden";
        },
        addNewCard: function(a, b, c, d, e, f, g, h){   
            for (var k = 0; k < this.Lists.length; k++){
                console.log(this.Lists[k].listName);
                if (c === this.Lists[k].listName){
                    this.Lists[k].listItem.push(
                        {identifier: this.Lists[k].listItem.length,
                         name: a,
                         description: b,
                         listAssigned: c,
                         created: d,
                         due: e,
                         percentageCompleted: f,
                         cardCategoryInput: g,
                         toDoList: h,
                    });
                }
            }
            
            db.ref('/lists/0/listItem').push(
                            {identifier: this.Lists[k].listItem.length,
                             name: a,
                             description: b,
                             listAssigned: c,
                             created: d,
                             due: e,
                             percentageCompleted: f,
                             cardCategoryInput: g,
                             toDoList: h,
                            });
        },
        
        expandCard: function(event){
            $("#listElementsContainer")[0].style.opacity = ".05";
            $("#listInputs")[0].style.opacity = ".05";
            $("#expandedCardView")[0].style.visibility = "visible";
          
            
            var arrNum = event.currentTarget.id.split("-");
            var numA = parseInt(arrNum[0])-1; 
            var numB = parseInt(arrNum[1]); 
            
            //console.log(numA);
            //console.log(numB);
            
            
            
            var arrA = this.Lists[numA].listItem[numB];
            
            this.expandName = arrA.name;
            this.expandDescription = arrA.description;
            this.expandListAssigned = arrA.listAssigned;
            this.expandData = arrA.date;
            this.expandDue = arrA.due;
            this.expandPercentageCompleted = arrA.percentageCompleted;
            this.expandCategory = arrA.category;
            this.expandToDo = arrA.toDoList;
            this.expandComments = arrA.comments;
            this.expandUsers = arrA.assignedUsers;
            

        },
        closeCard: function(){
            $("#listElementsContainer")[0].style.opacity = "1";
            $("#listInputs")[0].style.opacity = "1";
            $("#expandedCardView")[0].style.visibility = "hidden";
        },
        shiftCardRight: function(a, b){
            //Make sure indecies align correctly
            var arr = this.Lists[a-1].listItem[b];
            /* Write in a better function to prevent incorrect index movement
            if (this.lists[a-1].listItem.length === 1){
                console.log("cannot move last item");
                return;
            }
            */
            console.log("array length" + this.Lists[a-1].listItem.length);
            console.log(a);
            console.log(b);
            this.Lists[a].listItem.push(
                        {identifier: this.Lists[a].listItem.length,
                         name: arr.name,
                         description: arr.description,
                         listAssigned: arr.listAssigned,
                         created: arr.created,
                         due: arr.due,
                         percentageCompleted: arr.percentageCompleted,
                         cardCategoryInput: arr.cardCategoryInput,
                    });
            $("#individualList" + a + '-' + b).remove();
            //delete old card
        },
        shiftCardLeft: function(a, b){
            //Make sure indecies align correctly
            var arr = this.Lists[a-1].listItem[b];
            /* Write in a better function to prevent incorrect index movement
            if (this.lists[a-1].listItem.length === 1){
                console.log("cannot move last item");
                return;
            }
            */
            this.Lists[a-2].listItem.push(
                        {identifier: this.Lists[a-1].listItem.length,
                         name: arr.name,
                         description: arr.description,
                         listAssigned: arr.listAssigned,
                         created: arr.created,
                         due: arr.due,
                         percentageCompleted: arr.percentageCompleted,
                         cardCategoryInput: arr.cardCategoryInput,
                    });
            //console.log("array length" + this.lists[a-1].listItem.length);
            //console.log(a);
            //console.log(b);
            $("#individualList" + a + '-' + b).detach();
            //delete old card
        },
        deleteCard: function(a, b){
            $("#individualList" + a + '-' + b).detach();
        },
        openEditCard: function(){
            $("#editCard")[0].style.zIndex = "2";
            $("#editCard")[0].style.visibility = "visible";
        },
        closeEditCard: function(){
            
            $("#editCard")[0].style.visibility = "hidden";
        },
        editCard: function(event){
            var arrNum = event.currentTarget.id.split("-");
            
            var numA = parseInt(arrNum[0]); 
            var numB = parseInt(arrNum[1]); 
        
            this.Lists[numA].listItem[numB].name = this.cardNameChangeInput;
        },
        colorCategory: function(a, b){
          for (var k = 0; k<this.Lists.length; k++){
              for (var j = 0; j < this.Lists[k].listItem.length; j++ ){
                  console.log(this.Lists[k].listItem[j].category);
                  if (this.Lists[k].listItem[j].category = a){
                      var a = '#individualList' + (k+1) + '-' + j;
                      console.log(a);
                      $(a)[0].style.backgroundColor = b;
                  }
              }
          }
        },
        visibleCategory: function(w, q){
          for (var k = 0; k<this.Lists.length; k++){
              for (var j = 0; j < this.Lists[k].listItem.length; j++ ){
                  
                  if (this.Lists[k].listItem[j].category == w){
                      var dummy = '#individualList' + (k+1) + '-' + j;
                      $(dummy)[0].style.visibility = "visible";
                  }
                  else if (this.Lists[k].listItem[j].created == q){
                      var dummy1 = '#individualList' + (k+1) + '-' + j;
                      $(dummy1)[0].style.visibility = "visible";
                  }
                  else {
                     var dummy2 = '#individualList' + (k+1) + '-' + j;
                     $(dummy2)[0].style.visibility = "hidden"; 
                  }
              }
          }
        },
        orientLists: function(){
            for (var k = 0; k<this.Lists.length; k++){
              for (var j = 0; j < this.Lists[k].listItem.length; j++ ){
                $("#listElementsContainer li")[j].style.width = "40%";
                $("#listElementsContainer li")[j].style.display = "inline-block";
                $("#listElements")[k].style.margin = "1%";
                $("#listElements")[k].style.height = "30em";
                $("#listElements")[k].style.width = "98%";
              }
            }
        },  
        orientListsVert: function(){
            for (var k = 0; k<this.Lists.length; k++){
              for (var j = 0; j < this.Lists[k].listItem.length; j++ ){
                $("#listElementsContainer li")[j].style.display = "inline-block";
                $("#listElements")[k].style.margin = "2%";
                $("#listElements")[k].style.height = "50em";
                $("#listElements")[k].style.width = "30%";
              }
            }
        }, 
        addUsers: function(a, b){
            this.paramA = a;
            this.paramB = b; 
            $("#commentsUsers")[0].style.visibility = "visible";
        },
        addComments: function(a, b){
            this.paramA = a;
            this.paramB = b;
            $("#commentsUsers")[0].style.visibility = "visible";
        },
        closeUsersComments: function(){
            $("#commentsUsers")[0].style.visibility = "hidden";
        },
        addCU: function(){
            this.Lists[this.paramA-1].listItem[this.paramB].assignedUsers.push(this.userInput);
            
            
            this.Lists[this.paramA-1].listItem[this.paramB].comments.push(this.commentInput);
            
            
        }
    }
});
app1.$mount('#listContainer');




