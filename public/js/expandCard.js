// Expand / Collapse card to fullscreen using a cloned overlay for smooth animation
export async function toggleExpand(i) {
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
        // clone.style.style.maxHeight = '85vh';
        // clone.style.style.maxWidth = '90vw';
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

}


export async function collapseNote(id) {
    // Return false if the required elements don't exist
    const i = id.replace(/\D/g, "");
    const clone = document.querySelector(`#${id}`);
    const origListEl = document.querySelector(`#list${i}`);

    if (!clone || !origListEl) return false;

    const rect = origListEl.getBoundingClientRect();

    // Trigger animation
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

            try { clone.remove(); } catch (e) {}
            origListEl.style.visibility = '';
            resolve(); 
        };

        clone.addEventListener('transitionend', cleanup, { once: true });
        setTimeout(cleanup, 500);
    });

    // Return true once the cleanup is finished
    return true;
}

