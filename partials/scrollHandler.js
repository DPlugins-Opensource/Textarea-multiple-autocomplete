// scrollHandler.js

export function attachScrollHandler(textarea, mirroredEle) {
    textarea.addEventListener("scroll", () => {
        mirroredEle.scrollTop = textarea.scrollTop;
    });
}
