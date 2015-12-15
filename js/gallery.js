/**
 * Created by Julia on 06.12.2015.
 */
'use strict';
(function() {
  /**
   * @constructor
   */
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
    this._onCloseClick = this._onCloseClick.bind(this);
  };
  /**
   * @method
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
  };
  /**@param {Array} pictures*/
  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };
  Gallery.prototype.setCurrentPicture = function(key) {
    var gallery = document.querySelector('.gallery-overlay');
    var galleryImage = gallery.querySelector('.gallery-overlay-image');
    galleryImage.src = this.pictures[key].url;
    var galleryLikes = gallery.querySelector('.gallery-overlay-controls-like');
    galleryLikes.querySelector('.likes-count').textContent = this.pictures[key].likes;
    var galleryComments = gallery.querySelector('.gallery-overlay-controls-comments');
    galleryComments.querySelector('.comments-count').textContent = this.pictures[key].comments;
  };
  /**
   * @method
   * @param {Array.<Object>} pictures
   */
  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };
  /**@method*/
  Gallery.prototype.setCurrentPicture = function(key) {
    var picture = this.pictures[key];
    this.element.querySelector('.gallery-overlay-image').src = picture.url;
    var galleryControls = document.querySelector('.gallery-overlay-controls');
    galleryControls.querySelector('.likes-count').textContent = picture.likes;
    galleryControls.querySelector('.comments-count').textContent = picture.comments;
  };
  /**
   * @method
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
  };
  /**@private*/
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };
  window.Gallery = Gallery;
})();

