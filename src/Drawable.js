// Drawable.js - Modular library inspired by Android's Drawable

// --- Exportable constants ---
export const Shape = {
  LINE: 'LINE',
  OVAL: 'OVAL',
  RECTANGLE: 'RECT'
};

export const Gradient = {
  RADIAL_GRADIENT: 'R_G',
  LINEAR_GRADIENT: 'L_G'
};

export const Alignment = {
  TOP: 'A_T',
  BOTTOM: 'A_B',
  LEFT: 'A_L',
  RIGHT: 'A_R',
  CENTER: 'A_C'
};

export const Orientation = {
  VERTICAL: 'O_V',
  HORIZONTAL: 'O_H'
};

// - hPerc is an approximate percentage for any text size, which allows you to calculate the height (px) that alphanumeric characters will have when using a certain font.
// - lowerOverlap is a rough percentage for any text size, which allows you to calculate the height overflow (px) for some alphanumeric characters when using a certain font.
// "Arial","Baloo","Calibri","Comic Sans MS","Consolas","Courier New","Droid Sans","Droid Serif","Fredoka One","Georgia","Impact","Times New Roman","Trebuchet MS","Verdana"
export const Font = {
    ARIAL: { name: 'Arial', hPerc: 0.78, lowerOverlap: 0.03 },
    AVERIA: { name: 'Averia Gruesa', hPerc: 0.76, lowerOverlap: 0.03 },
    BALOO: { name: 'Baloo', hPerc: 0.69, lowerOverlap: 0.03 },
    BEBAS_NEUE: { name: 'Bebas Neue', hPerc: 0.75, lowerOverlap: 0.03 },
    BUTCHERMAN: { name: 'Butcherman', hPerc: 0.77, lowerOverlap: 0.05 },
    CALIBRI: { name: 'Calibri', hPerc: 0.69, lowerOverlap: 0.03 },
    COMIC_SANS: { name: 'Comic Sans MS', hPerc: 0.78, lowerOverlap: 0.03 },
    CONSOLAS: { name: 'Consolas', hPerc: 0.69, lowerOverlap: 0.03 },
    COURIER_NEW: { name: 'Courier New', hPerc: 0.65, lowerOverlap: 0.03 },
    CRASH_NUMB: { name: 'Crash Numbering Serif', hPerc: 0.74, lowerOverlap: 0.03 },
    CREEPSTER: { name: 'Creepster', hPerc: 0.76, lowerOverlap: 0.03 },
    DROID_SANS: { name: 'Droid Sans', hPerc: 0.73, lowerOverlap: 0.03 },
    DROID_SERIF: { name: 'Droid Serif', hPerc: 0.73, lowerOverlap: 0.03 },
    EATER: { name: 'Eater', hPerc: 0.85, lowerOverlap: 0.04 },
    FLAVORS: { name: 'Flavors', hPerc: 0.78, lowerOverlap: 0.03 },
    FREDOKA_ONE: { name: 'Fredoka One', hPerc: 0.76, lowerOverlap: 0.03 },
    GEORGIA: { name: 'Georgia', hPerc: 0.75, lowerOverlap: 0.03 },
    GOCHI_HAND: { name: 'Gochi Hand', hPerc: 0.59, lowerOverlap: 0.03 },
    IMPACT: { name: 'Impact', hPerc: 0.83, lowerOverlap: 0.03 },
    MOUNT_CHRIST: { name: 'Mountains of Christmas', hPerc: 0.83, lowerOverlap: 0.06 },
    RAMABHADRA: { name: 'Ramabhadra', hPerc: 0.76, lowerOverlap: 0.03 },
    TIMES_NEW_R: { name: 'Times New Roman', hPerc: 0.75, lowerOverlap: 0.03 },
    TREBUCHET: { name: 'Trebuchet MS', hPerc: 0.75, lowerOverlap: 0.03 },
    VERDANA: { name: 'Verdana', hPerc: 0.77, lowerOverlap: 0.03 },

  values: function () {
    return Object.values(this).filter(f => typeof f !== 'function');
  },

  getFonts: function () {
    return this.values().map(f => f.name);
  },

  keys: function () {
    return Object.keys(this).filter(k => typeof this[k] !== 'function');
  },

  getKeyByName: function (name) {
    return this.keys().find(k => this[k].name === name);
  }
};

export const FontLoader = {
  load: function (info) {
    const fonts = info.families;
    const width = 150, height = 25;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const loadFont = function (font) {
      const text = new Drawable(width, height);
      text.ctx = canvas.getContext("2d");
      text.update = function () {
        this.items = [{
          text: "AEIOUBCDFGHIJ/0123456789",
          font: font,
          size: 20,
          color: "#FFFFFF",
          textAlign: "left",
          vAlign: "top",
          x: 0,
          y: 0
        }];
      };
      text.onPostBuild = function () {
        if (fonts.length > 0) loadFont(fonts.pop());
        else info.active();
      };
      text.build();
    };
    loadFont(fonts.pop());
  }
};

