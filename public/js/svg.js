
export const icons = [
    {
        name:"logo",
        svg: (size, color) => ` <svg width="${size?size:25}px" viewBox="0 0 277 103" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M42.4026 24.1251C44.2927 24.1251 45.926 25.2184 46.6981 26.8038L41.3425 34.9262V30.9777H5.69785V37.5667H39.6014L36.1258 42.8379H5.69785V49.4269H31.7811L28.3053 54.6982H5.69785V61.2872H26.4749L25.8761 66.5584H5.69785V73.1474H41.3425V66.5584H29.542L35.9349 62.8974L35.9697 62.9202L37.0465 61.2872H41.3425V54.772L47.1729 45.9297V75.2559C47.1729 77.876 45.0371 80 42.4026 80H4.77029C2.13573 80 3.84187e-08 77.876 0 75.2559V28.8692C7.17149e-07 26.2491 2.13574 24.1251 4.77029 24.1251H42.4026ZM58 25.7578L34.6024 61.242L34.5804 61.2277L28.0862 64.9467L28.9272 57.5409L28.8403 57.4844L52.238 22L58 25.7578Z" fill="${color?color:'#96C703'}"/>
            </svg>`
    },
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
        svg: (size , color) => `<svg class="spinner" width="${size}px" height="${size}px" fill="${color?color:'#edf9cc'}"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1v2a7 7 0 1 1-7 7H1a9 9 0 1 0 9-9"/></svg>`

    },
    {
        name:"check",
        svg: (size , color) => `<svg height="${size?size:'20'}px" fill="${color?color:'#edf9cc'}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="m5 16.577 2.194-2.195 5.486 5.484L24.804 7.743 27 9.937l-14.32 14.32z"/></svg>`
    },
    {
        name:"delete",
        svg: (size, color, height) => `<svg width="${size?size:'30'}px" height="${height?height:size?size:'25'}px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="${color?color:'#96c703'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="${color?color:'#96c703'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="${color?color:'#96c703'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="${color?color:'#96c703'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="${color?color:'#96c703'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
    },
    {
        name:"edit",
        svg: (size, color, height) => `<svg width="${size?size:'30'}px" height="${height?height:size?size:'25'}px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.848 1.879a3 3 0 0 0-4.243 0L2.447 16.036a3 3 0 0 0-.82 1.533l-.587 2.936a2 2 0 0 0 2.353 2.353l2.936-.587a3 3 0 0 0 1.533-.82L22.019 7.293a3 3 0 0 0 0-4.243zm-2.829 1.414a1 1 0 0 1 1.415 0l1.171 1.171a1 1 0 0 1 0 1.415L17.933 8.55l-2.585-2.586zm-4.086 4.086L3.862 17.45a1 1 0 0 0-.274.51l-.587 2.936 2.935-.587a1 1 0 0 0 .511-.274L16.52 9.964z" fill="${color?color:'#96c703'}"/></svg>`
    },
    {
        name:"custom-loader",
        svg: (size) => `<div class="frame"> <div class="note-page"> <div class="line l1"></div> <div class="line l2"></div><div class="line l3"></div><div class="pen"><div class="pen-body"></div><div class="pen-tip"></div></div></div> </div>`
    },
    {
        name: "more", 
        svg: (size=171, color='#96c703') => `<svg width="${size*(54/171)}" height="${size}" viewBox="9.2 3.2 5.6 17.6" fill="${color}" xmlns="http://www.w3.org/2000/svg" stroke="${color}"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><title/><path d="M12 16a2 2 0 1 1-2 2 2 2 0 0 1 2-2ZM10 6a2 2 0 1 0 2-2 2 2 0 0 0-2 2Zm0 6a2 2 0 1 0 2-2 2 2 0 0 0-2 2Z"/></svg>`
    },
    {
        name: "copy",
        svg: (size=25, color='#96c703', height) => `<svg width="${size}" height="${height?height:size}" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" fill="${color}"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M48.186 92.137c0-8.392 6.49-14.89 16.264-14.89s29.827-.225 29.827-.225-.306-6.99-.306-15.88c0-8.888 7.954-14.96 17.49-14.96 9.538 0 56.786.401 61.422.401s8.397 1.719 13.594 5.67c5.196 3.953 13.052 10.56 16.942 14.962s5.532 6.972 5.532 10.604c0 3.633 0 76.856-.06 85.34-.059 8.485-7.877 14.757-17.134 14.881s-29.135.124-29.135.124.466 6.275.466 15.15-8.106 15.811-17.317 16.056-71.944-.49-80.884-.245-16.975-6.794-16.975-15.422.274-93.175.274-101.566zm16.734 3.946-1.152 92.853a3.96 3.96 0 0 0 3.958 4.012l73.913.22a3.865 3.865 0 0 0 3.91-3.978l-.218-8.892a1.99 1.99 0 0 0-2.046-1.953s-21.866.64-31.767.293-16.672-6.807-16.675-15.516.003-69.142.003-69.142a1.99 1.99 0 0 0-2.007-1.993l-23.871.082a4.077 4.077 0 0 0-4.048 4.014zm106.508-35.258c-1.666-1.45-3.016-.84-3.016 1.372v17.255c0 1.106.894 2.007 1.997 2.013l20.868.101c2.204.011 2.641-1.156.976-2.606zm-57.606.847a2 2 0 0 0-2.02 1.988l-.626 96.291a2.97 2.97 0 0 0 2.978 2.997l75.2-.186a2.054 2.054 0 0 0 2.044-2.012l1.268-62.421a1.95 1.95 0 0 0-1.96-2.004s-26.172.042-30.783.042-7.535-2.222-7.535-6.482-.088-25.965-.088-25.965a2.033 2.033 0 0 0-2.015-2.018z" stroke="${color}" fill-rule="evenodd"/></svg>`
    },
    {
        name: "expand",
        svg: (size=25, color='#96c703', height) => `<svg width="${size}" height="${height?height:size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M20 14v2.8c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C18.48 20 17.92 20 16.8 20H14M10 4H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C4 5.52 4 6.08 4 7.2V10m11-1 6-6m0 0h-6m6 0v6M9 15l-6 6m0 0h6m-6 0v-6" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    }
]


export const geticon = (name, size, color, height) => {
   const icon = icons.find(icon => icon.name === name);
   return icon ? icon.svg(size, color, height) : null;
}