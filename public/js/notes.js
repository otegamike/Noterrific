import defaultNote from "/js/defaultNotes.js";
import { geticon, icons } from "/js/svg.js";
import { toggleExpand, collapseNote } from "/js/expandCard.js";
import {animateElement} from "/js/animationHandler.js";


const donebig = `<svg height="30px" fill="#edf9cc" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="m5 16.577 2.194-2.195 5.486 5.484L24.804 7.743 27 9.937l-14.32 14.32z"/></svg>`;

function DisplayPhoto(str, size = 100) {
  if (!str || typeof str !== "string") return "";

  // 1. Get first letter uppercase
  const letter = str.charAt(0).toUpperCase();

  // 2. Deterministic color from full string
  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }

  const backgroundColor = stringToColor(str);

  // 3. Contrast text color
  function getContrastYIQ(hex) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  }
  const textColor = getContrastYIQ(backgroundColor);

  // 4. Return HTML string
  return `
    <div style="
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      display:flex;
      justify-content:center;
      align-items:center;
      font-size:${size * 0.5}px;
      font-weight:700;
      font-family:Arial, sans-serif;
      background-color:${backgroundColor};
      color:${textColor};
    ">
      ${letter}
    </div>
  `;
}

const ShowDisplayName = (uname) => {
    const name = sessionStorage.getItem("username"); 
    const username = uname? uname : name ;
    if (username) {
        sessionStorage.setItem("username", username);
        const usernameCapitalized = username.charAt(0).toUpperCase()+username.slice(1);
        const element = ` <span class="loginn display-name" id="displayName"> <span class="uname">${usernameCapitalized}</span>
                                                                             <span class="panel">
                                                                                <span class="tablink" id="logout"> logout</span>
                                                                                <span class="tablink" id="reload"> reload</span>
                                                                             </span>
        </span>
            <span class="profilepic" id="profilepic"> ${DisplayPhoto(username,40)}  </span>
        `
        document.getElementById("actions").innerHTML= element ;
    }
}

window.onload = ShowDisplayName();

const loaddate= (date) => {
    const dt = new Date(date);
    const now = new Date();
    let newDate = "";

    const datediff = now - dt;
    const diffSec = Math.floor(datediff/1000) ;
    const diffMin = Math.floor(diffSec/60) ;
    const diffHr = Math.floor(diffMin/60) ;
    const diffDay = Math.floor(diffHr/24) ;
    const diffWk = Math.floor(diffDay/7) ;

    if (diffWk>=4) {
        const option = { month: "short" , year : "numeric"} ;
        newDate = dt.toLocaleDateString("en-Us" , option) ;
    } else if (diffWk<4&&diffWk>0) {
        newDate = `${diffWk} weeks ago` ;
    } else if (diffDay<7&&diffDay>0) {
        newDate = `${diffDay} days ago` ;
        if (diffDay === 1)  {newDate="yesterday" ; }
    } else if (diffHr>0) {
        newDate = `${diffHr} hours ago`
    } else if (diffMin>0) {
        newDate = `${diffMin} mins ago` ;
        if (diffMin === 1)  {newDate="just now" ; }
    } else if (diffSec>=0) {
        newDate = `just now`
    }


    const d = `<div class="dateCon" id="dateCon"><span class="date" id="date">${newDate}</span></div>` ;
    return d;

};

//___Action Buttons___//

const delBtn = (i) => {
    const delicon = geticon("delete", 25, null, 20.83);
    const del = `<span class="floatbutton" id="del${i}">${delicon}</span>`
    return del;
    
}

const editBtn = (i) => {
    const editicon= geticon("edit", 25, null, 20.83);
    const edit = `<span class="floatbutton" id="edit${i===0?"notAllowed":i}">${editicon}</span>`;
    return edit;
}  

const copyBtn = (i) => {
    const copyicon= geticon("copy", 25);
    const copy = `<span class="floatbutton" id="copy${i}">${copyicon}</span>`;
    return copy;
}

const expandBtn = (i) => {
    const expandicon= geticon("expand", 22);
    const expand = `<span class="floatbutton" id="expand${i}">${expandicon}</span>`;
    return expand;
}

