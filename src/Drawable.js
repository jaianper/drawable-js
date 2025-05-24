/*
 * DrawableJS
 * Copyright (c) 2025 jaianper
 *
 * This file is part of DrawableJS.
 * Licensed under the GNU General Public License v3.0.
 * You may obtain a copy of the License at https://www.gnu.org/licenses/gpl-3.0.txt
 */

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

const DAR = 0.75; // DEFAULT_ASCENT_RATIO
const DDR = 0.03; // DEFAULT_DESCENT_RATIO

/**
 * `ascentRatio` and `descentRatio` are empirical estimates of typographic layout proportions that are used 
 * as a fallback when the browser does not support the `actualBoundingBoxAscent` and `actualBoundingBoxDescent` properties.
 * 
 * - 75% of the font size is usually above the baseline (ascent).
 * - 3% is usually below (descent).
 */
export const Font = {
    ARIAL: {name: 'Arial', ascentRatio: 0.78, descentRatio: DDR},
    AVERIA: {name: 'Averia Gruesa', ascentRatio: 0.76, descentRatio: DDR},
    BALOO: {name: 'Baloo', ascentRatio: 0.69, descentRatio: DDR},
    BEBAS_NEUE: {name: 'Bebas Neue', ascentRatio: DAR, descentRatio: DDR},
    BUTCHERMAN: {name: 'Butcherman', ascentRatio: 0.77, descentRatio: 0.05},
    CALIBRI: {name: 'Calibri', ascentRatio: 0.69, descentRatio: DDR},
    COMIC_SANS: {name: 'Comic Sans MS', ascentRatio: 0.78, descentRatio: DDR},
    CONSOLAS: {name: 'Consolas', ascentRatio: 0.69, descentRatio: DDR},
    COURIER_NEW: {name: 'Courier New', ascentRatio: 0.65, descentRatio: DDR},
    CRASH_NUMB: {name: 'Crash Numbering Serif', ascentRatio: 0.74, descentRatio: DDR},
    CREEPSTER: {name: 'Creepster', ascentRatio: 0.76, descentRatio: DDR},
    DROID_SANS: {name: 'Droid Sans', ascentRatio: 0.73, descentRatio: DDR},
    DROID_SERIF: {name: 'Droid Serif', ascentRatio: 0.73, descentRatio: DDR},
    EATER: {name: 'Eater', ascentRatio: 0.85, descentRatio: 0.04},
    FLAVORS: {name: 'Flavors', ascentRatio: 0.78, descentRatio: DDR},
    FREDOKA_ONE: {name: 'Fredoka One', ascentRatio: 0.76, descentRatio: DDR},
    GEORGIA: {name: 'Georgia', ascentRatio: DAR, descentRatio: DDR},
    GOCHI_HAND: {name: 'Gochi Hand', ascentRatio: 0.59, descentRatio: DDR},
    IMPACT: {name: 'Impact', ascentRatio: 0.83, descentRatio: DDR},
    MOUNT_CHRIST: {name: 'Mountains of Christmas', ascentRatio: 0.83, descentRatio: 0.06},
    RAMABHADRA: {name: 'Ramabhadra', ascentRatio: 0.76, descentRatio: DDR},
    TIMES_NEW_R: {name: 'Times New Roman', ascentRatio: DAR, descentRatio: DDR},
    TREBUCHET: {name: 'Trebuchet MS', ascentRatio: DAR, descentRatio: DDR},
    VERDANA: {name: 'Verdana', ascentRatio: 0.77, descentRatio: DDR},

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
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const loadFont = function (font) {
            const text = new Drawable(width, height);
            text.ctx = canvas.getContext('2d');
            text.update = function () {
                this.items = [{
                    text: 'AEIOUBCDFGHIJ/0123456789',
                    font: {family: font, size: 20},
                    color: '#FFFFFF',
                    textAlign: 'left',
                    verticalAlign: 'top',
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

// --- Internal functions ---
const getPointsFromAngle = (angle, center, width, height) => {
    // Convert center of % to decimal values
    const centerXPercent = center?.x ? parseFloat(center.x.replace('%', '')) / 100 : 0;
    const centerYPercent = center?.y ? parseFloat(center.y.replace('%', '')) / 100 : 0;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    // Critical angle separating width/height in the circle
    const fovAngle = Math.atan(halfHeight / halfWidth) * (180 / Math.PI);
    const altFovAngle = 90 - fovAngle;

    // Ensure angle within 0–360°
    const normalizedAngle = angle % 360;

    // Determine quadrant and relative angle
    let quadrant = 1;
    let angleInQuadrant = normalizedAngle;

    if (normalizedAngle >= 270) {
        angleInQuadrant = normalizedAngle - 270;
        quadrant = 4;
    } else if (normalizedAngle >= 180) {
        angleInQuadrant = normalizedAngle - 180;
        quadrant = 3;
    } else if (normalizedAngle >= 90) {
        angleInQuadrant = normalizedAngle - 90;
        quadrant = 2;
    }

    // Determine adjacent side and acute angle (to be used with tangent)
    let adjacent, innerAngleDeg;

    const inQuadrant13 = quadrant === 1 || quadrant === 3;
    if (inQuadrant13) {
        if (angleInQuadrant < fovAngle) {
            adjacent = halfWidth;
            innerAngleDeg = angleInQuadrant;
        } else {
            adjacent = halfHeight;
            innerAngleDeg = 90 - angleInQuadrant;
        }
    } else {
        if (angleInQuadrant < altFovAngle) {
            adjacent = halfHeight;
            innerAngleDeg = angleInQuadrant;
        } else {
            adjacent = halfWidth;
            innerAngleDeg = 90 - angleInQuadrant;
        }
    }

    const opposite = Math.tan(innerAngleDeg * (Math.PI / 180)) * adjacent;

    // Coordinates of a symmetrical line with respect to the center
    let x0, y0, x1, y1;

    switch (quadrant) {
        case 1:
            if (angleInQuadrant < fovAngle) {
                x0 = halfWidth - adjacent;
                y0 = halfHeight + opposite;
                x1 = halfWidth + adjacent;
                y1 = halfHeight - opposite;
            } else {
                x0 = halfWidth - opposite;
                y0 = halfHeight + adjacent;
                x1 = halfWidth + opposite;
                y1 = halfHeight - adjacent;
            }
            x0 += width * centerXPercent;
            y0 -= height * centerYPercent;
            break;

        case 2:
            if (angleInQuadrant < altFovAngle) {
                x0 = halfWidth + opposite;
                y0 = halfHeight + adjacent;
                x1 = halfWidth - opposite;
                y1 = halfHeight - adjacent;
            } else {
                x0 = halfWidth + adjacent;
                y0 = halfHeight + opposite;
                x1 = halfWidth - adjacent;
                y1 = halfHeight - opposite;
            }
            x0 -= width * centerXPercent;
            y0 -= height * centerYPercent;
            break;

        case 3:
            if (angleInQuadrant < fovAngle) {
                x0 = halfWidth + adjacent;
                y0 = halfHeight - opposite;
                x1 = halfWidth - adjacent;
                y1 = halfHeight + opposite;
            } else {
                x0 = halfWidth + opposite;
                y0 = halfHeight - adjacent;
                x1 = halfWidth - opposite;
                y1 = halfHeight + adjacent;
            }
            x0 -= width * centerXPercent;
            y0 += height * centerYPercent;
            break;

        case 4:
            if (angleInQuadrant < altFovAngle) {
                x0 = halfWidth - opposite;
                y0 = halfHeight - adjacent;
                x1 = halfWidth + opposite;
                y1 = halfHeight + adjacent;
            } else {
                x0 = halfWidth - adjacent;
                y0 = halfHeight - opposite;
                x1 = halfWidth + adjacent;
                y1 = halfHeight + opposite;
            }
            x0 += width * centerXPercent;
            y0 += height * centerYPercent;
            break;
    }

    return {x0, y0, x1, y1};
};

const ImageCache = {};
const getImgCopy = (imgName, width, height) => {
    var imgSize = width + '_' + height;
    var targetImages = ImageCache[imgSize];
    let copy;
    if (targetImages && targetImages[imgName]) {
        copy = targetImages[imgName];
    }
    return copy;
};

const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
};

export const drawable2Image = (drawable, type, callback) => {
    const canvas = document.createElement('canvas');
    canvas.width = drawable.width;
    canvas.height = drawable.height;

    drawable.ctx = canvas.getContext('2d');
    drawable.build();

    const img = new Image();
    if (typeof callback !== 'undefined') {
        img.onload = callback;
    }
    img.src = canvas.toDataURL(type);
    return img;
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
    this.margin = {top: 0, left: 0, bottom: 0, right: 0};
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
        /*if(typeof imgInfo.angle !== 'undefined') {
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(imgInfo.angle * (Math.PI / 180));
            ctx.drawImage(imgInfo.image, -canvas.width / 2, -canvas.height / 2);
        }
        else {*/
        ctx.drawImage(imgInfo.image, 0, 0, canvas.width, canvas.height);
        //}
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = imgInfo.cf || imgInfo.colorFilter;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        /*if(typeof imgInfo.angle !== 'undefined') {
            ctx.restore();
        }*/
        return canvas;
    };

    const removeShadow = () => {
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowColor = 'transparent';
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
            let cStroke = false;
            if (typeof item.angle !== 'undefined') {
                this.ctx.save();
                this.ctx.translate(item.x + (item.width / 2), item.y + (item.height / 2));
                this.ctx.rotate(item.angle * (Math.PI / 180)); // degrees to radians
            }

            if (typeof item.color !== 'undefined') {
                this.ctx.fillStyle = item.color;
            } else if (typeof item.gradient !== 'undefined') {
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
                } else if (gradient.type == Gradient.LINEAR_GRADIENT) {
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
                const fontFamily = item.font.family.name || 'Arial';
                const fontStyle = item.font.style ? `${item.font.style} ` : '';
                const fontSize = item.font.size || 12;
                const ascentRatio = item.font.family.ascentRatio || DAR;
                const descentRatio = item.font.family.descentRatio || DDR;
                const shadowBlur = typeof item.shadow !== 'undefined' ? item.shadow.blur : 0;

                // Set the font
                this.ctx.font = `${fontStyle}${fontSize}px ${fontFamily}`;
                this.ctx.textBaseline = 'alphabetic'; // Consistent baseline for any source and on any device.

                const metrics = this.ctx.measureText(item.text);

                // Empirical estimates are used
                // ascent: the distance from the baseline of the text to the highest part of the letters (e.g., the top of a "d").
                // descent: distance from the baseline to the lowest point (e.g., the tail of a "g" or "p").
                const ascent = fontSize * ascentRatio;
                const descent = fontSize * descentRatio;
                // `actualBoundingBoxAscent` and `actualBoundingBoxDescent` do not give exact values.
                //const ascent = metrics.actualBoundingBoxAscent || ascent;
                //const descent = metrics.actualBoundingBoxDescent || descent;
                const halfAscent = ascent / 2;
                let adjustedY = item.y - descent;
                let mY;

                if (typeof item.lineHeight !== 'undefined') adjustedY -= item.lineHeight;

                switch (item.verticalAlign) {
                    case "top":
                        adjustedY -= shadowBlur;
                        mY = adjustedY;
                        adjustedY += ascent;
                        break;
                    case "middle":
                        mY = adjustedY - halfAscent;
                        adjustedY += halfAscent - (descent / 2);
                        break;
                    case "bottom":
                        mY = adjustedY - ascent;
                        break;
                    default:
                        adjustedY -= shadowBlur;
                        mY = adjustedY;
                        adjustedY += ascent;
                }
                this.x = item.x - halfAscent;
                this.y = mY - shadowBlur - halfAscent;
                
                this.ctx.textAlign = item.textAlign;
                this.ctx.fillText(item.text, item.x, adjustedY);

                tWidth = metrics.width + ascent;
                tHeight = ascent + descent + (shadowBlur * 2);
            } else if (item.shape == Shape.LINE) {
                this.ctx.beginPath();
                this.ctx.moveTo(item.from.x, item.from.y);
                this.ctx.lineTo(item.to.x, item.to.y);
            } else if (item.shape == Shape.OVAL) {
                this.ctx.beginPath();
                this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
                this.ctx.closePath();
                this.ctx.fill();
            } else if (item.shape == Shape.RECTANGLE) {
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
                } else {
                    this.ctx.fillRect(rx, ry, rw, rh);

                    if (typeof item.stroke !== 'undefined') {
                        this.ctx.lineWidth = item.stroke.width;
                        this.ctx.strokeStyle = item.stroke.color;
                        this.ctx.strokeRect(rx, ry, rw, rh);
                        cStroke = true;
                    }
                }
            } else if (typeof item.image !== 'undefined') {
                if (item.image == 'image/url') {
                    var imgUrl = item.url;
                    var imgName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
                    var imgCopy = getImgCopy(imgName, item.width, item.height);
                    if (imgCopy) {
                        //console.log('cache');
                        if (typeof imgCopy.w !== 'undefined' && typeof imgCopy.h !== 'undefined') {

                            let posX = item.x;
                            let posY = item.y;

                            if (typeof item.angle !== 'undefined') {
                                posX = -imgCopy.w / 2;
                                posY = -imgCopy.h / 2;
                            }

                            if (typeof item.colorFilter !== 'undefined') {
                                imgCopy.cf = item.colorFilter;
                                this.ctx.drawImage(applyFilter(imgCopy), posX, posY);
                            } else {
                                this.ctx.drawImage(imgCopy.image, posX, posY, imgCopy.w, imgCopy.h);
                            }
                        } else {
                            this.ctx.drawImage(imgCopy.image, item.x, item.y);
                        }
                        if (typeof item.onLoadImg !== 'undefined') item.onLoadImg();
                    } else {
                        //console.log('new');
                        const img = new Image();
                        img.onload = function (n, w, h) {
                            if (typeof item.angle !== 'undefined') {
                                this.ctx.save();
                                this.ctx.translate(item.x + (item.width / 2), item.y + (item.height / 2));
                                this.ctx.rotate(item.angle * (Math.PI / 180)); // degrees to radians
                            }
                            var imgInfo = {w: w, h: h};
                            var imgSize = w + '_' + h;
                            if (typeof w !== 'undefined' && typeof h !== 'undefined') {

                                let posX = item.x;
                                let posY = item.y;

                                if (typeof item.angle !== 'undefined') {
                                    posX = -w / 2;
                                    posY = -h / 2;
                                }

                                if (typeof item.colorFilter !== 'undefined') {
                                    item.image = img;
                                    imgInfo.cf = item.colorFilter;
                                    this.ctx.drawImage(applyFilter(item), posX, posY);
                                } else {
                                    this.ctx.drawImage(img, posX, posY, w, h);
                                }

                                imgInfo.image = img;
                            } else {
                                imgInfo.image = img;
                                this.ctx.drawImage(img, item.x, item.y);
                            }

                            if (typeof item.angle !== 'undefined') {
                                this.ctx.restore();
                            }

                            if (typeof ImageCache[imgSize] === 'undefined') ImageCache[imgSize] = {};
                            ImageCache[imgSize][n] = imgInfo;
                            if (item.onLoadImg) item.onLoadImg();
                        }.bind(this, imgName, item.width, item.height);
                        img.src = item.url;
                        /*const img = await loadImage(item.url);
                        if(typeof item.angle !== 'undefined') {
                            this.ctx.save();
                            this.ctx.translate(item.x + (item.width/2), item.y + (item.height/2));
                            this.ctx.rotate(item.angle * (Math.PI / 180)); // degrees to radians
                        }
                        var imgInfo = { w: item.width, h: item.height };
                        var imgSize = item.width + '_' + item.height;
                        if (typeof item.width !== 'undefined' && typeof item.height !== 'undefined') {

                            let posX = item.x;
                            let posY = item.y;

                            if(typeof item.angle !== 'undefined') {
                                posX = -item.width/2;
                                posY = -item.width/2;
                            }

                            if (typeof item.colorFilter !== 'undefined') {
                                item.image = img;
                                imgInfo.cf = item.colorFilter;
                                this.ctx.drawImage(applyFilter(item), posX, posY);
                            }
                            else {
                                this.ctx.drawImage(img, posX, posY, item.width, item.height);
                            }

                            imgInfo.image = img;
                        }
                        else {
                            imgInfo.image = img;
                            this.ctx.drawImage(img, item.x, item.y);
                        }

                        if(typeof item.angle !== 'undefined') {
                            this.ctx.restore();
                        }

                        if (typeof ImageCache[imgSize] === 'undefined') ImageCache[imgSize] = {};
                        ImageCache[imgSize][imgName] = imgInfo;
                        if (item.onLoadImg) item.onLoadImg();*/
                    }
                } else {
                    if (item.width !== 'undefined' && typeof item.height !== 'undefined') {
                        if (typeof item.angle !== 'undefined') {
                            this.ctx.drawImage(item.data, (-item.width / 2), (-item.height / 2), item.width, item.height);
                        } else {
                            this.ctx.drawImage(item.data, item.x, item.y, item.width, item.height);
                        }
                    } else {
                        this.ctx.drawImage(item.data, item.x, item.y);
                    }
                }
            }

            if (typeof item.stroke !== 'undefined' && !cStroke) {
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

            if (typeof item.angle !== 'undefined') {
                this.ctx.restore();
            }
        }
        this.width = tWidth > this.width ? tWidth : this.width;
        this.height = tHeight > this.height ? tHeight : this.height;
    };

    this.clear = () => {
        this.ctx.clearRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
    };

    const animation = () => {
        const next = this.transform();
        this.clear();
        this.update();
        draw();
        if (!next) this.stop();
    };

    const animationFrame = () => {
        this.clear();
        this.update();
        draw();
        if (this.transform()) window.requestAnimationFrame(() => animationFrame());
    };

    this.stop = () => clearInterval(this.interval);

    this.build = () => {
        if (this.onFirstBuild) {
            this.onFirstBuild();
            delete this.onFirstBuild;
        }

        this.update();
        draw();

        if (this.onPostBuild) {
            this.onPostBuild();
            delete this.onPostBuild;
        }
    };

    this.animate = (msInterval) => {
        if (this.transform) {
            if (msInterval) this.interval = setInterval(animation, msInterval);
            else window.requestAnimationFrame(() => animationFrame());
        } else {
            this.build();
        }
    };
} // End Drawable
