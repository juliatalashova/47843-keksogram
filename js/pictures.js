/**
 * Created by Julia on 22.11.2015.
 */
'use strict';

var filtersContainer = document.getElementsByClassName('filters')[0];
filtersContainer.classList.add('hidden');
var template = document.querySelector('#picture-template');
var container = document.querySelector('.pictures');
var activeFilter = 'filter-all';
var pictures = [];

function filterClickHandler(evt) {
  var clickedElementID = evt.target.id;
  setActiveFilter(clickedElementID);
}
var filters = document.querySelectorAll('.filters-radio');
for (var i = 0; i < filters.length; i++) {
  filters[i].onclick = filterClickHandler;
}

getPictures();

function renderPictures(picturesToRender) {
  container.innerHTML = '';
  var fragmentNew = document.createDocumentFragment();

  picturesToRender.forEach(function(picture) {
    var element = getElementFromTemplate(picture);
    fragmentNew.appendChild(element);
  });
  container.appendChild(fragmentNew);
}

function setActiveFilter(id, force) {
  if (activeFilter === id && !force) {
    return;
  }
  var filteredPictures = pictures.slice(0);

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
  renderPictures(filteredPictures);

  activeFilter = id;
}
  /**
   *@param {Object} data
   *@return {Element}
   */
function getElementFromTemplate(data) {
  var element;
  if ('content' in template) {
    element = template.content.children[0].cloneNode(true);
  } else {
    element = template.children[0].cloneNode(true);
  }

  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  var blockImage = new Image();
  blockImage.src = data.url;
  var imgToReplace = element.querySelector('img');

  blockImage.onload = function() {
    blockImage.width = imgToReplace.width;
    blockImage.height = imgToReplace.height;
    element.replaceChild(blockImage, imgToReplace);
  };

  blockImage.onerror = function() {
    element.classList.add('picture-load-failure');
  };
  return element;
}

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