const moreBtn = (i) => {
        const moreicon= geticon("more", 20);
        const more = `<span class="morebutton" id="more${i}">${moreicon}</span>`;
        return more;
}

const actionBtns = (i, check) => { 
    //Check if it's a default note by checking create time
    const delSpan = `${delBtn(i)}`;
    const editSpan = `${editBtn(i)}`;
    const copySpan = `${copyBtn(i)}`;
    const expandSpan = `${expandBtn(i)}`;
    const moreSpan = `${moreBtn(i)}`;

    return `<span class="action-btns">${editSpan}${delSpan}<span class="hidable-action-btns">${copySpan}${expandSpan}</span></span>${moreSpan}`;
};

//___Alert Object___//
    
const errObbj = (errText) => {
    const alertEl = document.getElementById("alrtCon");
    if (!alertEl) return;
    const i = alertEl.children.length + 1;

    const alrt = `<div class="alrt" id="alrt${i}">${errText}</div>`;
    
    alertEl.insertAdjacentHTML("beforeend", alrt);

    animateblock(`alrt${i}`,"fade-in","add",10);

    animateblock(`alrt${i}`, "fade-in", "remove", 4000, "delete");

}

const alertObj = (alertText, type="alert-success") => {
    const alertEl = document.getElementById("alrtCon");
    if (!alertEl) return;
    const i = alertEl.children.length + 1;

    const alrt = `<div class="alrt ${type}" id="alrt${i}">${alertText}</div>`;
    
    alertEl.insertAdjacentHTML("beforeend", alrt);

    animateblock(`alrt${i}`,"fade-in","add",10);

    animateblock(`alrt${i}`, "fade-in", "remove", 4000, "delete");

}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Copied to clipboard!");
    return {copied: true}
    
  } catch (err) {
    console.error("Failed to copy:", err);
    return {copied: false}
  }
}

//Animations

const animateblock = (targetId, animator, type = "remove", delay = 500, callback = null) => {
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    // 1. Define what happens when animation ends
    const onAnimationComplete = () => {
        // Clean up the listener so it doesn't fire again
        targetEl.removeEventListener('animationend', onAnimationComplete);
        targetEl.removeEventListener('transitionend', onAnimationComplete);

        // Check if user wants to delete or run a custom function
        if (callback === "delete") {
            targetEl.remove(); // Removes element from DOM
           
        } else if (typeof callback === "function") {
            callback(); // Runs custom function
        }
    };

    const performAction = () => {
        // 2. Add listeners for both CSS Animation AND Transitions
        // We add these BEFORE changing the class to catch the event
        if (callback) {
            targetEl.addEventListener('animationend', onAnimationComplete, { once: true });
            targetEl.addEventListener('transitionend', onAnimationComplete, { once: true });
        }

        // 3. Toggle the class
        if (type === "add") {
            targetEl.classList.add(animator);
         
        } else if (type === "remove") {
            targetEl.classList.remove(animator);
        }
    };

    // 4. Wait for the initial delay, then start
    setTimeout(performAction, delay);
}

const delAnimation = (index) => {
    const liEl = document.getElementById(`nt${index}`);
    const listEl = document.getElementById(`list${index}`);

    if (!liEl || !listEl) {
        errObbj("encountered an error while trying to delete. Please try again later");
        return 
    }

    const height = listEl.offsetHeight; 
    liEl.style.gridTemplateRows = "none";
    liEl.style.height = height + "px"; 

    setTimeout(() => {
       liEl.style.height = 0.01 + "px";
       liEl.style.marginBottom = 0 +"px";
       listEl.style.transform = "translateX(20%) translateY(-16px)"
       listEl.style.opacity = 0;
    }, 10)
}

const preventClick = (toggle, elementId, btn) => {
    const id = elementId ;
    const element = document.getElementById(id);
    

    if (toggle==="on" && btn !== null) {
            const parentId = element.parentElement.id;
           

            element.remove();
            const newBtn = btn;
            const inputareaEl = document.getElementById(parentId);
            inputareaEl.insertAdjacentHTML("beforeend", newBtn);
           

    } else if (toggle==="off") {
        document.getElementById(id).onclick = "" ;
       
    } else {
        return ;
    }
}

