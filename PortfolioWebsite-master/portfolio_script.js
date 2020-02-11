// MEDIA QUERIES 
// x is small, y is medium, z is large - same breakpoints as the scss files!!
// try to avoid this where possible in design, account for complexity 
var x = window.matchMedia("(max-width: 620px)");
var y = window.matchMedia("(min-width: 620px) and (max-width: 870px)");
var z = window.matchMedia("(min-width: 870px)");

// GLOBAL VARIABLES 
// for displaying on the error page if needed 
var error_portfolioload;

// CMS content arrays 
var id_list = [];
var title_list = [];
var picture_list = [];
var content_list = [];

// Search match arrays
var idmatch_list = [];
var titlematch_list = [];
var picturematch_list = [];

// sessionstorage to use on the next page 
var projectID_clicked;

// content to retrieve when resized 
var onresize_content = 0; 



// CREATE PROJECTS SECTION WITH FLEXBOX ONE TIME 
// create projects section 
var projects_section = document.createElement("div");
projects_section.id = "projects";
document.getElementById("body").appendChild(projects_section);

// console.log(title_list.length);
// create main flexbox 
var flexbox_projects = document.createElement("div");
flexbox_projects.className = "flex-container";
flexbox_projects.id = "flexbox_projects";
document.getElementById("projects").appendChild(flexbox_projects);


// FIREBASE & FLAMELINK CONNECTION 
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAC-j2nR9tGDYkNXbWoD-uI0UUNK_69JEs",
    authDomain: "flamelink-cms-6e444.firebaseapp.com",
    databaseURL: "https://flamelink-cms-6e444.firebaseio.com",
    projectId: "flamelink-cms-6e444",
    storageBucket: "flamelink-cms-6e444.appspot.com",
    messagingSenderId: "826480774307",
    appId: "1:826480774307:web:e716d698ddcac596384316"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const app = flamelink({
    firebaseApp,
    env: 'production', // optional, defaults to `production`
    locale: 'en-US', // optional, defaults to `en-US`
    dbType: 'cf' // optional, defaults to `rtdb` - can be 'rtdb' or 'cf' (Realtime DB vs Cloud Firestore)
  })

// DEFINE WHAT HAPPENS WHEN LOADING THE PAGE 
$("#logo_svg").velocity({marginLeft: "10%"}, {delay : 0, duration : 600});


// make the Flamelink call, load the projects 
function startPage(){

  // CMS Network Call 
  app.content.get({

    schemaKey: 'portfolioProject',
    fields: ['projectTitel', 'overzichtsfotoProject', 'projectinhoud'],
    populate: true

  }).then(portfolioProjects => {

    listProjects(portfolioProjects);

    // LOADING LOGIC FOR THE PROJECTS 
    loadProjects();

  }).catch(function(error){

    console.log(error);
    var error_string = String(error).split("]:")[1];
    error_portfolioload = error_string; 

    // error page logic is being run
    errorPage();

  });
}

// HELPER FUNCTION - split string to get out error code 
function getSecondPart(str) {

  return str.split(']:')[1];

}

function listProjects(projects) {

  Object.keys(projects || {}).forEach(projectId => {

    // populate arrays from projects 
    id_list.push(projectId);
    title_list.push(projects[projectId].projectTitel);
    picture_list.push(projects[projectId].overzichtsfotoProject[0].url);
    content_list.push(projects[projectId].projectinhoud);

  })
}

// on keyup in the search input element 
// make sure you use timeout to avoid overloading the network 
var timeout = null;

