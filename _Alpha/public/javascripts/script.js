for(i=0; i < 12; i++){
  $($('a.indexcard')[i]).attr('href', '/notdynamic/N'+(i+1));
}

$($('#currentliveEntries a')[0]).attr('href', '/notdynamic/N1');
$($('#currentliveEntries a')[1]).attr('href', '/notdynamic/N4');
$($('#currentliveEntries a')[2]).attr('href', '/notdynamic/N9');
$($('#currentliveEntries a')[3]).attr('href', '/notdynamic/N10');
$($('#currentliveEntries a')[4]).attr('href', '/notdynamic/N12');



// Resizing the initbook form div to A-papersize ratio
var getAPaperSize = function(targetA){
  var initWidth = $(targetA).width();
  var newInitHeight = initWidth * 1.414;

  $(targetA).css("height", newInitHeight);
}

var makeBackCover = function(){
  var getWidth = $('#initform').width();
  $('.backCover').css("width", getWidth);
  getAPaperSize('.backCover');
  var offSetWrap = $('#absolutesmallwrap').offset().top;
  var getElemHeight = $('.backCover').height();
  var getWindowHeight = $(window).height();
  var newPos = (getWindowHeight - getElemHeight - offSetWrap) - 44;
  $('.backCover').css("top", newPos);
}

getAPaperSize('#initform');
makeBackCover();

$(window).resize(function(){
  makeBackCover();
});

// 
// APPENDING and REMOVING input fields for to-be-scraped chapters
// $(document).ready(function(){
//   chapterIndex = 1;

//   $('#chapters')
//     .on('click', '#addMoreChap', function(){
//       chapterIndex++;
//       var $chapTemp = $('#chaptertemplate'),
//           $clone = $chapTemp
//                     .clone()
//                     .removeClass('hide')
//                     .removeAttr('id')
//                     .attr('data-chapterIndex', chapterIndex)
//                     .insertBefore($chapTemp);
//       // update name
//       $clone
//         .find('[for="chapURL"]').attr('for', 'chapURL' + chapterIndex).end()
//         .find('[name="chapURL"]').attr('name', 'chapURL' + chapterIndex).removeAttr("disabled").end()
//         .find('[name="chapTYP"]').attr('name', 'chapTYP' + chapterIndex).removeAttr("disabled").end()
//         .find('[name="chapLVL"]').attr('name', 'chapLVL' + chapterIndex).removeAttr("disabled").end()
//         .find('[for="chapTAG"]').attr('for', 'chapTAG' + chapterIndex).end()
//         .find('[name="chapTAG"]').attr('name', 'chapTAG' + chapterIndex).removeAttr("disabled").end();

//       // update indexVal's value to send with POST method
//       $('#chapters').find('[name="indexVal"]').attr('value', chapterIndex).end();

//       // resize textarea again
//       $clone.find('.chaptertags')
//         .attr('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;')
//         .on('input', 
//           function () {
//             this.style.height = 'auto';
//             this.style.height = (this.scrollHeight) + 'px';
//           });
//     })
//     .on('click', '#removeChap', function(){
//       var $chapterField = $(this).parents('.chapterClass');
//       $('#chapters').find('[name="indexVal"]').attr('value', chapterIndex).end();
//       $chapterField.remove();
//     });
// });

//
// Repositioning the indexcards according to each others heights
var RePos = function(target){
    var topOffset = target.position().top;
    var cardHeight = target.height();
    var topPos = topOffset + cardHeight + 4;
    target.next().css({top: topPos});
    // console.log(topOffset);
}

//
// meta data navigation functionality
$(".togglenav").click(function() {
  var metatarget = $($(this).children()[1]);
  var metatoggle = $(metatarget.children());

  $(this).toggleClass('activetogglenav');
  $(metatoggle).first().toggle( 8, function showNext(){
    $(this).next(metatoggle).toggle(8, showNext);
  });

  var childrenTime = metatoggle.length * 13;

  setTimeout(function(){
    $(".togglenav").each(function(){
      var metas = $(this);
      RePos(metas);
    });
  }, childrenTime);
});

$(".togglenav").each(function(){
  $(".togglenav").each(function(){
    var metas = $(this);
    RePos(metas);
  });
})