const disableBtn = (toggle , id , disableClass) => {
    const element = document.getElementById(id);

    //check if its a float button and disable opacity if its is
    const float = element.closest(".float");
    if (float){float.style.opacity = 1; }

    //set disableclass if provided
    const disableclass = (!disableClass)?"disabled":disableClass;
  
    // toggle button
    if (toggle==="on") {
        //disable button
        element.classList.add(disableclass);


    } else if (toggle==="off") {
        // Enable button
        element.classList.remove(disableclass);
    } else {
        console.warn('Invalid toggle value. Use "on" or "off".');
    }
};

const editWarning = (id) => {
    const edId = EDITARRAY.id ;
    const edContentEl = document.getElementById(`contE${edId}`) ;
    const len = edContentEl.innerHTML.length ;
    errObbj("You must finish editing note first");
    //change background of the note being editted to highlight it 
    document.documentElement.style.setProperty('--editmode', 'hsl(76deg 50% 70)') ;
    document.documentElement.style.setProperty('--editmodefocus', 'hsl(76deg 50% 70)') ;
    //place cursor at the end of edit box
    edContentEl.focus() ;
    edContentEl.setSelectionRange(len , len);

    setTimeout(()=> {
        document.documentElement.style.setProperty('--editmode', 'hsl(76deg 65% 83)') ;
        document.documentElement.style.setProperty('--editmodefocus', 'hsl(76deg 65% 81)') ;
    }, 1000) ;
}


const liElement = (liId, liTitle, liContent , liCreateTime , animate , type) => { 

    //Check if it's a default note by checking create time 
    
    const titlespan = `<span id="tit${liId}" class="bold">${liTitle} </span>`;
     
    const datespan = `<span class="date">${(type==="default")?"":loaddate(liCreateTime)}</span>`
    
    const titleContainer = `<div class='titleCon'>${titlespan} <span id="float${liId}" class="float">${actionBtns(liId,type)}</span></div>`;
    const contentSpan= `<span class="content" id="cont${liId}" >${liContent.replaceAll("\n","<br/>")}</span>`;
    
    const liClass = animate?'listHide':''; 
    const listClass = animate?'offset-right':'';

    
    const list = `<li class="${liClass}" id="nt${liId}"><div class="list list-boundary ${listClass}" data-type=${type} id="list${liId}"> ${titleContainer}<div class="contentCon">${contentSpan}</div>${datespan}</div></li>`;

    return list ;
}  

const getLatestId = () => {
     const ulEl = document.getElementById('noteUl');
        const ulElId= ulEl.firstElementChild.id;
        let u = Number(ulElId.slice(2));
        const nId = u + 1;

        return nId;
}

const moveCursorToEnd = (id) => {
    const inputt = document.getElementById(id);
    inputt.focus();
    inputt.setSelectionRange(inputt.value.length, inputt.value.length);
}

const ResizeTextarea = (id) => {
    const element = document.getElementById(`contE${id}`) ;

    const autoResize = (el) => {
        el.style.height = 'auto' ; 
        el.style.height = el.scrollHeight + "px" ;
    };

    element.addEventListener("input" , () => autoResize(element));
    autoResize(element);
}

const saveEdit = (i, title, content, createTime) => {
    //check if expanded
    const xid = (i.charAt(0)==="X")?true:false;
    const id = (i.charAt(0)==="X")?i.replace("X",""):i ;
    const targetId = (xid)?`expandedList${id}`:`list${id}`;

    const listEl = document.getElementById(targetId);
    listEl.classList.remove("listedit");

    const titlespan = `<span id="tit${i}" class="bold">${title}</span>`;
     
    const datespan = `<span class="date">${loaddate(createTime)}</span>`
    
    const titleContainer = `<div class='titleCon'>${titlespan} <span id="float${i}" class="float">${actionBtns(i)}</span></div>`;
    const contentSpan= `<span class="content" id="cont${i}" >${content.replaceAll("\n","<br/>")}</span>`;

    
    const editedNote = `${titleContainer}<div class="contentCon">${contentSpan}</div>${datespan}`;
    
    listEl.innerHTML = editedNote ;

}