function searchContent(){

  // clear the timeout if it has been previously set 
  clearTimeout(timeout);

  // Make a new timeout set to go off in 500ms
  timeout = setTimeout(function () {

    // empty flexbox and repopulate 
    var flexbox_empty = document.getElementById("flexbox_projects");
    while (flexbox_empty.firstChild){

      flexbox_empty.removeChild(flexbox_empty.firstChild);

    }

    // empty the previous search lists
    titlematch_list = [];
    idmatch_list = [];
    picturematch_list = [];

    // check the input value in the search bar on stopping typing for 500ms
    var input_value = document.getElementById("search_bar").value;

    // YOUR SEARCH LOGIC NEEDS TO END UP HERE 
    // search var content_list = []; to see in which element(s) the search term can be found.. 
    for (var k=0 ; k < content_list.length; k++){
      
      // if the item in search box can be found in element of content list 
      if((content_list[k].search(input_value)) >= 0){

        // add corresponding project title to array - add corresponding project id to array 
        titlematch_list.push(title_list[k]);
        idmatch_list.push(id_list[k]);
        picturematch_list.push(picture_list[k]);
        
      };
    }

    for (j=0; j < titlematch_list.length; j++){

      // flexbox container
      var searchcont_project = document.createElement("div");
      searchcont_project.className = "container_project";
      searchcont_project.id = "cont_project";
      document.getElementById("flexbox_projects").appendChild(searchcont_project);

      // container for image and sliver 
      var searchcont_elements = document.createElement("div");
      searchcont_elements.className = "container_elements";
      searchcont_elements.id = "cont_element" + j;
      searchcont_project.appendChild(searchcont_elements);

      // project image
      var searchimg_project = document.createElement("img");
      searchimg_project.className = "main_picture";
      searchimg_project.id = "main_pic" + j;
      searchimg_project.src = picturematch_list[j];
      searchcont_elements.appendChild(searchimg_project);

      // sliver project 
      var searchslvr_project = document.createElement("div");
      searchslvr_project.className = "sliver_project";
      searchslvr_project.id = "sliver"+ j ;
      searchcont_elements.appendChild(searchslvr_project);
  
      // title project 
      var searchtitle_project = document.createElement("p");
      searchtitle_project.className = "title_project";
      searchslvr_project.appendChild(searchtitle_project);
      searchtitle_project.innerHTML = titlematch_list[j];
      console.log(titlematch_list[j]);

      // cover project 
      var searchcover_project = document.createElement("div");
      searchcover_project.className = "cover_project";
      searchcover_project.id = idmatch_list[j];
      searchcont_elements.appendChild(searchcover_project);

      // add hover methods to project 
      searchcover_project.addEventListener("mouseover", hoverProject);
      searchcover_project.addEventListener("mouseout", dehoverProject);

      // add onclick method to project 
      searchcover_project.addEventListener("click", clickProject);

  }

    // have all projects appear with stagger 
    $(".container_elements").velocity({opacity: "1"}, { stagger: 20, duration: 100 });

  }, 500);
}





// LOADING FUNCTION FOR THE PROJECTS 
function loadProjects(){

    // empty flexbox and repopulate 
    var flexbox_empty = document.getElementById("flexbox_projects");
    while (flexbox_empty.firstChild){

      flexbox_empty.removeChild(flexbox_empty.firstChild);

    }

    for (var i=0 ; i < title_list.length ; i++){
  
      // flexbox container
      var container_project = document.createElement("div");
      container_project.className = "container_project";
      container_project.id = "cont_project";
      document.getElementById("flexbox_projects").appendChild(container_project);
  
      // container for image and sliver 
      var container_elements = document.createElement("div");
      container_elements.className = "container_elements";
      container_elements.id = "cont_element" + i;
      container_project.appendChild(container_elements);
  
      // project image
      var image_project = document.createElement("img");
      image_project.className = "main_picture";
      image_project.id = "main_pic" + i;
      image_project.src = picture_list[i];
      container_elements.appendChild(image_project);
  
      // sliver project 
      var sliver_project = document.createElement("div");
      sliver_project.className = "sliver_project";
      sliver_project.id = "sliver"+ i ;
      container_elements.appendChild(sliver_project);
  
      // title project 
      var title_project = document.createElement("p");
      title_project.className = "title_project";
      sliver_project.appendChild(title_project);
      title_project.innerHTML = title_list[i];
  
      // cover project 
      var cover_project = document.createElement("div");
      cover_project.className = "cover_project";
      cover_project.id = id_list[i];
      container_elements.appendChild(cover_project);

      // add hover methods to project 
      cover_project.addEventListener("mouseover", hoverProject);
      cover_project.addEventListener("mouseout", dehoverProject);

      // add onclick method to project 
      cover_project.addEventListener("click", clickProject);
  
      // have all projects appear with stagger 
      $(".container_elements").velocity({opacity: "1"}, { stagger: 10, duration: 100 });

    }


  // need to create the bottom pane on the right place, refer to offset of the last project created 
  var bottom_pane = document.createElement("div");
  bottom_pane.id = "bottom_pane";
  bottom_pane.style.top = (getBodyHeight()) + "px";
  document.getElementById("projects").appendChild(bottom_pane);

  // text container bottom pane 
  var botpane_txt_container = document.createElement("div");
  botpane_txt_container.id = "botpane_txtcont";
  document.getElementById("bottom_pane").appendChild(botpane_txt_container);

  // text in the bottom pane 
  var botpane_text0 = document.createElement("p");
  botpane_text0.innerHTML = "Niels Vanwingh";
  document.getElementById("botpane_txtcont").appendChild(botpane_text0);
  var botpane_text1 = document.createElement("p");
  botpane_text1.innerHTML = "nielsvanwingh@yahoo.com";
  document.getElementById("botpane_txtcont").appendChild(botpane_text1);
  var botpane_text2 = document.createElement("p");
  botpane_text2.innerHTML = "Digital Design & Development Projects";
  document.getElementById("botpane_txtcont").appendChild(botpane_text2);

}


