import Swiper from 'swiper';

$(function(){
  new Swiper('.slider-magazine .slider-magazine__container', {
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 32,
    loop: true,
    direction: 'vertical',
    allowSlideNext: false,
    allowSlidePrev: false,
    allowTouchMove: false,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 32,
        direction: 'horizontal',
        allowSlideNext: true,
        allowSlidePrev: true,
        allowTouchMove: true,
        slidesPerGroup: 1
      }
    }
  });

  new Swiper('.js-slide-interested', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 24,
    loop: true,
    direction: 'vertical',
    allowSlideNext: false,
    allowSlidePrev: false,
    allowTouchMove: false,
    breakpoints: {
      1024: {
        slidesPerView: 2,
        spaceBetween: 32,
        direction: 'horizontal',
        allowSlideNext: true,
        allowSlidePrev: true,
        allowTouchMove: true,
        slidesPerGroup: 1
      },
      769: {
        slidesPerView: 1,
        spaceBetween: 32,
        direction: 'horizontal',
        allowSlideNext: true,
        allowSlidePrev: true,
        allowTouchMove: true,
        slidesPerGroup: 1
      }
    }
  });

})