const addToTop = (id, title, content, createTime) => {
    
    const ulEl = document.getElementById('noteUl');
    const newId = id ;
    const newLi = liElement(id, title, content, createTime, true);
    
    if (!ulEl) {
        //create new ul element if it doesn't already exist

        const noteEl = document.getElementById("notes");
        noteEl.innerHTML= `<ul id="noteUl">${newLi}</ul>` ;
        
    } else {
        // Insert new li element on top
        ulEl.insertAdjacentHTML("afterbegin", newLi);
    }

    const liEl = document.getElementById(`nt${newId}`);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const listEl = document.getElementById(`list${newId}`);
            const height = listEl.offsetHeight;

            animateblock(`nt${newId}`, "listHide", "remove", 0);
            if (window.innerWidth < 600) {liEl.style.height = height+"px"; } ;
            animateblock(`list${newId}`, "offset-right", "remove", 150);
        });
    });

    liEl.addEventListener("transitionend", ()=> {liEl.style.height = "fit-content" ; } , { once: true })

        

}

const reqTimeout = (timeout = 30000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    // return both parts so you can use them in any async function
    return {
        signal: controller.signal,
        clear: () => clearTimeout(timer),
        abort: () => controller.abort(),
    };
}

const reLogin = () => {
    sessionStorage.setItem("validate", "unvalidated");
    document.cookie = "has_auth=fasle";
    window.location.href = "/login.html?page=invalidated";
}

let ACCESSTOKEN ;
let EDITARRAY ;
let USER ;

const checkChanges = (obj) => {
    if (!obj.id||!EDITARRAY.id) {
        return "cancel"; 
    } else if (obj.id===EDITARRAY.id&&obj.title===EDITARRAY.title&&obj.content===EDITARRAY.content) {
        return false
    } else {
        return true
    }
}


async function getNotes() {
    const loading= ` <div class="loadCon"> 
            <span class="load"> ${geticon("custom-loader")} loading notes </span>
        </div>`;
    
    const noteEl = document.getElementById("notes");
    noteEl.innerHTML = loading ;
    console.log("getting notes");

    const requestTimeout = reqTimeout() ; 

    try {
        const res = await fetch(("/.netlify/functions/app/getNotes") , {
            method: "POST" ,
            headers: {"Content-type": "application/json" } ,
            body: JSON.stringify({ACCESSTOKEN : ACCESSTOKEN}) ,
            signal: requestTimeout.signal,
        })
        //clear timer if server responds
        requestTimeout.clear();

        const data = await res.json();
        if (res.status===404 && data.notes==="none" ) {
            USER = data.USER ;
            const userBold = `<span class="usernameBold">${USER.charAt(0).toUpperCase()+USER.slice(1)}</span>`
            const defaultnote = defaultNote(userBold);
            const noteContainer = defaultnote.map(note => liElement (note.id, note.title, note.content, 0 ,false , "default")).join("");
            const noteUl = `<ul id="noteUl" class="offset-right">${noteContainer}</ul>`;
            noteEl.innerHTML=noteUl;

            ShowDisplayName(USER);
            // Animate loader out
            animateblock("loadCon","fade-out","add", 250, "delete");
            // load notes 
            animateblock("noteUl","offset-right","remove", 500);

        } else if (res.status===403 && !data.validated ) {
            reLogin()
            return;
        }  else if (res.status===503 && !data.validated ) {
             console.error(err.message);
            const reload = `<div class="reload"><span class="load"><b>Couldn't connect to server</b> <span id="reload" style="color: var(--colordarker); cursor: pointer;" >try again</span></span></div>`
            noteEl.innerHTML=reload;
            animateblock("loadCon","fade-out","add", 250, "delete");

            errObbj("Network Error. Try again.");
        } else {
            ACCESSTOKEN = data.accessToken;
            USER = data.USER ;
            ShowDisplayName(USER);
            const notes = data.notes;
            const noteSort = notes.sort((a, b) => new Date(b.createTime) - new Date(a.createTime) ) ; 
            const noteContainer = noteSort.map(note => liElement (note.id, note.title, note.content, note.createTime)).join("");
    

            const noteUl = `<ul id="noteUl" class="offset-right">${noteContainer}</ul>`;
            noteEl.innerHTML=noteUl;
            // Animate loader out
            animateblock("loadCon","fade-out","add", 250, "delete");
            animateblock("noteUl","offset-right","remove", 500);

        }
            
    } catch (err) {
        
        if (err.name === 'AbortError') {
            errObbj('Request timed out. Please try again.');
            // Animate loader out
            const reload = `<div class="reload"><span class="load"><b>Couldn't connect to server</b> <span id="reload" style="color: var(--colordarker); cursor: pointer;" >try again</span></span></div>`
            noteEl.innerHTML=reload;
            animateblock("loadCon","fade-out","add", 250, "delete");
            return;
        }

         console.error(err.message);
         const reload = `<div class="reload"><span class="load"><b>Couldn't connect to server</b> <span id="reload" style="color: var(--colordarker); cursor: pointer;" >try again</span></span></div>`
         noteEl.innerHTML=reload;
         animateblock("loadCon","fade-out","add", 250, "delete");

         errObbj("Could not connect to server retry");
         

    }

}

