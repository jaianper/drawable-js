/*
 * DrawableJS
 * Copyright (c) 2025 jaianper
 *
 * This file is part of DrawableJS.
 * Licensed under the MIT License.
 * You may obtain a copy of the License at https://opensource.org/licenses/MIT
 */

import { Font, getPointsFromAngle, Drawable, Shape, Gradient, Alignment, Orientation, FontLoader, drawable2Image, LinearLayout } from '../src/Drawable';

/**
 * Font utilities
 */

describe('Font utilities', () => {
    test('Font.values() returns array of font objects', () => {
        const values = Font.values();
        expect(Array.isArray(values)).toBe(true);
        expect(values.every(f => typeof f.name === 'string')).toBe(true);
        expect(values.length).toBeGreaterThan(0);
    });

    test('Font.getFonts() returns font names as strings', () => {
        const fonts = Font.getFonts();
        expect(Array.isArray(fonts)).toBe(true);
        expect(fonts).toContain('Arial');
        expect(typeof fonts[0]).toBe('string');
    });

    test('Font.getKeyByName() returns correct key', () => {
        const key = Font.getKeyByName('Arial');
        expect(key).toBe('ARIAL');
    });

    test('Font.getKeyByName() returns undefined for non-existent font', () => {
        const key = Font.getKeyByName('NonExistentFont');
        expect(key).toBeUndefined();
    });

    test('Font.keys() returns array of font keys', () => {
        const keys = Font.keys();
        expect(Array.isArray(keys)).toBe(true);
        expect(keys).toContain('ARIAL');
        expect(keys).toContain('VERDANA');
    });
});

/**
 * getPointsFromAngle
 */

describe('getPointsFromAngle', () => {
    test('should return coordinates within expected range', () => {
        const result = getPointsFromAngle(45, { x: '50%', y: '50%' }, 100, 100);
        expect(result).toHaveProperty('x0');
        expect(result).toHaveProperty('y0');
        expect(result).toHaveProperty('x1');
        expect(result).toHaveProperty('y1');
        expect(typeof result.x0).toBe('number');
        expect(typeof result.y0).toBe('number');
        expect(typeof result.x1).toBe('number');
        expect(typeof result.y1).toBe('number');
    });

    test('should handle different angles', () => {
        const angles = [0, 90, 180, 270];
        angles.forEach(angle => {
            const result = getPointsFromAngle(angle, { x: '50%', y: '50%' }, 100, 100);
            expect(result).toHaveProperty('x0');
            expect(result).toHaveProperty('y0');
            expect(result).toHaveProperty('x1');
            expect(result).toHaveProperty('y1');
        });
    });

    test('should handle different center positions', () => {
        const centers = [
            { x: '0%', y: '0%' },
            { x: '25%', y: '25%' },
            { x: '100%', y: '100%' }
        ];
        centers.forEach(center => {
            const result = getPointsFromAngle(45, center, 100, 100);
            expect(result).toHaveProperty('x0');
            expect(result).toHaveProperty('y0');
            expect(result).toHaveProperty('x1');
            expect(result).toHaveProperty('y1');
        });
    });

    test('should handle angle normalization', () => {
        const result1 = getPointsFromAngle(45, { x: '50%', y: '50%' }, 100, 100);
        const result2 = getPointsFromAngle(405, { x: '50%', y: '50%' }, 100, 100);
        expect(result1.x0).toBeCloseTo(result2.x0, 5);
        expect(result1.y0).toBeCloseTo(result2.y0, 5);
    });
});

/**
 * Constants
 */

describe('Constants', () => {
    test('Shape constants are defined', () => {
        expect(Shape.LINE).toBe('LINE');
        expect(Shape.OVAL).toBe('OVAL');
        expect(Shape.RECTANGLE).toBe('RECT');
    });

    test('Gradient constants are defined', () => {
        expect(Gradient.RADIAL_GRADIENT).toBe('R_G');
        expect(Gradient.LINEAR_GRADIENT).toBe('L_G');
    });

    test('Alignment constants are defined', () => {
        expect(Alignment.TOP).toBe('A_T');
        expect(Alignment.BOTTOM).toBe('A_B');
        expect(Alignment.LEFT).toBe('A_L');
        expect(Alignment.RIGHT).toBe('A_R');
        expect(Alignment.CENTER).toBe('A_C');
    });

    test('Orientation constants are defined', () => {
        expect(Orientation.VERTICAL).toBe('O_V');
        expect(Orientation.HORIZONTAL).toBe('O_H');
    });
});

