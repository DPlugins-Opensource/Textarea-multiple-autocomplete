// keydownHandler.js

export function attachKeydownHandler(
    textarea,
    suggestionsEle,
    _prefixes,
    replaceCurrentWord,
    clamp
) {
    let currentSuggestionIndex = -1;

    textarea.addEventListener("keydown", (e) => {
        if (
            !["ArrowDown", "ArrowUp", "Enter", "Escape", "Tab"].includes(e.key)
        ) {
            return;
        }

        const suggestionsElements = suggestionsEle.querySelectorAll(
            ".fuzzyarea__suggestion"
        );
        const numSuggestions = suggestionsElements.length;
        if (numSuggestions === 0 || suggestionsEle.style.display === "none") {
            return;
        }
        e.preventDefault();

        switch (e.key) {
            case "ArrowDown":
                updateSuggestionFocus(
                    suggestionsElements,
                    currentSuggestionIndex,
                    numSuggestions,
                    true
                );
                break;
            case "ArrowUp":
                updateSuggestionFocus(
                    suggestionsElements,
                    currentSuggestionIndex,
                    numSuggestions,
                    false
                );
                break;
            case "Enter":
            case "Tab":
                if (
                    currentSuggestionIndex >= 0 &&
                    currentSuggestionIndex < numSuggestions
                ) {
                    replaceCurrentWord(
                        textarea,
                        suggestionsElements[currentSuggestionIndex].innerText,
                        _prefixes
                    );
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

    function updateSuggestionFocus(elements, index, numElements, isDown) {
        elements[clamp(0, index, numElements - 1)].classList.remove(
            "fuzzyarea__suggestion--focused"
        );
        currentSuggestionIndex = clamp(
            0,
            isDown ? index + 1 : index - 1,
            numElements - 1
        );
        elements[currentSuggestionIndex].classList.add(
            "fuzzyarea__suggestion--focused"
        );
    }
}
