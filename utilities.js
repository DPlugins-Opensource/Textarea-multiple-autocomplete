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
    const startIndex = findIndexOfCurrentWord(textarea);
    let endIndex = cursorPos;

    // Find the end of the word
    while (
        endIndex < currentValue.length &&
        !/\s/.test(currentValue[endIndex])
    ) {
        endIndex++;
    }

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

    // Replace the entire word and add a space after the new word
    const newValue =
        currentValue.substring(0, startIndex + 1) +
        prefix +
        newWord +
        " " +
        currentValue.substring(endIndex);
    textarea.value = newValue;

    // Set the cursor position right after the newly inserted word and space
    const newCursorPos = startIndex + 1 + prefix.length + newWord.length + 1;
    textarea.selectionStart = textarea.selectionEnd = newCursorPos;
    textarea.focus();
};
