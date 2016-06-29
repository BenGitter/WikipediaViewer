var i = 0,
    max = 0,
    dataObj,
    same = true,
    sroffset = 0;

// Set the event handlers: click or enter search and more button
$("#searchIcon").on("click", jsonCall);
$("#search input").keypress(function(e){
  if(e.which === 13){
    jsonCall();
  }
});

function jsonCall(){
  if(!same){
    sroffset = 0;
  }
  var search = $("#search input").val();
  var url = "http://en.wikipedia.org//w/api.php?callback=?";
  $.getJSON(url, {
      action: "query",
      format: "json",
      prop: "info|pageprops|extracts",
      generator: "search",
      inprop: "url",
      gsrsearch: search,
      exintro: "",
      exlimit: "max",
      gsroffset: sroffset
    },
    function(data){
      if(typeof data.query ==="undefined"){
        alert("No results");
        return false;
      }
      dataObj = data;
      max = Object.keys(data.query.pages).length;
      startAnimate();
    });
  }

function startAnimate(){
  if($("#moreBtn")){
    $("#moreBtn").remove();
  }
  if(same){
    $("#search").animate({
      marginTop: "20px",
      marginLeft: "0px",
      width: "100%"
    }, 500, function(){
      insertItems();
    });
    $("#search .col-xs-12").animate({
      width: ($(".container").width() - 121).toString() + "px"
    }, 500);
    same = false;
  }else{
    $("#results").html("");
    i = 0;
    sroffset = 0;
    insertItems();
  }
}

function insertItems(){
  $.each(dataObj.query.pages, function(index, value){
    var title = dataObj.query.pages[index].title;
    var extract = dataObj.query.pages[index].extract;
    //title = title.replace(/'/g, "&quot;");
    var link = dataObj.query.pages[index].fullurl;
    var resultDiv = $("<a href='" + link + "'><div class='col-xs-12 col-sm-4 col-lg-3 result'><div class='col-xs-12 text text-center'><span>" + title + "</span></div></div></a>");
    $("#results").append(resultDiv);
  });

  centerText();

  if(typeof dataObj.continue !== "undefined"){
    sroffset = dataObj.continue.gsroffset;
    var moreBtn = $("<div id='moreBtn' class='col-xs-12 col-sm-4 col-lg-3 result'><div class='col-xs-12 text text-center'>More results...</div></div>")
    $("#results").append(moreBtn);
    $("#moreBtn").on('click', function(){
      same = true;
      jsonCall();
    });
  }

  fadeItems(i);
}

function fadeItems(count){
  $(".result").eq(count).fadeIn(80, function(){
    if(count < Object.keys(dataObj.query.pages).length+sroffset){
      i++;
      fadeItems(i);
    }else{
      i = sroffset;
    }
  });
  $(".result").eq(count).css("display", "table");
}

function centerText(){
  var height = $(".result").eq(1).height();
  $(".result").each(function(index){
    var padding = 0;
  /*while($(this).height() < height+1){
      $(this).find("div").css("padding-top", padding++ + "px");
      console.log(padding++ + "px");
      $(this).find("div").css("padding-bottom", padding++ + "px");
    }*/
    //$(this).css("padding-top", "70px");
    $("this").css("display", "table")
              .css("table-layout", "fixed");
    $("this").find("div").css("display", "table-cell")
                          .css("vertical-align", "middle");
  });
}


$("#search input").on('focus', function(){
  $("#searchIcon").css("background-color", "rgb(240,200,200)");
  //$("#search .col-xs-2").css("transition", "background-color 0.3s");
});
$("#search input").on('focusout', function(){
  $("#searchIcon").css("background-color", "white");
  //$("#search .col-xs-2").css("transition", "background-color 0.3s");
});

$("#searchIcon").hover(function(){
  $("#searchIcon").css("background-color", "rgb(240,200,200)");
}, function(){
  $("#searchIcon").css("background-color", "white");
});

$(window).on("resize", sizing);

function sizing(){
  $("#search .col-xs-12").width($("#search").width() - 101);
  //return $("#search").width() - 51;
}

sizing();
