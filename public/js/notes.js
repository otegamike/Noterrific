import defaultNote from "/js/defaultNotes.js";
import { geticon, icons } from "/js/svg.js";


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


const delBtn = (i) => {
    const delicon = geticon("delete", 25, null, 20.83);


    if (isNaN(i)) {
        const index = i.slice(-1);
        const del = `<span class="floatbutton default" id="del${index}" >${delicon}</span>`
        return del;
        
    } else { 
        const del = `<span class="floatbutton" id="del${i}">${delicon}</span>`
        return del;
    }
}

const editBtn = (i) => {
        const editicon= geticon("edit", 25, null, 20.83);
        const edit = `<span class="floatbutton" id="edit${i===0?"notAllowed":i}">${editicon}</span>`
        return edit;
}   
    
const errObbj = (errText) => {
    const noteEl = document.getElementById("notes");
    const alrt = `<span class="alrtCon" id="alrtCon"><span class="alrt" id="alrt">x ${errText}</span></span>`;
    
    noteEl.insertAdjacentHTML("afterbegin", alrt);

    setTimeout(()=> {
        const alrtEl = document.getElementById("alrt");
        alrtEl.classList.add("fade-in");
    }, 10)

    setTimeout(() => {
        const alrtEl = document.getElementById("alrt");
        alrtEl.classList.remove("fade-in");
        alrtEl.classList.add("fade-out");
        setTimeout(() => {
            document.getElementById("alrtCon").remove();
        }, 500);
        
    }, 4000);

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
            console.log(`Deleted ${targetId} from DOM`);
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
            console.log(`${type} ${animator} from ${targetId}`);
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
    liEl.style.height = height + "px"; 

    setTimeout(() => {
       liEl.style.height = 1 + "px";
       liEl.style.marginTop = 0 +"px";
       listEl.style.transform = "translateX(20%)"
       listEl.style.opacity = 0;
    }, 1000)
}

const preventClick = (toggle, elementId, btn) => {
    const id = elementId ;
    const element = document.getElementById(id);
    

    if (toggle==="on" && btn !== null) {
            const parentId = element.parentElement.id;
            console.log(parentId);

            element.remove();
            const newBtn = btn;
            const inputareaEl = document.getElementById(parentId);
            inputareaEl.insertAdjacentHTML("beforeend", newBtn);
            console.log(`click re-enabled for element id: ${id}`);

    } else if (toggle==="off") {
        document.getElementById(id).onclick = "" ;
        console.log(`click disabled for element id: ${id}`);
    } else {
        return ;
    }
}

const disableBtn = (toggle , id , disableClass) => {
    const element = document.getElementById(id);
    console.log(disableClass);
    const disableclass = (!disableClass)?"disabled":disableClass;
    console.log(disableclass);
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


const liElement = (liId, liTitle, liContent , liCreateTime , animate ) => { 

    //Check if it's a default note by checking create time 
    const defaultnote = (liCreateTime===0)?true:false;
    const defaultid = `default${liId}`;

    //Create html blocks
    const titlespan = `<span id="tit${liId}" class="bold">${liTitle} </span>`;
    const delSpan = `${delBtn(defaultnote?defaultid:liId)}`;
    const editSpan = `${editBtn(defaultnote?0:liId)}`;
     
    const datespan = `<span class="date">${defaultnote?"":loaddate(liCreateTime)}</span>`
    
    const titleContainer = `<div class='titleCon'>${titlespan} <span id="float${liId}" class="float">${editSpan}${delSpan}</span></div>`;
    const contentSpan= `<span class="content" id="cont${liId}" >${liContent.replaceAll("\n","<br/>")}</span>`;
    
    const liClass = animate?'listHide':''; 
    const listClass = animate?'offset-right':'';

    
    const list = `<li class="${liClass}" id="nt${liId}"><div class="list ${listClass}" id="list${liId}"> ${titleContainer}<div class="contentCon">${contentSpan}</div>${datespan}</div></li>`;

    return list ;
}  

const getLatestId = () => {
     const ulEl = document.getElementById('noteUl');
        const ulElId= ulEl.firstElementChild.id;
        let u = Number(ulElId.slice(2));
        const nId = u + 1;

        return nId;
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

const saveEdit = (id, title, content, createTime) => {
    const listEl = document.getElementById(`list${id}`);
    listEl.classList.remove("listedit");

    const titlespan = `<span id="tit${id}" class="bold">${title}</span>`;
    const delSpan = `${delBtn(id)}`;
    const editSpan = `${editBtn(id)}`;
     
    const datespan = `<span class="date">${loaddate(createTime)}</span>`
    
    const titleContainer = `<div class='titleCon'>${titlespan} <span id="float${id}" class="float">${editSpan}${delSpan}</span></div>`;
    const contentSpan= `<span class="content" id="cont${id}" >${content.replaceAll("\n","<br/>")}</span>`;

    
    const editedNote = `${titleContainer}<div class="contentCon">${contentSpan}</div>${datespan}`;
    
    listEl.innerHTML = editedNote ;

}

const addToTop = (id, title, content, createTime) => {
    
    const ulEl = document.getElementById('noteUl');
    const newId = id ;
    const newLi = liElement(id, title, content, createTime, true);
    console.log(newId);
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
            const noteContainer = defaultnote.map(note => liElement (note.id, note.title, note.content, 0)).join("");
            const noteUl = `<ul id="noteUl" class="offset-right">${noteContainer}</ul>`;
            noteEl.innerHTML=noteUl;

            ShowDisplayName(USER);
            animateblock("noteUl","offset-right","remove", 500);

        } else if (res.status===403 && !data.validated ) {
            reLogin()
            return;
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
            console.log(result.message);
            const errTxt = "Couldn't validate your request. you must log in again";
            errObbj(errTxt);
            reLogin();
            return;

        } else {
            const result = await res.json();
            ACCESSTOKEN = result.accessToken;
            delNote(i);

        }
        

    } catch (err) {
        if (err.name === 'AbortError') {
            errObbj('Request timed out. Please try again.');
            disableBtn("off", delId);
        }
        console.log(err);

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
    }, 2000);
};



