
const icons = [
    {
        name: "okay",
        svg: (size) => `<svg width="${size}px" height="${size}px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10m-5.97-3.03a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47 2.235-2.235L14.97 8.97a.75.75 0 0 1 1.06 0" fill="#30992e"/></svg> `
    },
    {
        name: "wrong",
        svg: (size) => `<svg  width="${size}px" height="${size}px" fill="red" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.188 4.781c6.188 0 11.219 5.031 11.219 11.219s-5.031 11.188-11.219 11.188-11.188-5-11.188-11.188 5-11.219 11.188-11.219zM11.25 17.625l3.563 3.594c0.438 0.438 1.156 0.438 1.594 0 0.406-0.406 0.406-1.125 0-1.563l-3.563-3.594 3.563-3.594c0.406-0.438 0.406-1.156 0-1.563-0.438-0.438-1.156-0.438-1.594 0l-3.563 3.594-3.563-3.594c-0.438-0.438-1.156-0.438-1.594 0-0.406 0.406-0.406 1.125 0 1.563l3.563 3.594-3.563 3.594c-0.406 0.438-0.406 1.156 0 1.563 0.438 0.438 1.156 0.438 1.594 0z"></path>
        </svg>`
    },
    {
        name: "eye-open", 
        svg: (size) => `<svg width="${size}px" height="${size}px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path class="eye" fill-rule="evenodd" clip-rule="evenodd" d="m0 8 3.08-3.695a6.405 6.405 0 0 1 9.84 0L16 8l-3.08 3.695a6.405 6.405 0 0 1-9.84 0zm8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6" fill="#000"/></svg>`
    },
    {
        name:"eye-close",
        svg: (size) => `<svg width="${size}px" height="${size}px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path class="eye" d="m19.293 3.293-2.926 2.926A8.5 8.5 0 0 0 12 5c-4.027 0-7.484 2.881-9 7a11.6 11.6 0 0 0 3.015 4.571l-2.722 2.722a1 1 0 1 0 1.414 1.414l16-16a1 1 0 1 0-1.414-1.414M9.3 13.283A2.9 2.9 0 0 1 9 12a3 3 0 0 1 3-3 2.9 2.9 0 0 1 1.283.3Zm10.508-3.677A12.3 12.3 0 0 1 21 12c-1.516 4.119-4.973 7-9 7a8.4 8.4 0 0 1-1.457-.129Z"/></svg>
        ` 
    },
    {
        name:"spinner",
        svg: (size) => `<svg class="spinner" width="${size}px" height="${size}px" fill="#edf9cc"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1v2a7 7 0 1 1-7 7H1a9 9 0 1 0 9-9"/></svg>`

    }
]


const geticon = (name, size) => {
   const icon = icons.find(icon => icon.name === name);
   return icon ? icon.svg(size) : null;
}

const errObbj = (errText) => {
    const noteEl = document.getElementById("pagge");
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

const generateDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    if (window.crypto && window.crypto.randomUUID) {
      deviceId = window.crypto.randomUUID();
    } else {
      // Fallback for older browsers
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);

      // RFC 4122 v4
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;

      deviceId = [...bytes].map((b, i) =>
        (i === 4 || i === 6 || i === 8 || i === 10 ? "-" : "") +
        b.toString(16).padStart(2, "0")
      ).join("");
    }

    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
};



const checkAvailability = async (input,alertbox) => {
    if (input!=="username"&&input!=="email") { console.log(input,alertbox,"exit"); return; } 
    const targetEl = document.getElementById(input);
    const uNameEl = document.getElementById(input);
    const alertEl = document.getElementById(alertbox);
    let uName = uNameEl.value ;
    uName= uName.toLowerCase();

    if (input==="username") { 
        if (alertEl&&uName.length<=3) {
            targetEl.classList.remove("username-available","username-unavailable" );
            alertEl.innerHTML = `${geticon("wrong", 20)} <span class="alerttxt">username can't be less than 3 letters</span>`;
            
            return;
        } 
        if (/[ @~^*!#%&()\-]/.test(uName)) {
            alertEl.innerHTML = `${geticon("wrong", 20)} <span class="alerttxt">username can't contain symbols or space</span>`;
            return ;
        }

    } else {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(uName)) {
            alertEl.innerHTML = `${geticon("wrong", 20)} <span class="alerttxt">enter a valid email address</span>`;
            return ;
        }
    }

    

    try {
    
        const res = await fetch(("/.netlify/functions/app/checkUsername") , {
            method: "POST" ,
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify({uName,input})
        });

        const data = await res.text() ;

        if (data === "unavailable") {
            const classes = targetEl.classList;
            const list = Array.from(classes);
            if (list.includes("okay")) {
                targetEl.classList.remove("okay");
            }
            targetEl.classList.add("wrong") ;
            alertEl.innerHTML = `${geticon("wrong", 20)} <span class="alerttxt">This ${input} is already registered.</span>`;
           


        } else {
            const classes = targetEl.classList;
            const list = Array.from(classes);
            if (list.includes("wrong")) {
                targetEl.classList.remove("wrong");
            }
             targetEl.classList.add("okay") ;
             alertEl.innerHTML = `${geticon("okay", 20)} <span class="alerttxt">This ${input} is ok</span>`;


        }
        
        console.log(data);

    } catch (err) {

    }


}

