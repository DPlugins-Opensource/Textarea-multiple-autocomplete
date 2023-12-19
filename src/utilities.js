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