// INTERACTIONS WITH PROJECT 
// on hovering the project 
function hoverProject(e) {

  // get the id from the parentnode 
  var parentnode = document.getElementById(e.target.parentNode.id);

  // get the child elements from the parentnode 
  var image_change = parentnode.querySelector(".main_picture").id;
  var sliver_change = parentnode.querySelector(".sliver_project").id; 

  // shader disappears 
  $("#" + image_change).velocity({scale: "1.02"}, {easing: "ease-in", delay : 0, duration : 150});  
  $("#" + sliver_change).velocity({opacity: "0"}, {easing: "ease-in", delay : 0, duration : 150});   

}

// on leaving the project 
function dehoverProject(e){

  // get the parentnode through id from the parentnode
  var parentnode = document.getElementById(e.target.parentNode.id);

  // with id from the parentnode, go look for child elements 
  var image_change = parentnode.querySelector(".main_picture").id;
  var sliver_change = parentnode.querySelector(".sliver_project").id; 

  // shader reappears 
  $("#" + image_change).velocity({scale: "1"}, {easing: "ease-in", delay : 0, duration : 150}); 
  $("#" + sliver_change).velocity({opacity: "1"}, {easing: "ease-in", delay : 100, duration : 250});    

}



// GO TO NEXT PAGE AND STORE PROJECT ID IN SESSION 
// on clicking the project 
function clickProject(e){

  // store the projectID to use it when generating the project content 
  sessionStorage.setItem(projectID_clicked, e.target.id);

  // go to the content page 
  window.location.href = "content.html";

}


// HELPER FUNCTION - calculate the height of content on the page - used to position bottom elements
function getBodyHeight() {
  var body = document.body, html = document.documentElement;
  var content_height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

  // returns content height 
  return content_height;
}


// ERROR PAGE LOADING.. 
function errorPage() {

  // console.log("error page run");

  // remove right side header - search container - projects section - right side body 
  var rside_header = document.getElementById("right_side_header");
  rside_header.parentNode.removeChild(rside_header);
  var search_contain = document.getElementById("container_search");
  search_contain.parentNode.removeChild(search_contain);
  var rside_body = document.getElementById("right_side_body");
  rside_body.parentNode.removeChild(rside_body);  

  // create and append text nodes - button 
  var oepsie = document.createElement("p");
  oepsie.id = "oepsie_text";
  var oeps_text = document.createTextNode("Oepsie!");
  oepsie.appendChild(oeps_text);
  document.getElementById("body").appendChild(oepsie);    

  var apeldoorn = document.createElement("p");
  apeldoorn.id = "apel_text";
  var apel_text = document.createTextNode("Misser bij het laden..");
  apeldoorn.appendChild(apel_text);
  document.getElementById("body").appendChild(apeldoorn);  

  var error_detail = document.createElement("p");
  error_detail.id = "error_detail";
  var erdetail_text = document.createTextNode(error_portfolioload);
  error_detail.appendChild(erdetail_text);
  document.getElementById("body").appendChild(error_detail);

  var opnieuw_but = document.createElement("button");
  opnieuw_but.id = "opnieuw_button";
  var opnieuw_text = document.createTextNode("Opnieuw");
  opnieuw_but.appendChild(opnieuw_text);
  document.getElementById("body").appendChild(opnieuw_but);

  // onclick - onhover listener on the opnieuw button 
  opnieuw_but.addEventListener("click", refreshPage);

  $("#oepsie_text").velocity({opacity: "1"}, {easing: "ease-in", delay : 0, duration : 500}); 
  $("#apel_text").velocity({opacity: "1"}, {easing: "ease-in", delay : 40, duration : 500}); 
  $("#error_detail").velocity({opacity: "1"}, {easing: "ease-in", delay : 80, duration : 500}); 
  $("#opnieuw_button").velocity({opacity: "1"}, {easing: "ease-in", delay : 120, duration : 500}); 
  
}

// voor de logo klik functies
// voor opnieuw knop op de error page 
function refreshPage(){

  location.reload();

}


// INTERACTIONS ON THE HEADER 
// on clicking the search button
var search_counter = 0; 