const togglePassword = (type) => {
    const passEl = document.getElementById("password");
    const rePassEl = document.getElementById("repassword")
    const togglrPassEl = document.getElementById("togglePass");
    if (type==="login") {
        if (passEl.type === "password") {
            passEl.type = "text" ;
            togglrPassEl.innerHTML = geticon("eye-open", 20);
        }  else {
             passEl.type = "password" ;
             togglrPassEl.innerHTML = geticon("eye-close", 20);}
    } else if (passEl.type === "password") {
        passEl.type = "text" ;
        rePassEl.type = "text";
        togglrPassEl.innerHTML = geticon("eye-open", 20);
    } else {
        passEl.type = "password" ;
        rePassEl.type = "password";
        togglrPassEl.innerHTML = geticon("eye-close", 20);
    }
}

const matchPass = () => {
    

    const passEl = document.getElementById("password");
    const rePassEl = document.getElementById("repassword");
    const pass = passEl?passEl.value: ""; ;
    const rePass = rePassEl?rePassEl.value: "";
    const alertEl = document.getElementById("pAlert");

    if (rePass==="") {
        return;
    }



    if (pass!==rePass) {
         passEl.classList.remove("okay","wrong");
         rePassEl.classList.remove("okay","wrong");
         passEl.classList.add("wrong");
         rePassEl.classList.add("wrong");

         alertEl.innerHTML = `${geticon("wrong", 20)} <span class="alerttxt"> password doesn't match</span>`;
         
    } else {
         passEl.classList.remove("okay","wrong");
         rePassEl.classList.remove("okay","wrong");
         passEl.classList.add("okay");
         rePassEl.classList.add("okay");

         alertEl.innerHTML = `${geticon("okay", 20)} <span class="alerttxt"> password match</span>`;
         setTimeout(()=> {
            alertEl.innerHTML = "";
            //rePassEl.classList.remove("okay","wrong");
            //passEl.classList.remove("okay","wrong");
            
         },3000 )
         
    }
}


const LogIn = async () => {
    const deviceId = generateDeviceId() ;
    const usernameEl = document.getElementById("username");
    const passwordEl= document.getElementById("password");
    const usernameCase = usernameEl.value ;
    const username = usernameCase.toLowerCase() ;
    const password = passwordEl.value ; 

    const submitEl = document.getElementById("submit");
    submitEl.innerHTML = geticon("spinner", 30);

    if (username===""||password==="") {
        errObbj("Fields can not be empty");
        submitEl.innerHTML = "submit";
        return;
    }

    try {  
        const res = await fetch(("/.netlify/functions/app/login") , {
            method: "POST" ,
            headers: {"Content-type": "application/json" } ,
            body: JSON.stringify({username, password, deviceId}) 
        })

        if (!res.ok) {
            const errTxt = "Can't connect to server. Please try again.";
            submitEl.innerHTML = "submit";
            errObbj(errTxt); 

        } else {
            const result = await res.json();

            if (!result.status) {
                errObbj(result.message) ;
                submitEl.innerHTML = "submit";
                return;

            } else {
                sessionStorage.setItem("username", result.username);
                window.location.href = "/notes.html";

            }
            
        }
    } catch (err) {
        console.error(err.message);
    }    
    
}

