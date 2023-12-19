import { prefixes } from "./prefixes";
import { suggestions } from "./suggestions";
import { 
    parseValue, 
    clamp, 
    findIndexOfCurrentWord, 
    replaceCurrentWord 
} from './utilities.js';


document.addEventListener("DOMContentLoaded", () => {
    const containerEle = document.getElementById("container");
    const textarea = document.getElementById("textarea");

    const mirroredEle = document.createElement("div");
    mirroredEle.textContent = textarea.value;
    mirroredEle.classList.add("container__mirror");
    containerEle.prepend(mirroredEle);

    const suggestionsEle = document.createElement("div");
    suggestionsEle.classList.add("container__suggestions");
    containerEle.appendChild(suggestionsEle);

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

    const borderWidth = parseValue(textareaStyles.borderWidth);

    const ro = new ResizeObserver(() => {
        mirroredEle.style.width = `${textarea.clientWidth + 2 * borderWidth}px`;
        mirroredEle.style.height = `${textarea.clientHeight + 2 * borderWidth}px`;
    });
    ro.observe(textarea);

    textarea.addEventListener("scroll", () => {
        mirroredEle.scrollTop = textarea.scrollTop;
    });

    textarea.addEventListener("input", () => {
        const currentValue = textarea.value;
        const cursorPos = textarea.selectionStart;
        const startIndex = findIndexOfCurrentWord(textarea);

        const currentWord = currentValue.substring(startIndex + 1, cursorPos);
        if (currentWord === "") {
            suggestionsEle.style.display = "none";
            return;
        }

        let prefixMatched = false;
        prefixes.forEach((prefix) => {
            if (currentWord.startsWith(prefix)) {
                prefixMatched = true;
            }
        });

        let matches = [];
        if (prefixMatched) {
            matches = suggestions;
        } else {
            matches = suggestions.filter(
                (suggestion) => suggestion.indexOf(currentWord) > -1
            );
        }

        if (matches.length === 0) {
            suggestionsEle.style.display = "none";
            return;
        }

        const textBeforeCursor = currentValue.substring(0, cursorPos);
        const textAfterCursor = currentValue.substring(cursorPos);

        const pre = document.createTextNode(textBeforeCursor);
        const post = document.createTextNode(textAfterCursor);
        const caretEle = document.createElement("span");
        caretEle.innerHTML = "&nbsp;";

        mirroredEle.innerHTML = "";
        mirroredEle.append(pre, caretEle, post);

        const rect = caretEle.getBoundingClientRect();
        suggestionsEle.style.top = `${rect.top + rect.height}px`;
        suggestionsEle.style.left = `${rect.left}px`;

        suggestionsEle.innerHTML = "";
        matches.forEach((match) => {
            const option = document.createElement("div");
            option.innerText = match;
            option.classList.add("container__suggestion");
            option.addEventListener("click", function () {
                replaceCurrentWord(textarea, this.innerText, prefixes);
                suggestionsEle.style.display = "none";
            });
            suggestionsEle.appendChild(option);
        });
        suggestionsEle.style.display = "block";
    });

    let currentSuggestionIndex = -1;
    textarea.addEventListener("keydown", (e) => {
        if (!["ArrowDown", "ArrowUp", "Enter", "Escape", "Tab", "ArrowRight"].includes(e.key)) {
            return;
        }

        const suggestionsElements = suggestionsEle.querySelectorAll(".container__suggestion");
        const numSuggestions = suggestionsElements.length;
        if (numSuggestions === 0 || suggestionsEle.style.display === "none") {
            return;
        }
        e.preventDefault();

        switch (e.key) {
            case "ArrowDown":
                suggestionsElements[clamp(0, currentSuggestionIndex, numSuggestions - 1)].classList.remove("container__suggestion--focused");
                currentSuggestionIndex = clamp(0, currentSuggestionIndex + 1, numSuggestions - 1);
                suggestionsElements[currentSuggestionIndex].classList.add("container__suggestion--focused");
                break;
            case "ArrowUp":
                suggestionsElements[clamp(0, currentSuggestionIndex, numSuggestions - 1)].classList.remove("container__suggestion--focused");
                currentSuggestionIndex = clamp(0, currentSuggestionIndex - 1, numSuggestions - 1);
                suggestionsElements[currentSuggestionIndex].classList.add("container__suggestion--focused");
                break;
            case "Enter":
            case "Tab":
            case "ArrowRight":
                if (currentSuggestionIndex >= 0 && currentSuggestionIndex < numSuggestions) {
                    replaceCurrentWord(textarea, suggestionsElements[currentSuggestionIndex].innerText, prefixes);
                    suggestionsEle.style.display = "none";
                    if (e.key !== "Enter") {
                        textarea.focus();
                    }
                }
                break;
            case "Escape":
                suggestionsEle.style.display = "none";
                break;
        }
    });
});
