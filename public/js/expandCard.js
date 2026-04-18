// Expand / Collapse card to fullscreen using a cloned overlay for smooth animation
import truncateString from "./truncateString.js";
import { isOverflowing } from "./utils.js";
import { geticon } from "./svg.js";

const scrollListeners = new Map(); // Store listeners for cleanup


export async function toggleExpand(i, textContent) {
    const listEl = document.getElementById(`list${i}`);
    if (!listEl) return;

    // If already expanded (we'll mark clones with data-expanded)
    const existing = document.querySelector(`.note-expanding-clone[data-id="${i}"]`);
    if (existing) {
        console.log("close expand");
        collapseNote(`expandedList${i}`);
        return;
    }

    const rect = listEl.getBoundingClientRect();

    // Clone node so original stays in-place (no layout shifts)
    const clone = listEl.cloneNode(true);
    clone.id = `expandedList${i}`;
    clone.classList.add('note-expanding-clone');
    clone.classList.remove('list-boundary');
    clone.setAttribute('data-id', String(i));
    const titleText = clone.querySelector('.titleCon > .bold');
    const contentText = clone.querySelector('.contentCon > .content');
    const editbtn = clone.querySelector(`#edit${i}`);
    const delbtn = clone.querySelector(`#del${i}`);
    const copybtn = clone.querySelector(`#copy${i}`);
    const expandbtn = clone.querySelector(`#expand${i}`);
    if(!titleText || !contentText || !editbtn || !delbtn || !copybtn || !expandbtn) return;

    if (contentText && typeof textContent === "string") {
        contentText.innerHTML = textContent.replaceAll("\n","<br/>");
    }
    titleText.id = `titX${i}`;
    contentText.id = `contX${i}`;
    editbtn.id = `editX${i}`;
    delbtn.id = `delX${i}`;
    copybtn.id = `copyX${i}`;
    expandbtn.id = `expandX${i}`;

    // initial fixed positioning to match original card
    
    clone.style.position = 'fixed';
    clone.style.top = rect.top + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.margin = '0';
    clone.style.zIndex = 4;
    clone.style.boxSizing = 'border-box';
    clone.style.transition = 'all 360ms cubic-bezier(.2,.8,.2,1)';
    clone.style.borderRadius = window.getComputedStyle(listEl).borderRadius || '10px';

    // Add a close control
    // const closeBtn = document.createElement('button');
    // closeBtn.className = 'clone-close';
    // closeBtn.innerText = '×';
    // clone.appendChild(closeBtn);

    const blur = document.createElement('div');
    blur.className = 'expanded_blur';
    blur.id = `expanded_blur${i}`;
    document.body.appendChild(blur);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        blur.style.opacity = '1';
    });

    document.body.appendChild(clone);

    // hide original content visually (but keep layout)
    listEl.style.visibility = 'hidden';

    // force reflow then expand to fullscreen
    requestAnimationFrame(() => {
        clone.style.top = '90px';
        clone.style.left = '5%';
        // clone.style.transform = 'translateX(-50%)';
        clone.style.width = '90vw';
        clone.style.height = '85vh';
        clone.style.borderRadius = '0';
        clone.classList.add('expanded');
    });

    // Close handlers
    const onClose = (ev) => {
        ev.stopPropagation();
        collapseNote(`expandedList${i}`);
    };

    // closeBtn.addEventListener('click', onClose);

    // also close on ESC
    const onKey = (ev) => {
        if (ev.key === 'Escape') collapseNote(`expandedList${i}`);
    };
    document.addEventListener('keydown', onKey, { once: true });

    // If user clicks outside main clone content, collapse
    clone.addEventListener('click', (ev) => {
        // ignore clicks on inner actionable buttons (floatbutton etc)
        if (ev.target.closest('.floatbutton') || ev.target.closest('.clone-close')) return;
        // collapse only when clicking the empty area of clone (not inside actionable content)
        if (ev.target === clone) collapseNote(`expandedList${i}`);
    });

    // Check for overflow and add scroll indicator
    const contentCon = clone.querySelector('.contentCon');
    if (contentCon && isOverflowing(contentCon).y) {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.id = `scroll-indicator${i}`;
        indicator.innerHTML = geticon('chevron-down', 30, '#96c703');
        indicator.style.pointerEvents = 'auto'; // Enable clicking
        clone.appendChild(indicator);

        const onScroll = () => {
            const isAtBottom = contentCon.scrollHeight - contentCon.scrollTop <= contentCon.clientHeight + 1;
            if (isAtBottom) {
                indicator.classList.add('hidden');
            } else {
                indicator.classList.remove('hidden');
            }
        };

        const onClickIndicator = (ev) => {
            ev.stopPropagation();
            contentCon.scrollTo({
                top: contentCon.scrollHeight,
                behavior: 'smooth'
            });
        };

        contentCon.addEventListener('scroll', onScroll);
        indicator.addEventListener('click', onClickIndicator);
        scrollListeners.set(`expandedList${i}`, { 
            element: contentCon, 
            listener: onScroll,
            indicator,
            indicatorListener: onClickIndicator
        });
    }



}


export async function collapseNote(id) {
    // Return false if the required elements don't exist
    const i = id.replace(/\D/g, "");
    const clone = document.querySelector(`#${id}`);
    const origListEl = document.querySelector(`#list${i}`);
    const blur = document.querySelector(`#expanded_blur${i}`);

    if (!clone || !origListEl) return false;
    
    // Clear scroll listener if exists
    if (scrollListeners.has(id)) {
        const { element, listener, indicator, indicatorListener } = scrollListeners.get(id);
        element.removeEventListener('scroll', listener);
        if (indicator && indicatorListener) {
            indicator.removeEventListener('click', indicatorListener);
        }
        scrollListeners.delete(id);
    }


    
    const cloneText = clone.querySelector('.contentCon > .content');
    const contentText = origListEl.querySelector('.contentCon > .content');

    const truncatedString = truncateString(cloneText.innerHTML.replace(/<br\/?>/gi, "\n"), {maxWords: 100});
    contentText.innerHTML = truncatedString.text.replaceAll("\n", "<br/>");

    const rect = origListEl.getBoundingClientRect();

    document.body.style.overflow = 'auto';
    
    // Trigger animation
    blur.style.opacity = '0';
    clone.classList.remove('expanded');
    clone.style.top = rect.top + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.borderRadius = window.getComputedStyle(origListEl).borderRadius || '10px';

    // Wait for the animation or timeout
    await new Promise((resolve) => {
        let completed = false;

        const cleanup = () => {
            if (completed) return;
            completed = true;

            try { clone.remove(); blur.remove(); } catch (e) {}
            origListEl.style.visibility = '';
            resolve(); 
        };

        clone.addEventListener('transitionend', cleanup, { once: true });
        setTimeout(cleanup, 500);
    });

    // Return true once the cleanup is finished
    return true;
}

