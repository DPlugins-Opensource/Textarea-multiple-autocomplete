// utilities.js
export const parseValue = (v) =>
    v.endsWith("px") ? parseInt(v.slice(0, -2), 10) : 0;

export const clamp = (min, value, max) => Math.min(Math.max(min, value), max);

export const findIndexOfCurrentWord = (textarea) => {
    const currentValue = textarea.value;
    const cursorPos = textarea.selectionStart;
    let startIndex = cursorPos - 1;
    while (startIndex >= 0 && !/\s/.test(currentValue[startIndex])) {
        startIndex--;
    }
    return startIndex;
};

export const replaceCurrentWord = (textarea, newWord, prefixes = []) => {
    const currentValue = textarea.value;
    const cursorPos = textarea.selectionStart;
    let startIndex = findIndexOfCurrentWord(textarea);
    let endIndex = cursorPos;

    while (
        endIndex < currentValue.length &&
        !/\s/.test(currentValue[endIndex])
    ) {
        endIndex++;
    }

    let prefixFound = "";
    for (const prefix of prefixes) {
        if (
            currentValue.substring(startIndex + 1, cursorPos).startsWith(prefix)
        ) {
            prefixFound = prefix;
            break;
        }
    }

    // Check if the newWord is a prefix and adjust accordingly
    let newValue;
    if (prefixes.includes(newWord)) {
        newValue =
            currentValue.substring(0, startIndex) +
            newWord +
            currentValue.substring(endIndex);
    } else {
        newValue =
            currentValue.substring(0, startIndex + 1) +
            prefixFound +
            newWord +
            " " +
            currentValue.substring(endIndex);
    }
    textarea.value = newValue;

    let newCursorPos = startIndex + 1 + prefixFound.length + newWord.length;
    if (!prefixes.includes(newWord)) {
        newCursorPos += 1; // Adjust for the added space
    }
    textarea.selectionStart = textarea.selectionEnd = newCursorPos;
    textarea.focus();
};
