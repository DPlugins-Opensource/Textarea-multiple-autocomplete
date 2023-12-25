// main.js
import "./style.scss"; // Import your SCSS file here
import { stylesContent } from "./partials/styles.js";

import { prefixes } from "./prefixes";
import { suggestions } from "./partials/suggestions.js";
import { parseValue, clamp, findIndexOfCurrentWord, replaceCurrentWord,} from "./partials/utilities.js";

// eventListenes
import { attachScrollHandler } from "./partials/scrollHandler.js";
import { attachInputHandler } from "./partials/inputHandler.js";
import { attachKeydownHandler } from "./partials/keydownHandler.js";

export function initializeFuzzyArea({
    containerId = "fuzzyarea",
    textareaId = null,
    waitForElement = false,
    maxSuggestions = 10,
    resize = false,
} = {}) {
    const fuzzyareaHandler = (containerEle, textarea) => {
        const _prefixes = window?.prefixes?.length ? window.prefixes : prefixes;
        const _suggestions = window?.suggestions?.length
            ? window.suggestions
            : suggestions;

        const styleElement = document.createElement("style");
        styleElement.textContent = stylesContent;
        document.head.appendChild(styleElement);

        containerEle.style.position = "relative";

        const mirroredEle = document.createElement("div");
        mirroredEle.textContent = textarea.value;
        mirroredEle.classList.add("fuzzyarea__mirror");
        containerEle.prepend(mirroredEle);

        const suggestionsEle = document.createElement("div");
        suggestionsEle.classList.add("fuzzyarea__suggestions");

        textarea.insertAdjacentElement("afterend", suggestionsEle);

        const textareaStyles = window.getComputedStyle(textarea);
        [
            "border",
            "boxSizing",
            "fontFamily",
            "fontSize",
            "fontWeight",
            "letterSpacing",
            "lineHeight",
            "padding",
            "textDecoration",
            "textIndent",
            "textTransform",
            "whiteSpace",
            "wordSpacing",
            "wordWrap",
        ].forEach((property) => {
            mirroredEle.style[property] = textareaStyles[property];
        });
        mirroredEle.style.borderColor = "transparent";
        mirroredEle.style.display = "none";

        if (resize) {
            const borderWidth = parseValue(textareaStyles.borderWidth);

            const ro = new ResizeObserver(() => {
                mirroredEle.style.width = `${
                    textarea.clientWidth + 2 * borderWidth
                }px`;
                mirroredEle.style.height = `${
                    textarea.clientHeight + 2 * borderWidth
                }px`;
            });
            ro.observe(textarea);

            // Function to adjust the height of textarea
            function adjustHeight(textArea) {
                // Set the height to 'auto' to get the correct scroll height
                textArea.style.height = "auto";
                // Set the height to the scroll height
                textArea.style.height = textArea.scrollHeight + "px";
            }

            // Get the textarea element by its ID or class
            const textArea = document.getElementById(containerId);

            // Add an event listener for input event
            textArea.addEventListener("input", function () {
                adjustHeight(this);
            });

            // Initial adjustment in case there's already text in the textarea
            adjustHeight(textArea);
        }

        attachScrollHandler(textarea, mirroredEle);

        attachInputHandler(
            textarea,
            mirroredEle,
            suggestionsEle,
            _prefixes,
            _suggestions,
            maxSuggestions,
            replaceCurrentWord,
            findIndexOfCurrentWord
        );

        // Do we need this one ===> // let currentSuggestionIndex = -1;

        // Keyboard shortcuts
        attachKeydownHandler(
            textarea,
            suggestionsEle,
            _prefixes,
            replaceCurrentWord,
            clamp
        );
    };

    const __getBySelector = (selector) => {
        const el = document.querySelector(selector);
        if (!el) {
            console.error(`Element '${selector}' not found.`);
            return;
        }
        return el;
    };

    const __init = () => {
        const _containerSelector = `#${containerId || "fuzzyarea"}`;
        const _textareaSelector = textareaId ? `#${textareaId}` : "textarea";

        if (waitForElement) {
            const _wait = setInterval(() => {
                const containerEle = __getBySelector(_containerSelector);
                if (containerEle) {
                    clearInterval(_wait);

                    const _waitForTextarea = setInterval(() => {
                        const textareaEle = __getBySelector(_textareaSelector);
                        if (textareaEle) {
                            clearInterval(_waitForTextarea);
                            fuzzyareaHandler(containerEle, textareaEle);
                        }
                    }, 100);
                }
            }, 100);
        } else {
            fuzzyareaHandler(
                __getBySelector(_containerSelector),
                __getBySelector(_textareaSelector)
            );
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", __init);
    } else {
        __init();
    }
}
