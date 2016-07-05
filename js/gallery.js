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