$(document).ready(function(){

  // setTimeout(function(){
  //   H2P.init();
  // }, 100);

  // $("#fishmenuwrap a").mouseenter(function(){
  //   $(this).toggleClass('selected');
  //   $(this).children('.cardprop').toggleClass('showcardInd');
  // }).mouseleave(function(){
  //   $(this).toggleClass('selected');
  //   $(this).children('.cardprop').toggleClass('showcardInd');
  // });

  $('span.tagsmeta').on('click', function(){
    var name = $(this).attr('data');
    $('span.cardTag').filter(function() { 
      //var checkchildren = $('#booktags.cardprop').has('span');
      //console.log(checkchildren);
      var _attr = $(this).attr('data-tags')
      if(_attr != name){
        $(this).parent().parent().hide();
      }
      $("#fishmenuwrap").scrollTop(0);
    });
  });

});

$(document).ready(function(){
  //$('article.h2p-content').css('visibility', 'hidden');


  var allfishes = $('#fishmenuwrap a.indexcard');
  var maxFishHeight = 14.14; /* this is x percentage of parent wrapper*/
  var siblingsFishesHeight = 2.93;
  var minFishesTotalHeight = 175 - (siblingsFishesHeight+siblingsFishesHeight+maxFishHeight);
  var minFishHeight = null;
  var checkFish = null;
  var activeFishIndx = 0;

  var activeFish = $('#fishmenuwrap').find('.currselected');
  activeFishIndx = activeFish.index();

  if (activeFishIndx <= 0 ) {
    activeFishIndx = 0;
  }

  var updateRestFishHeight = function(){
    minFishHeight = minFishesTotalHeight / (allfishes.size()-6);
  }

  var adjustFishesHeight = function(e){

    var hoverdFish = e? e.target: allfishes.eq(activeFishIndx);
    // console.log(hoverdFish);

    // reset all the fishes height to minimum
    allfishes.each(function(){
      $(this).css('height', minFishHeight+"%");
      $(this).removeClass('selected');
      $(this).children('.cardprop').removeClass('showcardInd');
    });

    $(hoverdFish).css('height',maxFishHeight+"%");
    $(hoverdFish).addClass('selected');
    $(hoverdFish).children('.cardprop').addClass('showcardInd');
    $(hoverdFish).next().css('height',siblingsFishesHeight+"%");
    $(hoverdFish).prev().css('height',siblingsFishesHeight+"%");
  } 

  updateRestFishHeight();
  adjustFishesHeight();


  allfishes.each(function(){
    $(this).mouseenter(adjustFishesHeight);
  });

// end fish menu
//

//
// Initialize H2P / Terminate H2P

  // $('.coverBook.printNav').click(function(){
  //   if(H2P.isInitialized()){
  //         H2P.remove();
  //         $('article.h2p-content').css('visibility', 'hidden');
  //     } else{
  //       H2P.init();
  //       $('article.h2p-content').css('visibility', 'visible');
  //     }
  // });

// end H2P nav
//

});

//
// Auto-resize text-area when typing
// $('textarea').each(function () {
//   this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
// }).on('input', function () {
//   this.style.height = 'auto';
//   this.style.height = (this.scrollHeight) + 'px';
// });


//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//
// Not in use!
//
//
// var indexCardArr = []

// $('a.indexcard').each(function(){
//   indexCardArr.push($(this));
// });
  
// var getboxOffsetDist = function(i){
//   if(i < indexCardArr.length){
//     var box = $(indexCardArr[i]);
//     RePos(box);
//     // center point of the box
//     var boxTop = box.offset().top;
//     var boxHeight = box.height();
//     var boxAbsCent = boxTop + (boxHeight/2);
    
//     $gal.on('mousemove', function(e) {

//       mX = e.pageY - $(this).parent().offset().top - this.offsetLeft;
//       mX2 = Math.min( Math.max(0, mX-mPadd), mmAA ) * mmAAr;

//       // var divHeight = $gal.height();
//       // var dy = mX - boxAbsCent;

//       // var distance = Math.min(Math.max(10, boxHeight-Math.sqrt(dy*dy)), galW);
//       // console.log(distance);
//       // box.css('height', distance);
//       // RePos(box);

//       // box.css('top', -(distance / boxHeight));

//       setInterval(function(){
//         posX += (mX2 - posX) / damp; // zeno's paradox equation "catching delay" 
//         $gal.scrollTop(posX*wDiff);
//         //$('a.indexcard').css('height', '50px');

//         var lookWindowMove = Math.min( Math.max(0, posX-lookWindowHeight), galW);
//         $('#lookWindow').css('top', lookWindowMove);
//       }, 10);

//     });
//     getboxOffsetDist(i+1);
//   }
// }

// getboxOffsetDist(0);