/**
 * Drawable class
 */

describe('Drawable class', () => {
    let canvas, ctx, drawable, d;

    beforeEach(() => {
        canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 100;
        ctx = canvas.getContext('2d');
    });

    test('constructor initializes properties correctly', () => {
        d = new Drawable(100, 200, 10, 20);
        d.ctx = ctx;
        d.update = jest.fn(); // mock update
        d.draw = jest.fn();   // mock draw
        d.update = () => {
            d.items = [{
                text: 'ABC',
                font: {
                    family: Font.VERDANA,
                    size: 15,
                    style: 'bold'
                },
                color: '#424242',
                textAlign: 'center',
                verticalAlign: 'bottom',
                x: 10,
                y: 20
            }];
        };

        expect(d.width).toBe(100);
        expect(d.height).toBe(200);
        expect(d.x).toBe(10);
        expect(d.y).toBe(20);
        expect(d.margin).toEqual({top: 0, left: 0, bottom: 0, right: 0});
    });

    test('constructor with default values', () => {
        drawable = new Drawable();
        drawable.ctx = ctx;
        drawable.update = jest.fn(); // mock update
        drawable.draw = jest.fn();   // mock draw
    
        expect(drawable.width).toBe(0);
        expect(drawable.height).toBe(0);
        expect(drawable.x).toBe(0);
        expect(drawable.y).toBe(0);
    });

    /*test('build() should call update and draw', () => {
        d.items = [{}];
        d.build();
        expect(d.update).toHaveBeenCalled();
        expect(d.draw).toHaveBeenCalled();
    });*/

    test('build() should call onFirstBuild callback', () => {
        const callback = jest.fn();
        d.items = [{}];
        d.onFirstBuild = callback;
        d.build();
        expect(callback).toHaveBeenCalled();
        expect(d.onFirstBuild).toBeUndefined(); // Should be deleted after first call
    });

    test('build() should call onPostBuild callback', () => {
        const callback = jest.fn();
        d.items = [{}];
        d.onPostBuild = callback;
        d.build();
        expect(callback).toHaveBeenCalled();
        expect(d.onPostBuild).toBeUndefined(); // Should be deleted after first call
    });

    /*test('clear() should call clearRect on context', () => {
        d.width = 100;
        d.height = 50;
        d.x = 10;
        d.y = 20;
        d.clear();
        expect(ctx.clearRect).toHaveBeenCalledWith(8, 18, 104, 54);
    });

    test('clear() should call clearRect on context', () => {
        ctx.clearRect = jest.fn();
        d.clear();
        expect(ctx.clearRect).toHaveBeenCalled();
    });*/

    test('stop() should clear interval', () => {
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
        drawable.interval = 123;
        drawable.stop();
        expect(clearIntervalSpy).toHaveBeenCalledWith(123);
    });

    test('animate() with interval should set interval', () => {
        const setIntervalSpy = jest.spyOn(global, 'setInterval');
        drawable.transform = jest.fn().mockReturnValue(true);
        drawable.animate(100);
        expect(setIntervalSpy).toHaveBeenCalled();
    });

    test('animate() without interval should use requestAnimationFrame', () => {
        const requestAnimationFrameSpy = jest.spyOn(global, 'requestAnimationFrame');
        drawable.transform = jest.fn().mockReturnValue(true);
        drawable.animate();
        expect(requestAnimationFrameSpy).toHaveBeenCalled();
    });

    /*test('animate() without transform should call build', () => {
        drawable.animate();
        expect(drawable.update).toHaveBeenCalled();
        expect(drawable.draw).toHaveBeenCalled();
    });

    test('animate stops if transform returns false', () => {
        const spy = jest.spyOn(global, 'requestAnimationFrame');
        drawable.transform = jest.fn().mockReturnValue(false);
        drawable.animate();
        expect(spy).not.toHaveBeenCalledTimes(2);
    });

    test('animate() should call build if transform returns true', () => {
        const buildSpy = jest.spyOn(drawable, 'build');
        drawable.transform = jest.fn().mockReturnValue(true);
        drawable.animate();
        expect(buildSpy).toHaveBeenCalled();
    });

    test('getFont returns default font', () => {
        const font = drawable.getFont();
        expect(typeof font).toBe('object');
        expect(font.name).toBeDefined();
        expect(font.name).toBe('Arial');
    });*/
});

