
const defaultNote = (user) =>  {
    const Notes = [
        {
            userId: null,
            id: 1,
            title: "Welcome to Noterrific",
            content: `Hey ${user} welcome! \nThis is your personal notebook where you can write, save, and organize your thoughts, ideas, or to-dos.\n You can add as many notes as you like, and everything you write stays right here. \nNoterrific is secure, private to you and all about You!`
        }, 
        {
            userId: null,
            id: 2,
            title: ' Create Your First Note',
            content: `Click on the textbox to start writing. \nEach note can have a title and body text, and you can edit or delete them anytime. \nTry it out. write something quick like “My goals for this week” or “Ideas for my next project.”`
        },
        {
            userId: null,
            id: 3,
            title: 'Tips & Tricks',
            content: `- Hover or long press on a note to see extra options (like edit or delete). \n- Notes save instantly. \n- You can pin important notes or search through your list anytime`
        },
        {
            userId: null,
            id: 4,
            title: 'Heads Up!',
            content: `These sample notes are just here to get you started. \nOnce you create your first real note, they’ll disappear automatically making room for your own ideas. \nGo ahead and make your first one now! `
        }

    ]

    return Notes
}       


export default defaultNote