const Register = async () => {
    const deviceId = generateDeviceId() ;
    const usernameEl = document.getElementById("username");
    const passwordEl= document.getElementById("password");
    const emailEl= document.getElementById("email");

    const emailCase = emailEl.value ;
    const email = emailCase.toLowerCase() ;
    const usernameCase = usernameEl.value ;
    const username = usernameCase.toLowerCase() ;
    const password = passwordEl.value ; 

    const submitEl = document.getElementById("submit");
    submitEl.innerHTML = geticon("spinner", 20);

    if (username===""||password===""||email==="") {
        errObbj("Fields can not be empty");
        submitEl.innerHTML = "submit";
        return;
    }

    try {  
        const res = await fetch(("/.netlify/functions/app/register") , {
            method: "POST" ,
            headers: {"Content-type": "application/json" } ,
            body: JSON.stringify({username, email , password, deviceId}) 
        })

        if (!res.ok) {
            const errTxt = "Can't connect to server. Please try again."
            errObbj(errTxt); 
        } else {
            const result = await res.json();
            if (!result.status) {
                errObbj(result.message) ;
                submitEl.innerHTML = "submit";
                return;
            }
            sessionStorage.setItem("username", result.username);
            window.location.href = "/notes.html";
        }
    } catch (err) {
           console.error(err.message);
    }    
    
}

const switchPage = (page,string) => {

    const loginPage = `
            
                <label for="username"> Username</label>
                <input type="text" name="username" id="username" required />
                
                <label for="password"> Password</label>
                <div class="passCon" >
                    <input type="password" name="password" class="password" id="password" required />
                    <span class="togglePass" id="togglePass" onclick="togglePassword('login')"> 
                        ${geticon("eye-close", 20)}
                    </span>
                </div>
            ` ;
    const registerPage = ` <div class="username-container" >
                <label id="welcome" for="username"> Username</label>
                <input type="text" oninput="checkAvailability('username','uAlert')" class="username" name="username" id="username" required />
                <div class="alert" id="uAlert"></div>
            </div>

            <div class="email-container">
                <label for="email"> E-mail</label>
                <input type="email" class="email" name="email" oninput="checkAvailability('email','eAlert')" id="email" required />
                <div class="alert" id="eAlert"></div>
            </div>

            <label for="password"> Password</label>
            <div class="passCon" >
                <input type="password" name="password" oninput="matchPass()" class="password" id="password" required />
                <span class="togglePass" id="togglePass" onclick="togglePassword()"> 
                    ${geticon("eye-close", 20)}
                </span>
            </div>
        
            <div class="passCheck" >
                <label for="repassword"> Confirm Password</label>
                <input type="password" name="repassword" oninput="matchPass()" class="repassword" id="repassword" required />
                <div class="pass-alert" id="pAlert"></div> 
            </div>
        ` ;
        

    const pageEl = document.getElementById("page");
    const welcomeEl = document.getElementById("welcome");
    const clickyEl = document.getElementById("clicky");
    const submitConEl = document.getElementById("submitCon");

    if (page === "login") {
        pageEl.style.height= "185px" ;
        pageEl.style.opacity = "0" ;
        welcomeEl.style.opacity = "0" ;
        clickyEl.style.opacity = "0" ;

        setTimeout(() => {
            pageEl.innerHTML = loginPage;
            welcomeEl.innerHTML = string? string : "Welcome back please login" ;
            clickyEl.innerHTML = `New user <a class="clicky" onclick="switchPage('signup')">click here</a> to register`;
            submitConEl.innerHTML =`<span onclick="LogIn()" id="submit" class="submitbtn">submit</span>`;
        }, 800)
        
        setTimeout(() => {
            pageEl.style.opacity = "1" ;
            welcomeEl.style.opacity = "1" ;
            clickyEl.style.opacity = "1" ;
        }, 900)

        
    } else if (page === "signup") {
        pageEl.style.height= "370px" ;
        pageEl.style.opacity = "0" ;
        welcomeEl.style.opacity = "0" ;
        clickyEl.style.opacity = "0" ;

        setTimeout(() => {
            pageEl.innerHTML = registerPage;
            welcomeEl.innerHTML = string? string : "New user, please register" ;
            clickyEl.innerHTML = `Already have an account? <a class="clicky" onclick="switchPage('login')">click here</a> to log in`;
            submitConEl.innerHTML =`<span onclick="Register()" id="submit" class="submitbtn">submit</span>`;
        }, 900)

        setTimeout(() => {
            pageEl.style.opacity = "1" ;
            welcomeEl.style.opacity = "1" ;
            clickyEl.style.opacity = "1" ;
           
        }, 1000)

       

    }


}


const loader = () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    const logout = params.get("logout");
    
    const validity = sessionStorage.getItem("validate"); 

    if (document.cookie.includes("has_auth=true")) {
        window.location.href = "/notes.html";
        return;
    }
    if (page==="invalidated") {   
        switchPage('login', "you must log in first");
        sessionStorage.removeItem("validity") ;
    } else if (page==="login") {
        switchPage('login') ;
    } else if (page==="signup") {
        switchPage('signup');
    } else if (logout==="true") {
        switchPage('login', "Logged out successfully. You can log in again below.");
    }
}

window.onload = loader();