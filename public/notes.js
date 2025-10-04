
const spin = `<svg class="spinner" width="20px" height="20px" fill="#edf9cc"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1v2a7 7 0 1 1-7 7H1a9 9 0 1 0 9-9"/></svg>`;
const done = `<svg height="20px" fill="#edf9cc" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="m5 16.577 2.194-2.195 5.486 5.484L24.804 7.743 27 9.937l-14.32 14.32z"/></svg>`;
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
        const element = ` <span class="loginn" id="displayName">${username}</span>
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
        const delicon=`<svg width="30px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#96c703" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="#96c703" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#96c703" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#96c703" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#96c703" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
        const del = `<span class="floatbutton" id="del${i}" onclick="serverDel(${i})">${delicon}</span>`
        return del;
    }

const editBtn = (i) => {
        const editicon=`<svg width="30px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.848 1.879a3 3 0 0 0-4.243 0L2.447 16.036a3 3 0 0 0-.82 1.533l-.587 2.936a2 2 0 0 0 2.353 2.353l2.936-.587a3 3 0 0 0 1.533-.82L22.019 7.293a3 3 0 0 0 0-4.243zm-2.829 1.414a1 1 0 0 1 1.415 0l1.171 1.171a1 1 0 0 1 0 1.415L17.933 8.55l-2.585-2.586zm-4.086 4.086L3.862 17.45a1 1 0 0 0-.274.51l-.587 2.936 2.935-.587a1 1 0 0 0 .511-.274L16.52 9.964z" fill="#96c703"/></svg>`;
        const edit = `<span class="floatbutton" id="edit${i}" onclick="editMode(${i})">${editicon}</span>`
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

const animateblock = (target) => {
    const targetEl = document.getElementById(target);

    setTimeout(() => {
        targetEl.classList.remove("offset-right");
    }, 500);
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


const liElement = (liId, liTitle, liContent , liCreateTime ) => { 
    const titlespan = `<span id="tit${liId}" class="bold">${liTitle} </span>`;
    const delSpan = `${delBtn(liId)}`;
    const editSpan = `${editBtn(liId)}`;
    const datespan = `<span class="date">${loaddate(liCreateTime)}</span>`
    
    const titleContainer = `<div class='titleCon'>${titlespan} <span id="float${liId}" class="float">${editSpan}${delSpan}</span></div>`;
    const contentSpan= `<span class="content" id="cont${liId}" >${liContent.replaceAll("\n","<br/>")}</span>`;

    const list = `<li id="nt${liId}">${titleContainer}<div class="contentCon">${contentSpan}</div>${datespan}</li>`;

    return list ;
}  

const getLatestId = () => {
     const ulEl = document.getElementById('noteUl');
        const ulElId= ulEl.firstElementChild.id;
        let u = Number(ulElId.slice(2));
        const nId = u + 1;

        console.log(nId);
        return nId;
}

const addToTop = (id, title, content, createTime) => {
    
    const ulEl = document.getElementById('noteUl');
    if (!ulEl) {
        const noteEl = document.getElementById("notes");
        noteEl.innerHTML= `<ul id="noteUl">${liElement(id, title, content, createTime)}</ul>` ;
    } else {
       const ulEl = document.getElementById('noteUl');
       const newLi = liElement(id, title, content, createTime) ;
       
       ulEl.insertAdjacentHTML("afterbegin", newLi);
    }

}

const reLogin = () => {
    sessionStorage.setItem("validate", "unvalidated");
    window.location.href = "/login.html";
}

let ACCESSTOKEN ;


async function getNotes() {
    const loading= ` <div class="loadCon"> 
            <span class="roller"> <svg class="spinner" width="60px" height="60px" fill="#96c703"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1v2a7 7 0 1 1-7 7H1a9 9 0 1 0 9-9"/></svg></span>
            <span class="load"> loading notes </span>
        </div>`;
    const noteEl = document.getElementById("notes");
    noteEl.innerHTML = loading ;

    try {
        const res = await fetch(("/.netlify/functions/app/getNotes") , {
            method: "POST" ,
            headers: {"Content-type": "application/json" } ,
            body: JSON.stringify(ACCESSTOKEN) 
        })

        const data = await res.json();
        if (res.status===404 && data.notes==="none" ) {
            noteEl.innerHTML = `<div class="noNote">You dont have any notes. Create your first bote</div>`
        } else if (res.status===403 && !data.validated ) {
            reLogin()
            return;
        } else {
            ACCESSTOKEN = data.accessToken;
            const USER = data.USER ;
            ShowDisplayName(USER);
            const notes = data.notes;
            const noteSort = notes.sort((a, b) => new Date(b.createTime) - new Date(a.createTime) ) ; 
            const noteContainer = noteSort.map(note => liElement (note.id, note.title, note.content, note.createTime)).join("");
    

            const noteUl = `<ul id="noteUl" class="offset-right">${noteContainer}</ul>`;
            noteEl.innerHTML=noteUl;

            animateblock("noteUl");

        }
            
    } catch (err) {
         console.error(err.message);
         const reload = `<div class="reload" id="reload"><b>Couldn't connect to server</b> <br/> <a onclick="getNotes()">try again</a></div>`
         noteEl.innerHTML=reload;
         errObbj("Could not connect to server retry");

    }

}

window.onload = getNotes;

const titleEl = document.getElementById("title");
const contentEl = document.getElementById("content");
const textareaEl =document.getElementById("inputarea");

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
    saveEl.innerHTML = spin;
    preventClick("off", "save", null);

    if (content==="") {
        const c = document.getElementById("content");
        c.placeholder = "Note can't be empty...";
        saveEl.innerHTML = "x";
        const errTxt = "Can't submit empty content";
        errObbj(errTxt);
        setTimeout(()=> {
            c.placeholder = "Take a note..."

            //re-enable click
            const newSaveBtn = `<span class="save" onclick="saveNote()" id="save"> Done</span>`
            preventClick("on", "save", newSaveBtn); 
        
        } , 2000) ;
        return
    }

    try {
        const res = await fetch(("/.netlify/functions/app/newNote"), {
            method: "POST",
            headers:  {"Content-type" : "application/json"},
            body: JSON.stringify({ACCESSTOKEN, title , content, createTime, })
        })

        if (res.ok) {

            const result = await res.json();
            if (result.accessToken) {
                ACCESSTOKEN = result.accessToken;
            }
            titleEl.value = "" ;
            contentEl.value = "";
            saveEl.innerHTML = done;


            const nId = result.id;

            addToTop(nId, title, content, createTime) ;

            setTimeout(() => {
               preventClick("on", "save", saveBtn);
            }, 2000);

        } else {
            const errTxt="could not save note. try again later..."
            preventClick("on", "save", saveBtn);

            errObbj(errTxt);

            throw new Error("Network response was not okay") ;  
        }
    } 

    catch (error) {
       console.log("Error:", error);
    }
}


const serverDel = async (i) => {

     const id = i;
     const spinner = `<svg class="spinner" width="25px" height="25px" fill="#96c703"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1v2a7 7 0 1 1-7 7H1a9 9 0 1 0 9-9"/></svg>`;
     const delId = `del${i}`;
     const delEl = document.getElementById(delId);
     delEl.innerHTML = spinner ;
     preventClick("off", delId , null);

  try {  
        const res = await fetch(("/.netlify/functions/app/delNote") , {
            method: "POST" ,
            headers: {"Content-type": "application/json" } ,
            body: JSON.stringify({ACCESSTOKEN , id}) 
        })

        if (res.status===500) {
            const errTxt = "Could not delete note. Please try again later";
            errObbj(errTxt);
            preventClick("on", delId, delBtn(i) );
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
            delNote(i)
        }
        

    } catch (err) {
        console.log(err);

    }
}

const delNote = (index) => {
    const target = "nt"+index;
    const targetEl = document.getElementById(target);
    
    if (targetEl) {
        targetEl.remove() ;
    }

    
}

const editMode = (i) => {
    const liTarget = document.getElementById(`nt${i}`);
    const titleTarget = document.getElementById(`tit${i}`);
    const contentTarget = document.getElementById(`cont${i}`);

    const titlebox = `<input type="text" style="background-color:#edf9cc" class="bold editTitle" id="titE${i}" value="${titleTarget.innerHTML}" />` ;
    const contentbox = `<textarea id="contE${i}" style="background-color:#edf9cc" class="content">${contentTarget.innerHTML.replaceAll("<br>", "\n")} </textarea> ` ;
    const donebox = `<span id="editMode${i}" class="float"><span class="floatbuttonDark" id="dn${i}" onclick="serverEdit(${i})">${donebig}</span></span>`;
    
    const editbox = `<div class='titleCon'>${titlebox}${donebox}</div>${contentbox}`;

    liTarget.innerHTML = editbox ;

    const inputt = document.getElementById(`titE${i}`);
    inputt.focus();
    inputt.setSelectionRange(inputt.value.length, inputt.value.length);



}

const serverEdit = async (i) => {

     const id = i;
     const titleEl = document.getElementById(`titE${i}`);
     const contentEl = document.getElementById(`contE${i}`);

     const title = titleEl.value;
     const content = contentEl.value;
     const createTime = new Date().toISOString() ;
     const nId = getLatestId();



     const spinner = `<svg class="spinner" width="25px" height="25px" fill="#96c703"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1v2a7 7 0 1 1-7 7H1a9 9 0 1 0 9-9"/></svg>`;
     const donebox = `<span class="float"><span class="floatbuttonDark" id="dn${i}" onclick="serverEdit(${i})">${donebig}</span></span>`;
     const dnId = `dn${i}`;
     const dnEl = document.getElementById(dnId);
     dnEl.innerHTML = spinner ;
     preventClick("off" , dnId , null);

  try {  
        const res = await fetch(("/.netlify/functions/app/editNote") , {
            method: "POST" ,
            headers: {"Content-type": "application/json" } ,
            body: JSON.stringify({ACCESSTOKEN, nId, id, title, content, createTime }) 
        })

        if (res.status===500) {     
            const errTxt = "Can't connect to server. Please try again."
            errObbj(errTxt);
            const dnBigButton = `<span class="floatbuttonDark" id="dn${i}" onclick="serverEdit(${i})">${donebig}</span>`;
            preventClick("on", dnId, dnBigButton ) ;
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
            addToTop(nId, title, content, createTime);
            delNote(i);
            console.log("note Edited!", result);
        }

    } catch { 
        
    }


}



