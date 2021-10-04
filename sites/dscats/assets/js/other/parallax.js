import simpleParallax from 'simple-parallax-js';

$(function() {
  let img = document.querySelectorAll('.main-slider__item img');
  let feedbackFon = document.getElementsByClassName('b-feedback__fon');
  let subscribeFon = document.getElementsByClassName('b-subscribe__fon');
  let searchLinkMapFon = document.getElementsByClassName('b-search-link-image-map__fon');
  let catalogPageFon = document.getElementsByClassName('catalog-header__fon');

  new simpleParallax(img, {scale: 1.2});
  new simpleParallax(feedbackFon, {scale: 1.25});
  new simpleParallax(subscribeFon, {scale: 1.25});
  new simpleParallax(searchLinkMapFon, {scale: 1.15});
  new simpleParallax(catalogPageFon, {scale: 1.2});
})
