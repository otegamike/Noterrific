export function isOverflowing(element) {
    return (
        { y: element.scrollHeight > element.clientHeight,  // Vertical overflow
          x: element.scrollWidth > element.clientWidth     // Horizontal overflow
        }
    );
}