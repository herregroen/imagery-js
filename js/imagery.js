(function (window) {
  'use strict';

  var Imagery = function (img) {
    this.image  = img;
    this.canvas = document.createElement('canvas');
    this.width  = img.width;
    this.height = img.height;

    this.resize(this.image.width, this.image.height);
  };

  Imagery.prototype = {
    resize: function (width, height) {
      this.width  = width;
      this.height = height;

      this.render();
    },
    fit: function (width, height) {
      var ratio = Math.min(width / this.width, height / this.height)

      this.width  *= ratio
      this.height *= ratio

      this.render()
    },
    render: function () {
      this.canvas.width  = this.width;
      this.canvas.height = this.height;

      this.canvas.getContext('2d').drawImage(this.image, 0, 0, this.width, this.height)
    },
    to_blob: function () {
      var dataURL = this.canvas.toDataURL('image/png');
      var binary  = atob(dataURL.split(',')[1]);
      var array   = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: 'image/png' });
    },
    to_dataURL: function () {
      return this.canvas.toDataURL('image/png');
    }
  };

  window.createImagery = function (obj, cb) {
    var image    = new Image();
    image.onload = function () { cb(new Imagery(this)); }
    if (obj instanceof File) {
      image.src = URL.createObjectURL(obj);
    } else if ((obj.tagName && obj.tagName === 'img') || obj instanceof Image) {
      imgage.src = obj.src
    } else if (obj.tagName && obj.tagName === 'canvas') {
      image.src = obj.toDataURL();
    } else {
      return false;
    }
    return true;
  };
}(this));
