(function (window) {
  'use strict';

  var Imagery = function (img) {
    this.image  = img;
    this.canvas = document.createElement('canvas');
    this.width  = img.width;
    this.height = img.height;

    this.x = 0
    this.y = 0

    this.rendered = false;
  };

  Imagery.prototype = {
    resize: function (width, height) {
      this.width  = width;
      this.height = height;

      this.render();
    },
    fit: function (width, height) {
      var ratio = Math.min(width / this.width, height / this.height);

      this.width  *= ratio;
      this.height *= ratio;

      this.render();
    },
    fill: function (width, height) {
      var ratio = Math.max(width / this.width, height / this.height);

      this.x = ((this.width * ratio) - width) / -2;
      this.y = ((this.height * ratio) - height) / -2;

      this.width  *= ratio;
      this.height *= ratio;

      this.canvas.width  = width;
      this.canvas.height = height;

      this.rendered = true;

      this.canvas.getContext('2d').drawImage(this.image, this.x, this.y, this.width, this.height);
    },
    render: function () {
      this.canvas.width  = this.width;
      this.canvas.height = this.height;

      this.rendered = true;

      this.canvas.getContext('2d').drawImage(this.image, this.x, this.y, this.width, this.height);
    },
    to_blob: function () {
      if (!this.rendered) { this.render(); }

      var dataURL = this.canvas.toDataURL('image/png');
      var binary  = atob(dataURL.split(',')[1]);
      var array   = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: 'image/png' });
    },
    to_dataURL: function () {
      if (!this.rendered) { this.render(); }

      return this.canvas.toDataURL('image/png');
    }
  };

  window.createImagery = function (obj, cb) {
    var image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = function () { cb(new Imagery(this)); }
    if (obj instanceof File) {
      image.src = URL.createObjectURL(obj);
    } else if ((obj.tagName && obj.tagName === 'IMG') || obj instanceof Image) {
      image.src = obj.src
    } else if (obj.tagName && obj.tagName === 'CANVAS') {
      image.src = obj.toDataURL();
    } else if (typeof obj === 'string') {
      image.src = obj;
    } else{
      return false;
    }
    return true;
  };
}(this));
