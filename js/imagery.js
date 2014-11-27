(function (window) {
  'use strict';

  var Imagery = function (img) {
    this.image  = img;
    this.canvas = document.createElement('canvas');

    this.rendered = false;
  };

  Imagery.prototype = {
    resize: function (width, height) {
      this.canvas.width  = width;
      this.canvas.height = height;

      this.canvas.getContext('2d').drawImage(this.image, 0, 0, width, height);

      return (this.rendered = true);
    },
    fit: function (width, height) {
      var ratio = Math.min(width / this.image.width, height / this.image.height);

      this.canvas.width  = this.image.width  * ratio;
      this.canvas.height = this.image.height * ratio;

      this.canvas.getContext('2d').drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

      return (this.rendered = true);
    },
    fill: function (width, height) {
      var ratio = Math.max(width / this.image.width, height / this.image.height);

      var x = ((this.image.width * ratio) - width) / -2;
      var y = ((this.image.height * ratio) - height) / -2;

      var draw_width  = this.image.width  * ratio;
      var draw_height = this.image.height * ratio;

      this.canvas.width  = width;
      this.canvas.height = height;

      this.canvas.getContext('2d').drawImage(this.image, x, y, draw_width, draw_height);

      return (this.rendered = true);
    },
    crop: function (x, y, width, height) {
      if (x > this.image.width || y > this.image.height) { return false; }

      width  = Math.min(width, image.width - x);
      height = Math.min(height, image.height - y);

      this.canvas.getContext('2d').drawImage(this.image, -x, -y, width, height);

      return (this.rendered = true);
    },
    reset: function () {
      this.canvas.width  = this.image.width;
      this.canvas.height = this.image.height;

      this.canvas.getContext('2d').drawImage(this.image, 0, 0);

      return (this.rendered = true);
    },
    to_blob: function () {
      if (!this.rendered) { this.reset(); }

      var dataURL = this.canvas.toDataURL('image/png');
      var binary  = atob(dataURL.split(',')[1]);
      var array   = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: 'image/png' });
    },
    to_dataURL: function () {
      if (!this.rendered) { this.reset(); }

      return this.canvas.toDataURL('image/png');
    }
  };

  window.createImagery = function (obj, cb) {
    var image    = new Image();
    image.onload = function () { cb(new Imagery(this)); }
    if (obj instanceof File) {
      image.src = URL.createObjectURL(obj);
    } else if ((obj.tagName && obj.tagName === 'IMG') || obj instanceof Image) {
      image.src = obj.src
    } else if (obj.tagName && obj.tagName === 'CANVAS') {
      image.src = obj.toDataURL();
    } else if (typeof obj === 'string') {
      if (obj.substring(0,4) == 'http') { image.crossOrigin = 'anonymous'; }
      image.src = obj;
    } else {
      return false;
    }
    return true;
  };
}(this));
