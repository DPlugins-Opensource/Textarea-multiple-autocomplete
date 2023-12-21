# Custom multiple autocomplete

## Updated to get extra features:

1. Autocomplete prefix
2. To trigger autocomplete apply with Enter, Tab, Right Arrow "→"
3. Fuzzy search

## Change triggers

Update prefixes.js

```js
export const prefixes = [" ", "sm:", "md:"];
```

## Change autocomplete aka suggestions

```js
export const suggestions = [
    "white",
    "yellow",
    "blue",
    "red",
    "green",
    "black",
    "brown",
    "azure",
    "ivory",
    "teal",
];
```

## Basic markup

```html
<div class="container" id="container">
    <textarea id="fuzzyarea" class="container__textarea"></textarea>
</div>
```

```js
// index.js

import { initializeFuzzyArea } from './fuzzy-area.js';

// Initialize with default ID (#fuzzyarea)
initializeFuzzyArea();

// OR, to initialize with a custom ID
initializeFuzzyArea({ containerId: 'myCustomContainerId' });
```

## Props
| Property         | Type     | Default      | Description                                                                                      |
|------------------|----------|--------------|--------------------------------------------------------------------------------------------------|
| `containerId`    | string   | 'fuzzyarea__container'  | ID of the container in which textarea exists, which is to be made autocomplete.       |
| `textareaId`     | string   | null         | ID of the textarea, which is to be made autocomplete. If not provided then uses textarea in container. |
| `waitForElement` | boolean  | false        | Should it wait for the element to exist in the DOM, useful for dynamically added textareas. |

## Preview

### Regular on type
<img width="416" alt="preview" src="https://github.com/dplugins-opensource/fuzzy-area/assets/1234350/b5c2ed0a-bf77-42da-bd34-64a467919643">

### Regular on prefix
<img width="487" alt="preview-prefix" src="https://github.com/dplugins-opensource/fuzzy-area/assets/1234350/667c7801-5902-4e79-b971-e229d6e7d5a5">


### Credits:
This is modified solution from this website: 
[website](https://phuoc.ng/collection/mirror-a-text-area/add-autocomplete-to-your-text-area/)
