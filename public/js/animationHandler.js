export const animateElement = async (targetId, animator, type = "remove", delay = 500, callback = null, wait = false) => {
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return wait ? false : undefined;

    // We wrap the logic in a Promise so we can "await" the end of the CSS animation
    const animationPromise = new Promise((resolve) => {
        
        const onAnimationComplete = () => {
            targetEl.removeEventListener('animationend', onAnimationComplete);
            targetEl.removeEventListener('transitionend', onAnimationComplete);

            if (callback === "delete") {
                targetEl.remove();
            } else if (typeof callback === "function") {
                callback();
            }
            
            // Resolve the promise with true when finished
            resolve(true);
        };

        const performAction = () => {
            // Even if no callback is passed, we listen for resolve if 'wait' is true
            if (callback || wait) {
                targetEl.addEventListener('animationend', onAnimationComplete, { once: true });
                targetEl.addEventListener('transitionend', onAnimationComplete, { once: true });
            } else {
                // If we aren't waiting for anything, resolve immediately
                resolve(true);
            }

            if (type === "add") {
                targetEl.classList.add(animator);
            } else if (type === "remove") {
                targetEl.classList.remove(animator);
            }
        };

        setTimeout(performAction, delay);
    });

    // If wait is true, the function pauses here until resolve(true) is called
    if (wait) {
        return await animationPromise;
    }

    // If wait is false, the animation starts in the background and we return immediately
    return;
}