window.onload = getNotes;
window.getNotes = getNotes;


const formatTitle = () => {
    const x = document.getElementById("title");
    const y = x.value;
    const z = y.trim();

    if (z.includes(" ")) {
        let titleArr = y.split(" ");

        titleArr.forEach((item, i, arr) => {
           arr[i] = item.charAt(0).toUpperCase() + item.slice(1) ;
        });
      x.value= titleArr.join(" ");
    }

    else {
        x.value =  y.charAt(0).toUpperCase() + y.slice(1) ;
    }
}


const saveNote = async () => {

    
    const titleEl = document.getElementById("title");
    const contentEl = document.getElementById("content");
    const saveBtn = `<span class="save" onclick="saveNote()" id="save"> Done</span>`
    
    const title = titleEl.value;
    const content = contentEl.value;
    const createTime = new Date().toISOString();
    
    const saveEl = document.getElementById("save");
    saveEl.innerHTML = geticon("spinner", 20);
    // disable button while waiting for server response
    disableBtn("on", "save");
    
    // Notify user if content empty and reset save button
    if (content==="") {
        const c = document.getElementById("content");
        c.placeholder = "Note can't be empty...";
        saveEl.innerHTML = "x";
        const errTxt = "Can't submit empty content";
        errObbj(errTxt);

        //reset save button
        setTimeout(()=> {
            c.placeholder = "Take a note..."
            saveEl.innerHTML = "Save" ;
            //re-enable button
            disableBtn("off", "save"); 
        
        } , 2000) ;
        return
    }

    const requestTimeout = reqTimeout() ; 

    try {
        const res = await fetch(("/.netlify/functions/app/newNote"), {
            method: "POST",
            headers:  {"Content-type" : "application/json"},
            body: JSON.stringify({ACCESSTOKEN, title , content, createTime, }),
            signal: requestTimeout.signal,
        });

        requestTimeout.clear();

        if (res.ok) {

            const result = await res.json();
            if (result.accessToken) {
                ACCESSTOKEN = result.accessToken;
            }
            titleEl.value = "" ;
            contentEl.value = "";
            saveEl.innerHTML = geticon("check", 20);


            const nId = result.id;

            addToTop(nId, title, content, createTime) ;

            // re-enable button after two seconds.
            setTimeout(() => {
               disableBtn("off", "save");
               saveEl.innerHTML = "Save";
            }, 2000);

        } else {
            const errTxt="could not save note. try again later...";
            disableBtn("off", "save");

            errObbj(errTxt);

            throw new Error("Network response was not okay") ;  
        }
    } 

    catch (err) {
        requestTimeout.clear(); // clean up even on error

        if (err.name === 'AbortError') {
            errObbj('Request timed out. Please try again.');
            saveEl.innerHTML = "Save" ;
            //re-enable button
            disableBtn("off", "save"); 
        }

        console.log("Error:", err);
    }
}



