/**
 * Created by Julia on 22.11.2015.
 */
'use strict';

document.getElementsByClassName('filters')[0].classList.add('hidden');

var container = document.querySelector('.pictures');

pictures.forEach(function(picture) {
  var element = getElementFromTemplate(picture);
  container.appendChild(element);
});
document.getElementsByClassName('filters')[0].classList.remove('hidden');

/**
 *@param {Object} data
 *@return {Element}
 */
function getElementFromTemplate(data) {
  var template = document.querySelector('#picture-template');

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
    blockImage.width = 182;
    blockImage.height = 182;
    element.replaceChild(blockImage, imgToReplace);
  };
  blockImage.onerror = function() {
    element.classList.add('picture-load-failure');
  };
  return element;
}

