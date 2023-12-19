import { prefixes } from "./prefixes";
import { suggestions } from "./suggestions";


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

    const parseValue = (v) =>
        v.endsWith("px") ? parseInt(v.slice(0, -2), 10) : 0;
    const borderWidth = parseValue(textareaStyles.borderWidth);

    const ro = new ResizeObserver(() => {
        mirroredEle.style.width = `${textarea.clientWidth + 2 * borderWidth}px`;
        mirroredEle.style.height = `${
            textarea.clientHeight + 2 * borderWidth
        }px`;
    });
    ro.observe(textarea);

    textarea.addEventListener("scroll", () => {
        mirroredEle.scrollTop = textarea.scrollTop;
    });

    const findIndexOfCurrentWord = () => {
        // Get current value and cursor position
        const currentValue = textarea.value;
        const cursorPos = textarea.selectionStart;

        // Iterate backwards through characters until we find a space or newline character
        let startIndex = cursorPos - 1;
        while (startIndex >= 0 && !/\s/.test(currentValue[startIndex])) {
            startIndex--;
        }
        return startIndex;
    };

    // Replace current word with selected suggestion, keeping the prefix
    const replaceCurrentWord = (newWord) => {
        const currentValue = textarea.value;
        const cursorPos = textarea.selectionStart;
        const startIndex = findIndexOfCurrentWord();

        // Find the prefix (if any) in the current word
        let prefix = "";
        for (const pref of prefixes) {
            const potentialStartIndex = cursorPos - pref.length;
            if (
                potentialStartIndex >= 0 &&
                currentValue.substring(potentialStartIndex, cursorPos) === pref
            ) {
                prefix = pref;
                break;
            }
        }

        // Replace the word while keeping the prefix
        const newValue =
            currentValue.substring(0, startIndex + 1) +
            prefix +
            newWord +
            currentValue.substring(cursorPos);
        textarea.value = newValue;
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd =
            startIndex + 1 + prefix.length + newWord.length;
    };

    textarea.addEventListener("input", () => {
        const currentValue = textarea.value;
        const cursorPos = textarea.selectionStart;
        const startIndex = findIndexOfCurrentWord();

        // Extract just the current word or part of it
        const currentWord = currentValue.substring(startIndex + 1, cursorPos);
        if (currentWord === "") {
            suggestionsEle.style.display = "none";
            return;
        }

        // Check if the current word starts with any of the prefixes
        let prefixMatched = false;
        prefixes.forEach((prefix) => {
            if (currentWord.startsWith(prefix)) {
                prefixMatched = true;
            }
        });

        let matches = [];
        if (prefixMatched) {
            // If a prefix is matched, decide how to show suggestions.
            // For simplicity, this example shows all suggestions,
            // but you can customize to show specific suggestions based on the prefix.
            matches = suggestions; // or a customized list based on the prefix
        } else {
            // Original logic to filter based on current word
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
                replaceCurrentWord(this.innerText);
                suggestionsEle.style.display = "none";
            });
            suggestionsEle.appendChild(option);
        });
        suggestionsEle.style.display = "block";
    });

    const clamp = (min, value, max) => Math.min(Math.max(min, value), max);

    let currentSuggestionIndex = -1;
    textarea.addEventListener("keydown", (e) => {
        if (
            ![
                "ArrowDown",
                "ArrowUp",
                "Enter",
                "Escape",
                "Tab",
                "ArrowRight",
            ].includes(e.key)
        ) {
            return;
        }

        const suggestions = suggestionsEle.querySelectorAll(
            ".container__suggestion"
        );
        const numSuggestions = suggestions.length;
        if (numSuggestions === 0 || suggestionsEle.style.display === "none") {
            return;
        }
        e.preventDefault();

        switch (e.key) {
            case "ArrowDown":
                suggestions[
                    clamp(0, currentSuggestionIndex, numSuggestions - 1)
                ].classList.remove("container__suggestion--focused");
                currentSuggestionIndex = clamp(
                    0,
                    currentSuggestionIndex + 1,
                    numSuggestions - 1
                );
                suggestions[currentSuggestionIndex].classList.add(
                    "container__suggestion--focused"
                );
                break;
            case "ArrowUp":
                suggestions[
                    clamp(0, currentSuggestionIndex, numSuggestions - 1)
                ].classList.remove("container__suggestion--focused");
                currentSuggestionIndex = clamp(
                    0,
                    currentSuggestionIndex - 1,
                    numSuggestions - 1
                );
                suggestions[currentSuggestionIndex].classList.add(
                    "container__suggestion--focused"
                );
                break;
            case "Enter":
            case "Tab":
            case "ArrowRight":
                if (
                    currentSuggestionIndex >= 0 &&
                    currentSuggestionIndex < numSuggestions
                ) {
                    replaceCurrentWord(
                        suggestions[currentSuggestionIndex].innerText
                    );
                    suggestionsEle.style.display = "none";
                    // If Tab or ArrowRight was pressed, refocus the textarea to continue typing
                    if (e.key !== "Enter") {
                        textarea.focus();
                    }
                }
                break;
            case "Escape":
                suggestionsEle.style.display = "none";
                break;
            default:
                break;
        }
    });
});