// --- Funciones internas ---
const getPointsFromAngle = (angle, center, w, h) => {
    var centerX = typeof center.x !== "undefined" ? parseFloat(center.x.replace('%', '')) : 0;
    var centerY = typeof center.y !== "undefined" ? parseFloat(center.y.replace('%', '')) : 0;
    var fAngle = Math.atan((h / 2) / (w / 2)) * (180 / Math.PI);
    var sAngle = 90 - fAngle;
    var percX = centerX / 100;
    var percY = centerY / 100;
    var cAngle, adjacent;
    var quadrant;

    if (angle >= 360) {
        angle = angle - (360 * Math.floor(angle / 360));
    }

    if (angle >= 270) {
        cAngle = angle - 270;
        quadrant = 4;
    }
    else if (angle >= 180) {
        cAngle = angle - 180;
        quadrant = 3;
    }
    else if (angle >= 90) {
        cAngle = angle - 90;
        quadrant = 2;
    }
    else {
        cAngle = angle;
        quadrant = 1;
    }

    var pM = { x: w / 2, y: h / 2 }; // Midpoint
    var a1;
    if (quadrant == 1 || quadrant == 3) {
        if (cAngle < fAngle) {
            adjacent = pM.x;
            a1 = cAngle;
        }
        else {
            adjacent = pM.y;
            a1 = 90 - cAngle;
        }
    }
    else {//if(quadrant==2 || quadrant==4)
        if (cAngle < sAngle) {
            adjacent = pM.y;
            a1 = cAngle;
        }
        else {
            adjacent = pM.x;
            a1 = 90 - cAngle;
        }
    }

    var opposite = Math.tan(a1 / (180 / Math.PI)) * adjacent;
    var x0, y0, x1, y1;

    switch (quadrant) {
        case 1:
            if (cAngle < fAngle) {
                x0 = pM.x - adjacent;
                y0 = pM.y + opposite;
                x1 = pM.x + adjacent;
                y1 = pM.y - opposite;
            }
            else {
                x0 = pM.x - opposite;
                y0 = pM.y + adjacent;
                x1 = pM.x + opposite;
                y1 = pM.y - adjacent;
            }
            x0 = x0 + (w * percX);
            y0 = y0 - (h * percY);
            break;
        case 2:
            if (cAngle < sAngle) {
                x0 = pM.x + opposite;
                y0 = pM.y + adjacent;
                x1 = pM.x - opposite;
                y1 = pM.y - adjacent;
            }
            else {
                x0 = pM.x + adjacent;
                y0 = pM.y + opposite;
                x1 = pM.x - adjacent;
                y1 = pM.y - opposite;
            }
            x0 = x0 - (w * percX);
            y0 = y0 - (h * percY);
            break;
        case 3:
            if (cAngle < fAngle) {
                x0 = pM.x + adjacent;
                y0 = pM.y - opposite;
                x1 = pM.x - adjacent;
                y1 = pM.y + opposite;
            }
            else {
                x0 = pM.x + opposite;
                y0 = pM.y - adjacent;
                x1 = pM.x - opposite;
                y1 = pM.y + adjacent;
            }
            x0 = x0 - (w * percX);
            y0 = y0 + (h * percY);
            break;
        case 4:
            if (cAngle < sAngle) {
                x0 = pM.x - opposite;
                y0 = pM.y - adjacent;
                x1 = pM.x + opposite;
                y1 = pM.y + adjacent;
            }
            else {
                x0 = pM.x - adjacent;
                y0 = pM.y - opposite;
                x1 = pM.x + adjacent;
                y1 = pM.y + opposite;
            }
            x0 = x0 + (w * percX);
            y0 = y0 + (h * percY);
            break;
    }
    return { x0: x0, y0: y0, x1: x1, y1: y1 };
};

const ImageCache = {};
const getImgCopy = (imgName, width, height) => {
    var result;
    var imgSize = width + "_" + height;
    var targetImages = ImageCache[imgSize];

    if (typeof targetImages !== "undefined") {
        if (typeof targetImages[imgName] !== "undefined") {
            return targetImages[imgName];
        }
    } else {
        ImageCache[imgSize] = {};
    }
    var defaultImages = ImageCache['75_75'];
    if (typeof defaultImages[imgName] !== "undefined") {
        ImageCache[imgSize][imgName] = cloneJSON(defaultImages[imgName]);
        ImageCache[imgSize][imgName].w = width;
        ImageCache[imgSize][imgName].h = height;
        result = ImageCache[imgSize][imgName];
    }
    return result;
};

