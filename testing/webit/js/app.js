(function() {
  const $btnModal = document.querySelector('.js-button-modal');
  const $modal = document.querySelector('.js-modal');
  const $modalOverlay = $modal.querySelector('.modal__overlay')

  const showModal = (event) => {
      event.preventDefault();
      $modal.classList.add('is-show');
  };

  const hideModal = (event) => {
      event.preventDefault();
      $modal.classList.remove('is-show');
  };

  $btnModal.addEventListener('click', showModal);
  $modalOverlay.addEventListener('click', hideModal);
})();