function showSearch() {

    if (search_counter == 0){

        // creëer de bovenbalk 
        var top_bar_search = document.createElement("div");
        top_bar_search.id = "search_underlayer_div";
        document.getElementById("header").appendChild(top_bar_search);

        // animeer de bovenbalk 
        $("#search_underlayer_div").velocity({opacity: "1"}, {easing: "ease-out", delay : 0, duration : 200});

        // creëer de zoekbalk 
        var search_bar = document.createElement("input");
        search_bar.id = "search_bar";
        search_bar.type = "text";
        search_bar.addEventListener("keyup", searchContent);
        search_bar.addEventListener("blur", klikoutSearch);
        search_bar.placeholder = "Zoek een project";
        document.getElementById("container_search").appendChild(search_bar);   
        
        if (!onresize_content == 0){

          search_bar.placeholder = "";
          search_bar.value = onresize_content;
          onresize_content == 0;

        }

        // animeer de zoekbalk, korter maken bij kleinere schermgrootte 
        if (z.matches) {

          $("#search_bar").velocity({width: "65vw"}, {easing: "ease-out", delay : 0, duration : 150}); 

        }

        else {

          $("#search_bar").velocity({width: "85vw"}, {easing: "ease-out", delay : 0, duration : 150});  

        }      

        search_counter = 1;

    }

    else if (search_counter == 1){

        // verwijder bovenbalk 
        var top_bar_remove = document.getElementById("search_underlayer_div");
        top_bar_remove.parentNode.removeChild(top_bar_remove);

        // verwijder de zoekbalk 
        var search_bar_remove = document.getElementById("search_bar");
        search_bar_remove.parentNode.removeChild(search_bar_remove);

        search_counter = 0;

    }
}


// NEED TO CHECK WHEN TO USE CONST, VAR & LET 
// on clicking out of the search bar
function klikoutSearch(){

  if (search_bar.value == null){

    search_bar.placeholder = "Zoek een project";

  }
}


// on hovering the top logo 
function hoverLogo() {

    $("#logo_line").velocity({x2: "150"}, {easing: "ease-out", delay : 0, duration : 150});

}

function dehoverLogo() {

    $("#logo_line").velocity({x2: "170"}, {easing: "ease-in", delay : 0, duration : 150});

}




// on resizing the screen
function resizeProjectScreen(){

  if (y.matches || z.matches){

    // console.log("resize projectscreen");

    // save content of search bar for the first resize event 
    let sbar = document.getElementById("search_bar");
    if (sbar){

      onresize_content = sbar.value;
      console.log(onresize_content);

    }

    // close search bar if opened 
    if (search_counter == 1){

      showSearch();

    }

    // remove the bottom pane and immediately recreate it on the spot it needs to be.. 
    var bottom_pane = document.getElementById("bottom_pane");
    bottom_pane.parentNode.removeChild(bottom_pane);

    // need to create the bottom pane on the right place, refer to offset of the last project created 
    var bottom_pane = document.createElement("div");
    bottom_pane.id = "bottom_pane";
    bottom_pane.style.top = (getBodyHeight())+"px";
    document.getElementById("projects").appendChild(bottom_pane);

    // text container bottom pane 
    var botpane_txt_container = document.createElement("div");
    botpane_txt_container.id = "botpane_txtcont";
    document.getElementById("bottom_pane").appendChild(botpane_txt_container);

    // text in the bottom pane 
    var botpane_text0 = document.createElement("p");
    botpane_text0.innerHTML = "Niels Vanwingh";
    document.getElementById("botpane_txtcont").appendChild(botpane_text0);
    var botpane_text1 = document.createElement("p");
    botpane_text1.innerHTML = "nielsvanwingh@yahoo.com";
    document.getElementById("botpane_txtcont").appendChild(botpane_text1);
    var botpane_text2 = document.createElement("p");
    botpane_text2.innerHTML = "Digital Design & Development Projects";
    document.getElementById("botpane_txtcont").appendChild(botpane_text2);

  }
}












// EXAMPLE DEALING WITH DYNAMICALLY GENERATED ITEMS WITH EVENTLISTENERS 
// for (var i = 0; i < 5; i++) {
//   var coloured_div = document.createElement("div");
//   coloured_div.className = "col_div_class";
//   coloured_div.id = "coloured_div" + i;
//   document.getElementById("body").appendChild(coloured_div);

//   coloured_div.addEventListener("mouseover", hoverCube);
//   coloured_div.addEventListener("mouseout", dehoverCube);
// }

// function hoverCube(e) {
//   e.target.style.backgroundColor = "orange";
// }

// function dehoverCube(e) {

//   e.target.style.backgroundColor = "yellow";  
// }



