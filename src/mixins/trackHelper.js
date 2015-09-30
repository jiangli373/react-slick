'use strict';

var checkSpecKeys = function (spec, keysArray) {
  return keysArray.reduce((value, key) => {
    return value && spec.hasOwnProperty(key);
  }, true) ? null : console.error('Keys Missing', spec);
};

export var getTrackCSS = function(spec) {
  checkSpecKeys(spec, [
    'left', 'variableWidth', 'slideCount', 'slidesToShow', 'slideWidth'
  ]);

  var trackWidth;

  if (spec.variableWidth) {
    trackWidth = (spec.slideCount + 2*spec.slidesToShow) * spec.slideWidth;
  } else if (spec.centerMode) {
    trackWidth = (spec.slideCount + 2*(spec.slidesToShow + 1)) * spec.slideWidth;
  } else {
    trackWidth = (spec.slideCount + 2*spec.slidesToShow) * spec.slideWidth;
  }
    var transform = '';
    var msTransform = '';
    if(spec.vertical==false){
        transform = 'translate3d(' + spec.left + 'px, 0px, 0px)';
        msTransform = 'translateX(' + spec.left + 'px)';
    }else{
        transform = 'translate3d(0px,' + spec.left + 'px,  0px)';
        msTransform = 'translateY(' + spec.left + 'px)'
    }
  var style = {
    opacity: 1,
    width: trackWidth,
    WebkitTransform: transform,
    transform: transform,
    transition: '',
    WebkitTransition: '',
    msTransform: msTransform
  };

  // Fallback for IE8
  if (!window.addEventListener && window.attachEvent) {
      if(spec.vertical == false){
          style.marginLeft = spec.left + 'px';
      }else{
          style.marginTop = spec.left + 'px';
      }

  }

  return style;
};

export var getTrackAnimateCSS = function (spec) {
  checkSpecKeys(spec, [
    'left', 'variableWidth', 'slideCount', 'slidesToShow', 'slideWidth', 'speed', 'cssEase'
  ]);

  var style = getTrackCSS(spec);
  // useCSS is true by default so it can be undefined
  style.WebkitTransition = '-webkit-transform ' + spec.speed + 'ms ' + spec.cssEase;
  style.transition = 'transform ' + spec.speed + 'ms ' + spec.cssEase;
  return style;
};

export var getTrackLeft = function (spec) {

  checkSpecKeys(spec, [
   'slideIndex', 'trackRef', 'infinite', 'centerMode', 'slideCount', 'slidesToShow',
   'slidesToScroll', 'slideWidth', 'listWidth', 'variableWidth']);

  var slideOffset = 0;
  var targetLeft;
  var targetSlide;
  var verticalHeight,
      verticalOffset = 0;

  verticalHeight = spec.listHeight;


  if (spec.fade) {
    return 0;
  }

  if (spec.infinite) {
    if (spec.slideCount > spec.slidesToShow) {
     slideOffset = (spec.slideWidth * spec.slidesToShow) * -1;
        verticalOffset = (verticalHeight * spec.slidesToShow) * -1;
    }
    if (spec.slideCount % spec.slidesToScroll !== 0) {
      if (spec.slideIndex + spec.slidesToScroll > spec.slideCount && spec.slideCount > spec.slidesToShow) {
          if(spec.slideIndex > spec.slideCount) {
            slideOffset = ((spec.slidesToShow - (spec.slideIndex - spec.slideCount)) * spec.slideWidth) * -1;
              verticalOffset = ((spec.slidesToShow - (spec.slideIndex -spec.slideCount)) * verticalHeight) * -1;
          } else {
            slideOffset = ((spec.slideCount % spec.slidesToScroll) * spec.slideWidth) * -1;
              verticalOffset = ((spec.slideCount % spec.slidesToScroll) * verticalHeight) * -1;
          }
      }
    }
  }else {
      if (spec.slideIndex + spec.slidesToShow >spec.slideCount) {
          slideOffset = ((spec.slideIndex + spec.slidesToShow) - spec.slideCount) * spec.slideWidth;
          verticalOffset = ((spec.slideIndex + spec.slidesToShow) - spec.slideCount) * verticalHeight;
      }
  }
    if (spec.slideCount <= spec.slidesToShow) {
        slideOffset = 0;
        verticalOffset = 0;
    }
  if (spec.centerMode) {
    if(spec.infinite) {
      slideOffset += spec.slideWidth * Math.floor(spec.slidesToShow / 2);
    } else {
      slideOffset = spec.slideWidth * Math.floor(spec.slidesToShow / 2);
    }
  }
    if (spec.vertical === false) {
        targetLeft = ((spec.slideIndex * spec.slideWidth) * -1) + slideOffset;
    } else {
        targetLeft = ((spec.slideIndex * verticalHeight) * -1) + verticalOffset;
    }

  if (spec.variableWidth === true) {
      var targetSlideIndex;
      if(spec.slideCount <= spec.slidesToShow || spec.infinite === false) {
          targetSlide = spec.trackRef.getDOMNode().childNodes[spec.slideIndex];
      } else {
          targetSlideIndex = (spec.slideIndex + spec.slidesToShow);
          targetSlide = spec.trackRef.getDOMNode().childNodes[targetSlideIndex];
      }
      targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
      if (spec.centerMode === true) {
          if(spec.infinite === false) {
              targetSlide = spec.trackRef.getDOMNode().children[spec.slideIndex];
          } else {
              targetSlide = spec.trackRef.getDOMNode().children[(spec.slideIndex + spec.slidesToShow + 1)];
          }

          targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
          targetLeft += (spec.listWidth - targetSlide.offsetWidth) / 2;
      }
  }

  return targetLeft;
};
