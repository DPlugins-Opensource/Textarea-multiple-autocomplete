// inputHandler.js

export function attachInputHandler(
    textarea,
    mirroredEle,
    suggestionsEle,
    _prefixes,
    _suggestions,
    maxSuggestions,
    replaceCurrentWord,
    findIndexOfCurrentWord
) {
    textarea.addEventListener("input", () => {
        const currentValue = textarea.value;
        const cursorPos = textarea.selectionStart;
        const startIndex = findIndexOfCurrentWord(textarea);

        const currentWord = currentValue.substring(startIndex + 1, cursorPos);
        if (currentWord === "") {
            suggestionsEle.style.display = "none";
            return;
        }

        let matches = [];
        if (currentWord.startsWith("@")) {
            matches = _prefixes.map((prefix) => prefix);
        } else {
            const _parts = currentWord.split(':');
            const _currentWord = _parts?.length > 1 ? _parts[1] : _parts[0];
            matches = _suggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(_currentWord.toLowerCase())
            );
        }

        matches = matches.slice(0, maxSuggestions);

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

        suggestionsEle.innerHTML = "";
        matches.forEach((match) => {
            const option = document.createElement("div");
            option.classList.add("fuzzyarea__suggestion");
            option.textContent = match;

            option.addEventListener("click", function () {
                replaceCurrentWord(textarea, match, _prefixes);
                suggestionsEle.style.display = "none";
            });

            suggestionsEle.appendChild(option);
        });
        suggestionsEle.style.display = "block";
    });
}