const cloneJSON = (source) => {
  if (Array.isArray(source)) return source.map(cloneJSON);
  else if (typeof source === 'object' && source !== null) {
    const copy = {};
    for (const key in source) copy[key] = cloneJSON(source[key]);
    return copy;
  }
  return source;
};

// --- Clase principal ---
export function Drawable(width = 0, height = 0, x = 0, y = 0) {
  this.margin = { top: 0, left: 0, bottom: 0, right: 0 };
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  let tWidth = 0, tHeight = 0;

    const applyFilter = (imgInfo) => {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = imgInfo.w || imgInfo.width;
        canvas.height = imgInfo.h || imgInfo.height;
        ctx.drawImage(imgInfo.image, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = imgInfo.cf || imgInfo.colorFilter;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
    };

    const removeShadow = () => {
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowColor = "transparent";
        this.ctx.shadowBlur = 0;
    };

    const addShadow = (shadow) => {
        this.ctx.shadowOffsetX = shadow.dx;
        this.ctx.shadowOffsetY = shadow.dy;
        this.ctx.shadowColor = shadow.color;
        this.ctx.shadowBlur = shadow.blur;
    };

  const draw = () => {
    for (let item of this.items) {
        if (typeof item.color !== 'undefined') {
            this.ctx.fillStyle = item.color;
        }
        else if (typeof item.gradient !== 'undefined') {
            const gradient = item.gradient;
            let grd;
            if (gradient.type == Gradient.RADIAL_GRADIENT) {
                grd = this.ctx.createRadialGradient(
                    gradient.center1.x,
                    gradient.center1.y,
                    gradient.radius1,
                    gradient.center2.x,
                    gradient.center2.y,
                    gradient.radius2);
            }
            else if (gradient.type == Gradient.LINEAR_GRADIENT) {
                var points = getPointsFromAngle(gradient.angle, gradient.center, item.width, item.height);
                grd = this.ctx.createLinearGradient(
                    points.x0 + item.x,
                    points.y0 + item.y,
                    points.x1 + item.x,
                    points.y1 + item.y);
            }

            grd.addColorStop(0, gradient.startColor);
            if (typeof gradient.centerColor !== 'undefined') {
                grd.addColorStop(0.5, gradient.centerColor);
            }
            grd.addColorStop(1, gradient.endColor);

            this.ctx.fillStyle = grd;
        }

        if (typeof item.shadow !== 'undefined') {
            addShadow(item.shadow);
        }

        if (typeof item.text !== 'undefined') {
            // item.y indicates the position from where the text begins to be painted
            // this.y indicates the position reserved to start erasing the text, given that some characters overflow and also because of shadows.
            const calcOverlap = item.size * item.font.lowerOverlap;
            const calcHeight = item.size * item.font.hPerc;
            const shadowBlur = typeof item.shadow !== 'undefined' ? item.shadow.blur : 0;
            let mY = item.y - calcOverlap;

            if (typeof item.lineHeight !== 'undefined') mY -= item.lineHeight;

            let yAdjust;
            if (item.vAlign == 'top') {
                mY -= shadowBlur;
                yAdjust = mY;
                mY += calcHeight;
            }
            else if (item.vAlign == 'middle') {
                const middle = calcHeight / 2;
                yAdjust = mY - middle;
                mY += middle;
            }
            else if (item.vAlign == 'bottom') {
                yAdjust = mY - calcHeight;
            }

            this.x = item.x - (calcHeight / 2);
            this.y = yAdjust - shadowBlur - (calcHeight / 2);

            this.ctx.font = item.size + 'px ' + item.font.name;
            this.ctx.textAlign = item.textAlign;
            this.ctx.textBaseline = 'alphabetic'; // Consistent baseline for any source and on any device.
            this.ctx.fillText(item.text, item.x, mY);

            tWidth = this.ctx.measureText(item.text).width + calcHeight;
            //tHeight = calcHeight + calcOverlap + (shadowBlur*2) + calcHeight;
            tHeight = calcHeight + calcOverlap + (shadowBlur * 2);
        }
        else if (item.shape == Shape.LINE) {
            this.ctx.beginPath();
            this.ctx.moveTo(item.from.x, item.from.y);
            this.ctx.lineTo(item.to.x, item.to.y);
        }
        else if (item.shape == Shape.OVAL) {
            this.ctx.beginPath();
            this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
        }
        else if (item.shape == Shape.RECTANGLE) {
            const rx = item.x;
            const ry = item.y;
            const rw = item.width;
            const rh = item.height;

            if (typeof item.cornerRadius !== 'undefined') {
                const cr0 = item.cornerRadius[0] || 0;
                const cr1 = item.cornerRadius[1] || 0;
                const cr2 = item.cornerRadius[2] || 0;
                const cr3 = item.cornerRadius[3] || 0;
                this.ctx.beginPath();
                this.ctx.moveTo(rx + rw - cr1, ry);
                this.ctx.arcTo(rx + rw, ry, rx + rw, ry + cr1, cr1);
                this.ctx.lineTo(rx + rw, ry + rh - cr2);
                this.ctx.arcTo(rx + rw, ry + rh, rx + rw - cr2, ry + rh, cr2);
                this.ctx.lineTo(rx + cr3, ry + rh);
                this.ctx.arcTo(rx, ry + rh, rx, ry + rh - cr3, cr3);
                this.ctx.lineTo(rx, ry + cr0);
                this.ctx.arcTo(rx, ry, rx + cr0, ry, cr0);
                this.ctx.closePath();
                this.ctx.fill();
            }
            else {
                this.ctx.fillRect(rx, ry, rw, rh);
            }
        }
        else if (typeof item.image !== 'undefined') {
            if (item.image == 'image/url') {
                var imgUrl = item.url;
                var imgName = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
                var imgCopy = getImgCopy(imgName, item.width, item.height);
                var imgCache = typeof imgCopy !== 'undefined';
                if (imgCache) {
                    if (typeof imgCopy.w !== 'undefined' && typeof imgCopy.h !== 'undefined') {
                        if (typeof item.colorFilter !== 'undefined') {
                            imgCopy.cf = item.colorFilter;
                            this.ctx.drawImage(applyFilter(imgCopy), item.x, item.y);
                        }
                        else {
                            this.ctx.drawImage(imgCopy.image, item.x, item.y, imgCopy.w, imgCopy.h);
                        }
                    }
                    else {
                        this.ctx.drawImage(imgCopy.image, item.x, item.y);
                    }
                    if (typeof item.onLoadImg !== "undefined") item.onLoadImg();
                }
                else {
                    const img = new Image();
                    img.onload = function (n, w, h) {
                        var imgInfo = { w: w, h: h };
                        var imgSize = w + "_" + h;
                        if (typeof w !== 'undefined' && typeof h !== 'undefined') {
                            if (typeof item.colorFilter !== 'undefined') {
                                item.image = img;
                                imgInfo.cf = item.colorFilter;
                                this.ctx.drawImage(applyFilter(item), item.x, item.y);
                            }
                            else {
                                this.ctx.drawImage(img, item.x, item.y, w, h);
                            }
                            imgInfo.image = img;
                        }
                        else {
                            imgInfo.image = img;
                            this.ctx.drawImage(img, item.x, item.y);
                        }
                        if (typeof ImageCache[imgSize] === undefined) ImageCache[imgSize] = {};
                        ImageCache[imgSize][n] = imgInfo;
                        if (typeof item.onLoadImg !== "undefined") item.onLoadImg();
                    }.bind(this, imgName, item.width, item.height);
                    img.src = item.url;
                }
            }
            else {
                if (item.width !== 'undefined' && typeof item.height !== 'undefined') {
                    this.ctx.drawImage(item.data, item.x, item.y, item.width, item.height);
                }
                else {
                    this.ctx.drawImage(item.data, item.x, item.y);
                }
            }
        }

        if (typeof item.stroke !== 'undefined') {
            this.ctx.lineWidth = item.stroke.width;
            this.ctx.strokeStyle = item.stroke.color;
            this.ctx.stroke();
        }

        if (typeof item.posDraw !== 'undefined') {
            item.posDraw();
        }

        if (typeof item.shadow !== 'undefined') {
            removeShadow();
        }
    }
    this.width = tWidth > this.width ? tWidth : this.width;
    this.height = tHeight > this.height ? tHeight : this.height;
  };

  this.clear = () => {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
  };

  const animation = () => {
    const next = this.newState();
    this.clear();
    this.update();
    draw();
    if (!next) this.stop();
  };

  const animationFrame = () => {
    this.clear();
    this.update();
    draw();
    if (this.newState()) requestAnimationFrame(() => animationFrame());
  };

  this.stop = () => clearInterval(this.interval);

  this.build = (msInterval) => {
    if (this.onFirstBuild) {
      this.onFirstBuild();
      delete this.onFirstBuild;
    }
    if (this.newState) {
      if (msInterval) this.interval = setInterval(animation, msInterval);
      else requestAnimationFrame(() => animationFrame());
    } else {
      this.update();
      draw();
    }
    if (this.onPostBuild) {
      this.onPostBuild();
      delete this.onPostBuild;
    }
  };
} // End Drawable