const editMode = (i) => {

    console.log(!isNaN, "triggered, true if i is a number.");
    //check if edit is allowed
    if (i==="notAllowed") {
        const errTxt = "this note can not be edited";
        errObbj(errTxt);
    } else if (!isNaN(i)) {
        const liTarget = document.getElementById(`nt${i}`);
        const titleTarget = document.getElementById(`tit${i}`);
        const contentTarget = document.getElementById(`cont${i}`);

        const id = i ;
        const title = titleTarget.innerHTML ;
        const content = contentTarget.innerHTML.replaceAll("<br>", "\n") ;


        EDITARRAY = {id: Number(id) , title: title.trim() , content: content.trim()}  ;

        const titlebox = `<input type="text" class="bold editTitle" id="titE${i}" value="${title.trim()}" />` ;
        const contentbox = `<div class="contentCon"> <textarea id="contE${i}" class="editContent">${content.trim()}</textarea></div> ` ;
        const donebox = `<span id="editMode${i}" class="float floatedit"><span class="floatbuttonDark" id="dn${i}">${geticon("check", 20 )}</span></span>`;
        
        const editbox = `<div class="list listedit" id="list${i}"> <div class='titleCon'>${titlebox}${donebox}</div>${contentbox}</div>`;

        liTarget.innerHTML = editbox ;

        const inputt = document.getElementById(`titE${i}`);
        inputt.focus();
        inputt.setSelectionRange(inputt.value.length, inputt.value.length);
        ResizeTextarea(i);


    }
}



const serverEdit = async (i) => {

    const id = i;
    const titleEl = document.getElementById(`titE${i}`);
    const contentEl = document.getElementById(`contE${i}`);

    const title = titleEl.value;
    const content = contentEl.value;
    const createTime = new Date().toISOString() ;

    const editObj = {id: id ,  title: title.trim() , content: content.trim()} ;


    //check for changes
    const changes = checkChanges(editObj) ;

    // If no changes are made return
    if (!changes) {
        
        saveEdit(id, title, content, createTime);
        EDITARRAY = null;
        return
    }

    
    const nId = getLatestId();



    const spinner = `<svg class="spinner" width="25px" height="25px" fill="#96c703"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1v2a7 7 0 1 1-7 7H1a9 9 0 1 0 9-9"/></svg>`;
    const donebox = `<span class="float"><span class="floatbuttonDark" id="dn${i}" onclick="serverEdit(${i})">${donebig}</span></span>`;
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
            const dnBigButton = `<span class="floatbuttonDark" id="dn${i}" onclick="serverEdit(${i})">${donebig}</span>`;
            // Re-enable click if edit failed.
            preventClick("on", dnId, dnBigButton );
            throw new Error( "Network error");

        } else if (res.status===403) {
            const result = await res.json();
            console.log(result.message);
            const errTxt = "Couldn't validate your request. you must log in again";
            errObbj(errTxt);
            reLogin();
            return;

        } else {
            const result = await res.json();
            ACCESSTOKEN = result.accessToken;
            EDITARRAY = null;
            saveEdit(id, title, content, createTime);
        }

    } catch (err) { 
        if (err.name === 'AbortError') {
            errObbj('Request timed out. Please try again.');
            disableBtn("off", dnId); 
        }
    }


}

const logOut = async() => {
    console.log(ACCESSTOKEN, USER);

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
        console.log(err.message);

    }
    
}



// Add event listeners for delete, edit, reload, and formatTitle

// Delegate click events for delete, edit, and reload buttons
document.addEventListener("click", function (e) {
    // Delete button
    if (e.target.closest(".floatbutton") && e.target.closest(".floatbutton").id.startsWith("del")) {
        if (e.target.closest(".floatbutton").classList.contains("disabled")) {
            console.log("disabled");
            return};
        const id = e.target.closest(".floatbutton").id.replace("del", "");
        // Prevent server delete for defualt notes
        if (!isNaN(id)&&!e.target.closest(".floatbutton").classList.contains("default")) {
            serverDel(Number(id));
        } else {
            delNote(id);
        }
    }

    // Edit button
    if (e.target.closest(".floatbutton") && e.target.closest(".floatbutton").id.startsWith("edit")) {
        
        if (e.target.closest(".floatbutton").classList.contains("disabled")) return;
        const id = e.target.closest(".floatbutton").id.replace("edit", "");
        
        // check if an element is already being edited and prompt the user to finish editing it 
        if (EDITARRAY) { 
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

            // change color back after a timeout 



            return;
        }
        if (!isNaN(id)) {
            console.log("editmode activated") ;
            editMode(id);
        } else {
            editMode(id);
        }
    }
    // Reload button
    if (e.target.id === "reload" || e.target.closest("#reload")) {
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
        if (!isNaN(id)) {
            serverEdit(Number(id));
        } else {
            serverEdit(id);
        }
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


// Event listener for reload button
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "logout") {
    logOut();
  }
});
