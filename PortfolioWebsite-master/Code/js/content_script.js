// MEDIA QUERIES 
// x is small, y is medium, z is large - same breakpoints as the scss files!!
// try to avoid this where possible in design, account for complexity 
var x = window.matchMedia("(max-width: 620px)");
var y = window.matchMedia("(min-width: 620px) and (max-width: 870px)");
var z = window.matchMedia("(min-width: 870px)");


// DEFINE WHAT HAPPENS WHEN LOADING THE PAGE 
$("#logo_svg").velocity({marginLeft: "10%"}, {delay : 0, duration : 600});


  // VARIABLES 
  // variable determining which data to show 
  var project_ID = sessionStorage.getItem(projectID_clicked);
  var project_data;
  // image carrousel index 
  var picture_shown; 
  var picture_number = []; 


  // generate all contents from the associated project 
  app.content.get({

    schemaKey: 'portfolioProject',
    entryId: project_ID,
    fields: ['projectTitel', 'projectSubtitel', 'korteOmschrijving', 'projectinhoud', 'projectVideo', 'fotoSlideshow', ''],
    populate: true

    }).then(portfolioProject => {

      project_data = portfolioProject;
      picture_number = project_data.fotoSlideshow;
      // console.log(project_data.fotoSlideshow);

      useProjectdata();

    }).catch(function(error){

      // need to write another error page for the project, or re-use the code and change logic on button.. 
      errorPage();

  });

  
  // load project data from the CMS 
  function useProjectdata(){

    // populate the page with content from Flamelink CMS - main title 
    var main_title = document.createElement("h1");
    main_title.id = "proj_maintitle";
    main_title.innerHTML = project_data.projectTitel;
    document.getElementById("body").appendChild(main_title);

    // subtitle 
    var sub_title = document.createElement("h2");
    sub_title.id = "proj_subtitle";
    sub_title.innerHTML = project_data.projectSubtitel;
    document.getElementById("body").appendChild(sub_title);

    // issue getting the video url out of the cms 
    var video_proj = document.createElement("video");
    video_proj.id = "proj_vid";
    video_proj.controls = "true";
    var video_source = document.createElement("source");
    video_source.type = "video/mp4";
    video_source.src = project_data.projectVideo[0].url;
    video_proj.appendChild(video_source);
    document.getElementById("body").appendChild(video_proj);

    // right side title 
    var title_desc = document.createElement("h3");
    title_desc.id = "proj_desctitle";
    title_desc.innerHTML = "Project Inhoud Kort";   

    // right side short description 
    var short_desc = document.createElement("p");
    short_desc.id = "proj_description";
    short_desc.innerHTML = project_data.korteOmschrijving;

    // DEPENDENT ON SCREEN SIZE TO WHICH ELEMENT THEY WILL BE ATTACHED
    if (z.matches){

      document.getElementById("right_side_body").appendChild(short_desc); 
      document.getElementById("right_side_body").appendChild(title_desc);   

    }

    else {

      document.getElementById("body").appendChild(short_desc); 
      document.getElementById("body").appendChild(title_desc);         

    }


    // project description title
    var content_title = document.createElement("h3");
    content_title.id = "projcont_title";
    content_title.innerHTML = "Project Inhoud";
    document.getElementById("body").appendChild(content_title);
    
    // project description 
    var content_project = document.createElement("p");
    content_project.id = "projcont"; 
    content_project.innerHTML = project_data.projectinhoud;
    document.getElementById("body").appendChild(content_project);     

    // generate container, images and buttons 
    // project images 
    var images_container = document.createElement("div");
    images_container.id = "images_container";
    document.getElementById("body").appendChild(images_container);

    var images_project = document.createElement("img");
    images_project.id = "proj_imagecarr";
    images_project.src = project_data.fotoSlideshow[0].url;
    document.getElementById("images_container").appendChild(images_project);  

    // if there is more than 1 picture in the CMS 
    if (picture_number.length > 1) {

      // generate text below the image carrousel and generate onclick listener
      var text_imagecarrousel = document.createElement("p");
      text_imagecarrousel.id = "text_nextimage";
      text_imagecarrousel.innerHTML = "click image to navigate";
      images_project.addEventListener("click", navigateRight);
      document.getElementById("images_container").appendChild(text_imagecarrousel);

    }

    // bottom pane 
    var botpane_content = document.createElement("div");
    botpane_content.id = "botpane_content";
    botpane_content.style.top = (getBodyHeight() + 150)+"px";
    document.getElementById("body").appendChild(botpane_content);

      // terug button in bottom pane - container element 
      var terug_cont = document.createElement("div");
      terug_cont.id = "terug_container";
      document.getElementById("botpane_content").appendChild(terug_cont);

      var terug_tekst = document.createElement("p");
      terug_tekst.id = "terug_tekst";
      terug_tekst.innerHTML = "Terug";
      document.getElementById("terug_container").appendChild(terug_tekst);

        // create svg two triangles 
        const svg_terug = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg_terug.id = "svg_terug";
        svg_terug.setAttribute("width", "60");
        svg_terug.setAttribute("height", "26");
        document.getElementById("terug_container").appendChild(svg_terug);

        const trterug_left = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        trterug_left.setAttribute("points", "0,13 15,0 15,26");
        trterug_left.setAttribute("fill", "black");
        trterug_left.id = "trterug_left";
        svg_terug.appendChild(trterug_left);

        const trterug_right = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        trterug_right.setAttribute("points", "20,13 35,0 35,26");
        trterug_right.setAttribute("fill", "black");
        trterug_right.id = "trterug_right";
        svg_terug.appendChild(trterug_right);

        var terug_shader = document.createElement("div");
        terug_shader.id = "terug_shader";
        document.getElementById("terug_container").appendChild(terug_shader);
        terug_shader.addEventListener('mouseover', terugHover);
        terug_shader.addEventListener("mouseout", terugdeHover);
        terug_shader.addEventListener("click", terugClick);


      // top button in bottom pane 
      var top_cont = document.createElement("div");
      top_cont.id = "top_container";
      document.getElementById("botpane_content").appendChild(top_cont);    

      var top_tekst = document.createElement("p");
      top_tekst.id = "top_tekst";
      top_tekst.innerHTML = "Top";
      document.getElementById("top_container").appendChild(top_tekst);

        // create svg two triangles 
        const svg_top = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg_top.id = "svg_top";
        svg_top.setAttribute("width", "26");
        svg_top.setAttribute("height", "60");
        document.getElementById("top_container").appendChild(svg_top);

        const trtop_top = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        trtop_top.setAttribute("points", "13,0 0,15 26,15");
        trtop_top.setAttribute("fill", "black");
        trtop_top.id = "trtop_top";
        svg_top.appendChild(trtop_top);

        const trtop_bottom = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        trtop_bottom.setAttribute("points", "13,20 0,35 26,35");
        trtop_bottom.setAttribute("fill", "black");
        trtop_bottom.id = "trtop_bottom";
        svg_top.appendChild(trtop_bottom);

        var top_shader = document.createElement("div");
        top_shader.id = "top_shader";
        document.getElementById("top_container").appendChild(top_shader);
        top_shader.addEventListener('mouseover', topHover);
        top_shader.addEventListener("mouseout", topdeHover);
        top_shader.addEventListener("click", topClick);


    // APPEARING OF ALL ELEMENTS 
    $("#proj_maintitle").velocity({opacity: "1"}, {delay : 0, duration : 400});
    $("#proj_subtitle").velocity({opacity: "1"}, {delay : 40, duration : 400});
    $("#proj_vid").velocity({opacity: "1"}, {delay : 200, duration : 400});
    $("#proj_desctitle").velocity({opacity: "1"}, {delay : 300, duration : 400});
    $("#proj_description").velocity({opacity: "1"}, {delay : 340, duration : 400});
    
  }


  // NAVIGATION PICTURES - LEFT AND RIGHT NAVIGATION 
  // refers to index of an element 
  var picture_navigated = 0;

  function navigateRight(){
   
    if (picture_navigated + 1 < picture_number.length){

      document.getElementById("proj_imagecarr").src = project_data.fotoSlideshow[picture_navigated + 1].url;
      picture_navigated += 1;

    }

    else {

      document.getElementById("proj_imagecarr").src = project_data.fotoSlideshow[0].url;

      picture_navigated = 0;

    }
  }


  
  // INTERACTION WITH THE TERUG BUTTON 
  function terugHover(){

    $("#trterug_left").velocity({opacity: "0"}, {delay : 0, duration : 100});
    $("#svg_terug").velocity({left: "-13px"}, {delay : 100, duration : 100});

  }

  function terugdeHover(){

    $("#svg_terug").velocity({left: "7px"}, {delay : 0, duration : 100});
    $("#trterug_left").velocity({opacity: "1"}, {delay : 100, duration : 100});

  }

  function terugClick(){

    window.location.href = "index.html";

  }


  // INTERACTION WITH THE TOP BUTTON 
  function topHover(){

    $("#trtop_top").velocity({opacity: "0"}, {delay : 0, duration : 100});
    $("#svg_top").velocity({top: "-10px"}, {delay : 100, duration : 100});

  }

  function topdeHover(){

    $("#svg_top").velocity({top: "10px"}, {delay : 0, duration : 100});  
    $("#trtop_top").velocity({opacity: "1"}, {delay : 100, duration : 100});

  }

  function topClick(){

    document.getElementById("body").scrollIntoView({behavior: "smooth"});

  }


  // on resizing the screen 
  function resizeContentScreen(){

    // remove and regenerate the project title & inhoud 
    var title_remove = document.getElementById("proj_desctitle");
    title_remove.parentNode.removeChild(title_remove);

    var body_remove = document.getElementById("proj_description");
    body_remove.parentNode.removeChild(body_remove);

    // right side title 
    var title_desc = document.createElement("h3");
    title_desc.id = "proj_desctitle";
    title_desc.innerHTML = "Project Inhoud Kort";   

    // right side short description 
    var short_desc = document.createElement("p");
    short_desc.id = "proj_description";
    short_desc.innerHTML = project_data.korteOmschrijving;

    // DEPENDENT ON SCREEN SIZE TO WHICH ELEMENT THEY WILL BE ATTACHED
    if (z.matches){

      document.getElementById("right_side_body").appendChild(title_desc); 
      document.getElementById("right_side_body").appendChild(short_desc);   
      $("#proj_desctitle").velocity({opacity: "1"}, {delay : 0, duration : 0});
      $("#proj_description").velocity({opacity: "1"}, {delay : 0, duration : 0});

    }

    else {

      document.getElementById("body").appendChild(short_desc); 
      document.getElementById("body").appendChild(title_desc);  
      $("#proj_desctitle").velocity({opacity: "1"}, {delay : 0, duration : 0});
      $("#proj_description").velocity({opacity: "1"}, {delay : 0, duration : 0});       

    }

    // remove and regenerate the bottom pane and contents 
    var bottom_pane = document.getElementById("botpane_content");
    bottom_pane.parentNode.removeChild(bottom_pane);
    
    // bottom pane 
    var botpane_content = document.createElement("div");
    botpane_content.id = "botpane_content";
    botpane_content.style.top = (getBodyHeight() + 100)+"px";
    document.getElementById("body").appendChild(botpane_content);

      // terug button in bottom pane - container element 
      var terug_cont = document.createElement("div");
      terug_cont.id = "terug_container";
      document.getElementById("botpane_content").appendChild(terug_cont);

      var terug_tekst = document.createElement("p");
      terug_tekst.id = "terug_tekst";
      terug_tekst.innerHTML = "Terug";
      document.getElementById("terug_container").appendChild(terug_tekst);

        // create svg two triangles 
        const svg_terug = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg_terug.id = "svg_terug";
        svg_terug.setAttribute("width", "60");
        svg_terug.setAttribute("height", "26");
        document.getElementById("terug_container").appendChild(svg_terug);

        const trterug_left = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        trterug_left.setAttribute("points", "0,13 15,0 15,26");
        trterug_left.setAttribute("fill", "black");
        trterug_left.id = "trterug_left";
        svg_terug.appendChild(trterug_left);

        const trterug_right = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        trterug_right.setAttribute("points", "20,13 35,0 35,26");
        trterug_right.setAttribute("fill", "black");
        trterug_right.id = "trterug_right";
        svg_terug.appendChild(trterug_right);

        var terug_shader = document.createElement("div");
        terug_shader.id = "terug_shader";
        document.getElementById("terug_container").appendChild(terug_shader);
        terug_shader.addEventListener('mouseover', terugHover);
        terug_shader.addEventListener("mouseout", terugdeHover);
        terug_shader.addEventListener("click", terugClick);


      // top button in bottom pane 
      var top_cont = document.createElement("div");
      top_cont.id = "top_container";
      document.getElementById("botpane_content").appendChild(top_cont);    

      var top_tekst = document.createElement("p");
      top_tekst.id = "top_tekst";
      top_tekst.innerHTML = "Top";
      document.getElementById("top_container").appendChild(top_tekst);

        // create svg two triangles 
        const svg_top = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg_top.id = "svg_top";
        svg_top.setAttribute("width", "26");
        svg_top.setAttribute("height", "60");
        document.getElementById("top_container").appendChild(svg_top);

        const trtop_top = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        trtop_top.setAttribute("points", "13,0 0,15 26,15");
        trtop_top.setAttribute("fill", "black");
        trtop_top.id = "trtop_top";
        svg_top.appendChild(trtop_top);

        const trtop_bottom = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        trtop_bottom.setAttribute("points", "13,20 0,35 26,35");
        trtop_bottom.setAttribute("fill", "black");
        trtop_bottom.id = "trtop_bottom";
        svg_top.appendChild(trtop_bottom);

        var top_shader = document.createElement("div");
        top_shader.id = "top_shader";
        document.getElementById("top_container").appendChild(top_shader);
        top_shader.addEventListener('mouseover', topHover);
        top_shader.addEventListener("mouseout", topdeHover);
        top_shader.addEventListener("click", topClick);


  }