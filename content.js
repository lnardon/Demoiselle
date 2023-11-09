setTimeout(() => {
    const menu = document.createElement("img");
    menu.src = "./logo.png";
    menu.style.position = "fixed";
    menu.style.bottom = "2rem";
    menu.style.left = "2rem";
    menu.style.width = "3rem";
    menu.style.height = "3rem";
    menu.style.borderRadius = "50%";
    menu.style.backgroundColor = "lightgrey";
    menu.style.boxShadow = "0px 0px 19px 7px rgba(0,0,0,0.2)";
    menu.style.zIndex = "999999999";
    document.body.append(menu);
},3000)
