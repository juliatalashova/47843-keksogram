/**
 * Created by Julia on 22.11.2015.
 */
/* global Photo: true, Gallery: true */

'use strict';
(function() {
  /**
   * @global
   */
  var filtersContainer = document.getElementsByClassName('filters')[0];
  filtersContainer.classList.add('hidden');
  var container = document.querySelector('.pictures');
  var footer = document.querySelector('footer');
  var activeFilter = 'filter-all';
  /**@type {Array}*/
  var pictures = [];
  var photoPictures = [];
  var filteredPictures = [];
  /**@type {number}*/
  var currentPage = 0;
  /**@const*/
  var PAGE_SIZE = 12;
  var timeoutSize = 100;
  /**@type {Gallery}*/
  var gallery = new Gallery();

  getPictures();

  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    /**@type {number}*/
    scrollTimeout = setTimeout(checkPagesNumber, timeoutSize);
  });
  /**
   * @function checkPagesNumber
   */
  function checkPagesNumber() {
    /**@type {Object}*/
    var footerCoordinates = footer.getBoundingClientRect();
    /**@type {number}*/
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
  /**
   * @function renderPictures
   * @param {Array.<Object>} picturesToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderPictures(picturesToRender, pageNumber, replace) {
    if (replace) {
      photoPictures.forEach(function(picture) {
        picture.destroy();
      });
      photoPictures = [];
    }
    /**@type {DocumentFragment}*/
    var fragmentNew = document.createDocumentFragment();
    /**
     * @type {number}
     */
    var numberFrom = pageNumber * PAGE_SIZE;
    var numberTo = numberFrom + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(numberFrom, numberTo);
    pagePictures.forEach(function(picture) {
      /**@type {Photo}*/
      var photo = new Photo(picture);
      var photoIndex = photoPictures.length;
      photoPictures[photoIndex] = photo;
      var element = photo.render();
      fragmentNew.appendChild(element);
      photo.onClick = function() {
        gallery.setCurrentPicture(photoIndex);
        gallery.show();
      };
      document.addEventListener('keydown', _onDocumentKeyDown);
    });
    container.appendChild(fragmentNew);
  }
  /**
   * @function _onDocumentKeyDown
   * @param {Event} evt
   * @private
   */
  function _onDocumentKeyDown(evt) {
    if (evt.keyCode === 27) {
      document.querySelector('.gallery-overlay').classList.add('invisible');
    }
  }

  /**
   * @function setActiveFilter
   * @param {string} id
   * @param {boolean=} force
   */
  function setActiveFilter(id, force) {
    if (activeFilter === id && !force) {
      return;
    }
    currentPage = 0;
    filteredPictures = pictures.slice(0);
    switch (id) {
      case 'filter-new':
        /**@type {Array}*/
        filteredPictures = filteredPictures.sort(function(a, b) {
          /**@type {Date}*/
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
    gallery.setPictures(filteredPictures);
    renderPictures(filteredPictures, 0, true);
    checkPagesNumber();
    activeFilter = id;
  }

  /**
   * @function getPictures
   */
  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/pictures.json');
    /**@param {Event} evt*/
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

  /**
   * @function addClassFailure
   */
  function addClassFailure() {
    container.classList.add('pictures-failure');
  }

  /**
   * @function updateLoadedPictures
   * @param {Array.<Object>}loadedPictures
   */
  function updateLoadedPictures(loadedPictures) {
    /**@type {Array}*/
    pictures = loadedPictures;
    setActiveFilter(activeFilter, true);
  }
})();