const serverDel = async (i) => {

    const id = i;
    // const spinner = `<svg class="spinner" width="25px" height="25px" fill="#96c703"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1v2a7 7 0 1 1-7 7H1a9 9 0 1 0 9-9"/></svg>`;
    const delId = `del${i}`;
    const delEl = document.getElementById(delId);
    delEl.innerHTML = geticon("spinner", 20 , '#96c703') ;

    // disable button
    disableBtn("on", delId);
    const requestTimeout = reqTimeout() ;

    try {  
        const res = await fetch(("/.netlify/functions/app/delNote") , {
            method: "POST" ,
            headers: {"Content-type": "application/json" } ,
            body: JSON.stringify({ACCESSTOKEN , id}) ,
            signal: requestTimeout.signal,
        })

        requestTimeout.clear();

        if (res.status===500) {
            const errTxt = "Could not delete note. Please try again later";
            errObbj(errTxt);
            // enable button
            disableBtn("off", delId);
            throw new Error( "Network error");
            
        } else if (res.status===403) {
            const result = await res.json();
            console.error(result.message);
            const errTxt = "Couldn't validate your request. you must log in again";
            errObbj(errTxt);
            reLogin();
            return;

        } else {
            const result = await res.json();
            ACCESSTOKEN = result.accessToken;
            alertObj("Note deleted successfully");
            delNote(i);

        }
        

    } catch (err) {
        if (err.name === 'AbortError') {
            errObbj('Request timed out. Please try again.');
            disableBtn("off", delId);
        }
        console.error(err);

    }
}



const delNote = (index) => {
    const liEl = document.getElementById(`nt${index}`);
    
    if (!liEl) {
        errObbj("encountered an error while trying to delete. Please try again later");
        return
    }  

    //Intiate delete animation
     delAnimation(index);

    // Remove element after animation
    setTimeout(() => {
        liEl.remove();
    }, 1000);
};



const editMode = (i) => {

    
    let id = i ;
    //Check if expanded
    const xid = (id.charAt(0)==="X")?id.replace("X",""): null;
    id = (id.charAt(0)==="X")?id.replace("X",""): id;

    const liTarget = document.getElementById(`nt${id}`);
    const titleTarget = document.getElementById(`tit${id}`);
    const contentTarget = document.getElementById(`cont${id}`);
    const title = titleTarget.innerHTML ;
    const content = contentTarget.innerHTML.replaceAll("<br>", "\n") ;


    EDITARRAY = {id: i , title: title.trim() , content: content.trim()}  ;
    const lister = (ix,x) => {
        const titlebox = `<input type="text" class="bold editTitle" id="titE${ix}" value="${title.trim()}" />` ;
        const contentbox = `<div class="contentCon"> <textarea id="contE${ix}" class="editContent ${x?'fillspace':''}">${content.trim()}</textarea></div> ` ;
        const donebox = `<span id="editMode${ix}" class="float floatedit"  style= "opacity: 1;"><span class="floatbuttonDark" id="dn${ix}">${geticon("check", 20 )}</span></span>`;
        const insideList = `<div class='titleCon'>${titlebox}${donebox}</div>${contentbox}`;

        return insideList
    }
    

    const editbox = `<div class="list listedit list-boundary" id="list${id}">${lister(id)}</div>`;
    if (xid) {
        const expandedList = document.querySelector(`#expandedList${id}`);
       
        if (expandedList) {
            expandedList.classList.add('listedit');
            expandedList.innerHTML = lister(i,true);
            moveCursorToEnd(`contE${i}`)
        }
    }

    liTarget.innerHTML = editbox ;

    if (!xid) moveCursorToEnd(`titE${id}`)
    ResizeTextarea(id);
}



