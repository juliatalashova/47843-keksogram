/**
 * Created by Julia on 22.11.2015.
 */
/* global Photo: true, Gallery: true */

'use strict';
(function() {
  var filtersContainer = document.getElementsByClassName('filters')[0];
  filtersContainer.classList.add('hidden');
  var container = document.querySelector('.pictures');
  var footer = document.querySelector('footer');
  var activeFilter = 'filter-all';
  var pictures = [];
  var filteredPictures = [];
  var currentPage = 0;
  var PAGE_SIZE = 12;
  var timeoutSize = 100;
  var gallery = new Gallery();

  getPictures();

  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkPagesNumber, timeoutSize);
  });

  function checkPagesNumber() {
    var footerCoordinates = footer.getBoundingClientRect();
    var viewportSize = window.innerHeight;
    if (footerCoordinates.bottom - viewportSize <= footerCoordinates.height) {
      if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
        renderPictures(filteredPictures, ++currentPage);
      }
    }
  }

  var filters = document.querySelector('.filters');
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });

  function renderPictures(picturesToRender, pageNumber, replace) {
    if (replace) {
      var picturesAll = document.querySelectorAll('.picture');
      [].forEach.call(picturesAll, function(el) {
        el.removeEventListener('click', _onPhotoClick);
        container.removeChild(el);
      });
    }

    var fragmentNew = document.createDocumentFragment();

    var numberFrom = pageNumber * PAGE_SIZE;
    var numberTo = numberFrom + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(numberFrom, numberTo);

    pagePictures.forEach(function(picture) {
      var photo = new Photo(picture);
      photo.render();
      fragmentNew.appendChild(photo.element);
      photo.element.addEventListener('click', _onPhotoClick);
      document.addEventListener('keydown', _onDocumentKeyDown);
    });
    container.appendChild(fragmentNew);
  }
  function _onPhotoClick(evt) {
    evt.preventDefault();
    gallery.show();
  }
  function _onDocumentKeyDown(evt) {
    if (evt.keyCode === 27) {
      document.querySelector('.gallery-overlay').classList.add('invisible');
    }
  }
  function setActiveFilter(id, force) {
    if (activeFilter === id && !force) {
      return;
    }
    currentPage = 0;
    filteredPictures = pictures.slice(0);
    switch (id) {
      case 'filter-new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          var realDateB = new Date(b.date);
          var timestampB = realDateB.getTime();
          var realDateA = new Date(a.date);
          var timestampA = realDateA.getTime();
          return timestampB - timestampA;
        });
        break;
      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }
    renderPictures(filteredPictures, 0, true);
    checkPagesNumber();
    activeFilter = id;
  }
  /**
   *@param {Object} data
   *@return {Element}
   */
  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/pictures.json');

    xhr.onload = function(evt) {
      container.classList.remove('pictures-loading');
      var rawData = evt.target.response;
      var loadedPictures = JSON.parse(rawData);
      updateLoadedPictures(loadedPictures);
    };
    filtersContainer.classList.remove('hidden');

    xhr.ontimeout = function() {
      addClassFailure();
    };

    xhr.onerror = function() {
      addClassFailure();
    };
    container.classList.add('pictures-loading');
    xhr.send();
  }

  function addClassFailure() {
    container.classList.add('pictures-failure');
  }

  function updateLoadedPictures(loadedPictures) {
    pictures = loadedPictures;
    setActiveFilter(activeFilter, true);
  }
})();