/**
 * drawable2Image function
 */

describe('drawable2Image', () => {
    test('should create image from drawable', () => {
        const drawable = new Drawable(100, 100);
        drawable.ctx = document.createElement('canvas').getContext('2d');
        drawable.build = jest.fn();
    
        const img = drawable2Image(drawable, 'image/png');
    
        expect(img.tagName).toBe('IMG');
        expect(drawable.build).toHaveBeenCalled();
    });

    test('should call callback when provided', () => {
        const drawable = new Drawable(100, 100);
        drawable.ctx = document.createElement('canvas').getContext('2d');
        drawable.build = jest.fn();
        const callback = jest.fn();
    
        const img = drawable2Image(drawable, 'image/png', callback);
    
        expect(img.onload).toBe(callback);
    });
});

/**
 * LinearLayout class
 */

describe('LinearLayout class', () => {
    let layout;

    beforeEach(() => {
        layout = new LinearLayout(10, 20);
    });

    test('constructor initializes properties correctly', () => {
        expect(layout.x).toBe(10);
        expect(layout.y).toBe(20);
        expect(layout.margin).toEqual({top: 0, left: 0, bottom: 0, right: 0});
        expect(layout.views).toEqual([]);
        expect(layout.verticalAlignment).toBe(Alignment.BOTTOM);
        expect(layout.horizontalAlignment).toBe(Alignment.CENTER);
        expect(layout.orientation).toBe(Orientation.HORIZONTAL);
    });

    test('addView adds view to views array', () => {
        const view = { width: 100, height: 50 };
        layout.addView(view);
        expect(layout.views).toContain(view);
    });

    test('onLayout calculates dimensions for horizontal orientation', () => {
        const view1 = { width: 100, height: 50, margin: { top: 0, left: 0, bottom: 0, right: 0 } };
        const view2 = { width: 80, height: 60, margin: { top: 0, left: 0, bottom: 0, right: 0 } };
    
        layout.addView(view1);
        layout.addView(view2);
        layout.onLayout();
    
        expect(layout.width).toBe(180); // 100 + 80
        expect(layout.height).toBe(60); // max(50, 60)
    });

    test('onLayout calculates dimensions for vertical orientation', () => {
        layout.orientation = Orientation.VERTICAL;
        const view1 = { width: 100, height: 50, margin: { top: 0, left: 0, bottom: 0, right: 0 } };
        const view2 = { width: 80, height: 60, margin: { top: 0, left: 0, bottom: 0, right: 0 } };
    
        layout.addView(view1);
        layout.addView(view2);
        layout.onLayout();
    
        expect(layout.width).toBe(100); // max(100, 80)
        expect(layout.height).toBe(110); // 50 + 60
    });

    test('build calls onLayout', () => {
        const onLayoutSpy = jest.spyOn(layout, 'onLayout');
        layout.build();
        expect(onLayoutSpy).toHaveBeenCalled();
    });

    test('build calls onPostBuild callback', () => {
        const callback = jest.fn();
        layout.onPostBuild = callback;
        layout.build();
        expect(callback).toHaveBeenCalled();
        expect(layout.onPostBuild).toBeUndefined();
    });
});

/**
 * FontLoader
 */

describe('FontLoader', () => {
    test('load function exists', () => {
        expect(typeof FontLoader.load).toBe('function');
    });

    /*test('load function accepts info object', () => {
        const info = {
            families: [Font.ARIAL],
            active: jest.fn()
        };
    
        // Mock canvas and context
        const mockCanvas = {
            width: 150,
            height: 25,
            getContext: jest.fn().mockReturnValue({})
        };
        document.createElement = jest.fn().mockReturnValue(mockCanvas);
    
        FontLoader.load(info);
    
        expect(document.createElement).toHaveBeenCalledWith('canvas');
    });*/
});