const serverEdit = async (i) => {
    const xid = (i.charAt(0)==="X")?true:false ;
    const id = (i.charAt(0)==="X")?i.replace("X",""):i;
    const titleEl = document.getElementById(`titE${i}`);
    const contentEl = document.getElementById(`contE${i}`);

    const title = titleEl.value;
    const content = contentEl.value;
    const createTime = new Date().toISOString() ;

    const editObj = {id: i,  title: title.trim() , content: content.trim()} ;

    //check for changes
    const changes = checkChanges(editObj) ;

    // If no changes are made return
    if (!changes) {
        
        if (xid) {saveEdit(i, title, content, createTime);}
        saveEdit(id, title, content, createTime);
        EDITARRAY = null;
        return
    }

    
    const nId = getLatestId();

    const dnId = `dn${i}`;
    const dnEl = document.getElementById(dnId);
    dnEl.innerHTML = geticon("spinner",20 , "var(--colorlighter)") ;

    //  Disable button while waiting for server response.
    disableBtn("on" , dnId);
    const requestTimeout = reqTimeout() ;

    

  try {  
        const res = await fetch(("/.netlify/functions/app/editNote") , {
            method: "POST" ,
            headers: {"Content-type": "application/json" } ,
            body: JSON.stringify({ACCESSTOKEN, nId, id, title, content, createTime }) ,
            signal: requestTimeout.signal,
        })

        requestTimeout.clear();


        if (res.status===500) {     
            const errTxt = "Can't connect to server. Please try again."
            errObbj(errTxt);
            dnEl.innerHTML = geticon("check", 20 );
            disableBtn("off", dnId); 
            throw new Error( "Network error");

        } else if (res.status===403) {
            const result = await res.json();
            console.error(result.message);
            const errTxt = "Couldn't validate your request. you must log in again";
            errObbj(errTxt);
            reLogin();
            return;

        } else {
            const result = await res.json();
            ACCESSTOKEN = result.accessToken;
            EDITARRAY = null;
            alertObj("Note edited successfully");
            if (xid) {saveEdit(i, title, content, createTime);}
            saveEdit(id, title, content, createTime);
        }

    } catch (err) { 
        if (err.name === 'AbortError') {
            errObbj('Request timed out. Please try again.');
            dnEl.innerHTML = geticon("check", 20 );
            disableBtn("off", dnId); 
        }
    }


}

const logOut = async() => {

    try {
        const res = await fetch(("/.netlify/functions/app/logout") , {
            method: "POST" ,
            headers: {"Content-type": "application/json" } ,
            body: JSON.stringify({ACCESSTOKEN, USER}) ,
        });
        const data = await res.json();
        if (res.status===500) {
            const errTxt = "Could not log you out. Please try again later";
            errObbj(errTxt);
            throw new Error( "Network error");
        } else if (res.status===200) {
            console.log(data.message);
            sessionStorage.removeItem("validate");
            sessionStorage.removeItem("username");
            ACCESSTOKEN = null ;
            USER = null ;
            window.location.href = "/login.html?logout=true";
        } else if (res.status===403) {
            sessionStorage.removeItem("validate");
            sessionStorage.removeItem("username");
            ACCESSTOKEN = null ;
            USER = null ;
            window.location.href = "/login.html?logout=true";
        }
         
    } catch (err) { 
        console.error(err.message);

    }
    
}



// Add event listeners for delete, edit, reload, and formatTitle

