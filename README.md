
# Drawable.js Demo

This project is a demo of the `Drawable.js` library, a JavaScript library to create dynamic graphics on an HTML `<canvas>`, inspired by Android's `Drawable` class.

## Features

- Draw basic shapes: rectangles, circles, lines, images, and text.
- Support for solid colors and gradients (linear and radial).
- Option to set borders, rounded corners, and shadows.
- Extendable structure: each shape can include extra content.
- Inspired by Android’s `Drawable` and `Canvas` system.

## Included Files

- `Drawable.js`: The main implementation of the drawing system.
- `index.html`: A working example that draws a rectangle and a circle using gradients.

## How to Use

1. Clone or download this repository.
2. Open the `index.html` file in your browser.
3. You will see a canvas with a rectangle (linear gradient) and a circle (radial gradient).

## Basic Structure

Each component is built using a configuration object. Example:

```js
new Rectangle({
  x: 50,
  y: 50,
  width: 200,
  height: 100,
  ccRadii: 10,
  background: {
    gradient: {
      type: LB_UTILS.Gradient.LINEAR_GRADIENT,
      angle: 0,
      startColor: "#FF5733",
      endColor: "#FFC300"
    }
  }
});
```

## Inspiration

This system is inspired by the Android `Drawable` class. It's made to help developers who are familiar with Android work easily on drawing and graphic design projects in the web environment.

## Author

Developed by `jaianper`.

## License

This project is free to use for personal and educational purposes. For commercial use, please contact the author.
