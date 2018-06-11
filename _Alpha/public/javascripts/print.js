H2P.doAfterLayout(function(){


  // page numbering, headers + footers
  //
  $('.page').each(function(index){
    var customPageNumber = $("<p>").text('( '+ index + ' )').addClass("custom-page-number");
    $(this).find( ".footer" ).append(customPageNumber);
  });

  $('.page').each(function(){
    $(this).find(".header .seccol").append($('.hiddenMeta p.localID').html() + ' —— world wide repository');
  })

  // $('.page').each(function(){
  //   var local_chaptertype = $('.hiddenChaptertype').text();
  //   var chaptertypeDiv = $('<div>').text(local_chaptertype).addClass('chaptertype');
  //   $(this).find('.header').append(chaptertypeDiv);
  // })


  // cover design
  //
  var entryNumber = $('.hiddenMeta p.localID').html();
  var initDate = 'init: ' + $('.hiddenMeta p.initdate').text();
  var _date = new Date();
  var requestDate = 'requested: ' + _date.toUTCString();
  var wwrStamp = 'world wide repository';
  $('#page-0 .header .firstcol').html("<p class='big'>" + entryNumber + "</p>");
  $('#page-0 .header .seccol').html("<p>" + initDate + "</p><p>" + requestDate + "</p>");
  $('#page-0 .header .thirdcol').html("<p>" + wwrStamp + "</p>");
  // var coverHead_null = document.getElementById("page-0").getElementsByClassName("header")[0];
  // coverHead_null.style.visibility = 'hidden';
  var coverFoot_null = document.getElementById("page-0").getElementsByClassName("footer")[0];
  coverFoot_null.style.visibility = 'hidden';


});