// Delegate click events for delete, edit, and reload buttons
document.addEventListener("click", async function (e) {
    // Delete button
    if (e.target.closest(".floatbutton") && e.target.closest(".floatbutton").id.startsWith("del")) {
        if (e.target.closest(".floatbutton").classList.contains("disabled")) {
            return};
        const i = e.target.closest(".floatbutton").id.replace("del", "");
        const id = (i.charAt(0)==="X")?i.replace("X", ""):i;
        // Prevent server delete for defualt notes

        const listElement = e.target.closest('.list');

        // If expanded, collapse first
        if (i.charAt(0)==="X") {
            await collapseNote(`expandedList${id}`);
        }

        // Check if default note
        if (listElement && listElement.getAttribute('data-type') === 'default') {
            delNote(id);
        } else {
            serverDel(id);
        }
        
    }

    // Edit button
    if (e.target.closest(".floatbutton") && e.target.closest(".floatbutton").id.startsWith("edit")) {
        
        if (e.target.closest(".floatbutton").classList.contains("disabled")) return;
        let id = e.target.closest(".floatbutton").id.replace("edit", "");

        
        // check if an element is already being edited and prompt the user to finish editing it 
        if (EDITARRAY) return editWarning(id);

        const listElement = e.target.closest('.list');
        

        if (listElement && listElement.getAttribute('data-type') === 'default') {
            errObbj("You can't edit Default notes.");
        } else {
            editMode(id);
        }
        
        
    }

    // Copy button
    if (e.target.closest(".floatbutton") && e.target.closest(".floatbutton").id.startsWith("copy")) {
        const id = e.target.closest(".floatbutton").id.replace("copy", "");
        const titleEl = document.getElementById("tit"+id);
        const contEl =  document.getElementById("cont"+id);
        if (!titleEl||!contEl) {
            errObbj("Encountered an error while trying to copy. reload and try again") ;
            return;
        }
        const copyText = `${titleEl.innerHTML}\n${contEl.innerHTML.replaceAll("<br>", "\n")}`;
        const copy = await copyToClipboard(copyText.trim()) ;
        if (!copy.copied) {
            errObbj("Encountered an error while trying to copy. reload and try again") ;
            return;
        }

        alertObj(`Copied to clipboard`);
    }

    // Expand button
    if (e.target.closest(".floatbutton") && e.target.closest(".floatbutton").id.startsWith("expand")) {
        const id = e.target.closest(".floatbutton").id;
        let i = id.replace("expand", "");
        i = (i.charAt(0)==="X")?i.replace("X", ""):i ;
        await toggleExpand(i);

    }

    // Reload button
    if (e.target.id === "reload" || e.target.closest("#reload")) {
        //Check for expanded note.
        alertObj("Refreshing your notes...", "alert-warning");
        const expanded = document.querySelector(".expanded");
        const ulEl = document.getElementById("noteUl");
        
        if (expanded) {
            const id = expanded.id;
            await collapseNote(id);

        }
        if (ulEl) {
            await animateElement("noteUl","fade-out","add", 10, "delete", true);
        }
        getNotes();
    }
});

// Add oninput event for formatTitle on #title input
document.addEventListener("DOMContentLoaded", function () {
    const titleInput = document.getElementById("title");
    if (titleInput) {
        titleInput.oninput = formatTitle;
    }
});

// Add event listener for save button
document.addEventListener("DOMContentLoaded", function () {
    const saveBtn = document.getElementById("save");
    
    if (saveBtn) {
        saveBtn.addEventListener("click", function (e) {
            if (e.target.classList.contains("disabled")) return;
            e.preventDefault();
            saveNote();
        });
    }
});

// Event listener for edit mode done button
document.addEventListener("click", function (e) {
    const doneBtn = e.target.closest(".floatbuttonDark");
    if (doneBtn && doneBtn.id.startsWith("dn")) {
        if (e.target.closest(".floatbuttonDark").classList.contains("disabled")) return;
        const id = doneBtn.id.replace("dn", "");
        serverEdit(id);
       
    }
});

// Switch focus from title input to content textarea on Enter key
document.addEventListener("keydown", function (e) {
    // For new note
    if (
        document.activeElement.id === "title" &&
        e.key === "Enter"
    ) {
        e.preventDefault();
        const contentEl = document.getElementById("content");
        const len = contentEl.innerHTML.length;
        if (contentEl) {
            contentEl.focus(); 
            contentEl.setSelectionRange(len , len);
        }

    }
    // For edit mode (dynamic ids)
    if (
        document.activeElement.id.startsWith("titE") &&
        e.key === "Enter"
    ) {
        e.preventDefault();
        const i = document.activeElement.id.replace("titE", "");
        const contentEditEl = document.getElementById(`contE${i}`);
        const len = contentEditEl.innerHTML.length;
        if (contentEditEl) {
            contentEditEl.focus(); 
            contentEditEl.setSelectionRange(len , len);
        }
    }
});


// Event listener for Log-out button
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "logout") {
    alertObj("You are logging out...", "alert-warning");
    logOut();
  }
});
