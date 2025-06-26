# Drawable.js Demos

This folder contains two demos to help you test and explore how the library works in real web pages. You can choose between a modern approach using ES modules, or a classic one using a traditional script tag.

## esm/drawable-demo.html
A demo using **ES Modules** (`<script type="module">`).

### How to use:
1. Run a local server in the root of the project:
   ```bash
   npm run dev
   ```
   > This uses `live-server` to automatically serve the project.

2. Open in your browser:
   ```
   http://localhost:8080/demo/esm/drawable-demo.html
   ```

3. The script uses:
   ```js
   import { Drawable, Shape, Gradient } from '../../dist/drawable.js';
   ```
   So make sure `dist/drawable.js` is built before testing:
   ```bash
   npm run build
   ```

## umd/drawable-demo.html
A demo using a **classic script tag** and the UMD build (`drawable.umd.js`).

### How to use:
1. Also requires a local server (same as above).
2. Open:
   ```
   http://localhost:8080/demo/umd/drawable-demo.html
   ```

3. The file loads:
   ```html
   <script src="../../dist/drawable.umd.js"></script>
   ```
   And uses the global variable `DrawableJS`:
   ```js
   const d = new DrawableJS.Drawable(...);
   ```

## Requirements
- Make sure to run `npm install` first to install all dependencies.
- Use `npm run build` to generate both ESM and UMD versions.

## Feel free to modify the demos
You can add new shapes, animations, or even font loaders to see how the library behaves in real use cases.

Enjoy!
