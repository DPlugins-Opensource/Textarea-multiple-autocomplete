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

export const replaceCurrentWord = (textarea, newWord, prefixes) => {
    const currentValue = textarea.value;
    const cursorPos = textarea.selectionStart;
    let startIndex = findIndexOfCurrentWord(textarea);
    let endIndex = cursorPos;

    // Find the end of the word
    while (
        endIndex < currentValue.length &&
        !/\s/.test(currentValue[endIndex])
    ) {
        endIndex++;
    }

    // Check if the current word has a prefix
    let prefixFound = "";
    for (const prefix of prefixes) {
        if (
            currentValue.substring(startIndex + 1, cursorPos).startsWith(prefix)
        ) {
            prefixFound = prefix;
            break;
        }
    }

    // Replace the entire word while preserving the prefix
    const newValue =
        currentValue.substring(0, startIndex + 1) +
        prefixFound +
        newWord +
        " " +
        currentValue.substring(endIndex);
    textarea.value = newValue;

    // Set the cursor position right after the newly inserted word and space
    const newCursorPos =
        startIndex + 1 + prefixFound.length + newWord.length + 1;
    textarea.selectionStart = textarea.selectionEnd = newCursorPos;
    textarea.focus();
};
