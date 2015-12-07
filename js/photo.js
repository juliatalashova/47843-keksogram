/**
 * Created by Julia on 06.12.2015.
 */
'use strict';
(function() {
  var Photo = function(data) {
    this._data = data;
  };

  Photo.prototype = {
    _data: null,
    element: null,
    render: function() {
      var template = document.querySelector('#picture-template');
      if ('content' in template) {
        this.element = template.content.children[0].cloneNode(true);
      } else {
        this.element = template.children[0].cloneNode(true);
      }

      this.element.querySelector('.picture-comments').textContent = this._data.comments;
      this.element.querySelector('.picture-likes').textContent = this._data.likes;

      var blockImage = new Image();
      blockImage.src = this._data.url;
      var imgToReplace = this.element.querySelector('img');

      blockImage.onload = function() {
        blockImage.width = imgToReplace.width;
        blockImage.height = imgToReplace.height;
        this.element.replaceChild(blockImage, imgToReplace);
      }.bind(this);

      blockImage.onerror = function() {
        this.element.classList.add('picture-load-failure');
      }.bind(this);
    }
  };
  window.Photo = Photo;
})();

