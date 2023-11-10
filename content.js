let isMenuOpen = false;

setTimeout(() => {
  document.styleSheets[0].insertRule(`
    @keyframes appear {
      from {
        opacity: 0;
        transform: scale(0.32)
      }
      to {
        opacity: 1;
        transform: scale(1)
      }
    }
  `);

  const menu = document.createElement("img");
  menu.src =
    "https://raw.githubusercontent.com/lnardon/Demoiselle/main/logo-bg.png";
  menu.style.position = "fixed";
  menu.style.bottom = "2rem";
  menu.style.left = "2rem";
  menu.style.width = "2.5rem";
  menu.style.height = "2.5rem";
  menu.style.borderRadius = "0.5rem";
  menu.style.boxShadow = "0px 0px 19px 7px rgba(0,0,0,0.29)";
  menu.style.zIndex = "999999999";
  menu.style.cursor = "pointer";
  menu.style.animation =
    "appear .7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";
  document.body.append(menu);

  menu.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "getTabs" }, function (response) {
      if (isMenuOpen) {
        document.getElementById("tabs-list-container").style.animation =
          "tabsAppear .3s ease reverse";
        isMenuOpen = false;
        // setTimeout(() => {
        document.getElementById("tabs-list-container").remove();
        // }, 300);
        return;
      } else {
        displayTabs(response.tabs);
        document.getElementById("tabs-list-container").style.animation =
          "tabsAppear .3s ease normal forwards";
        isMenuOpen = true;
      }
    });
  });

  function displayTabs(tabs) {
    let tabsContainer = document.getElementById("tabs-list-container");
    if (!tabsContainer) {
      document.styleSheets[0].insertRule(
        ".tabContainer:hover{background-color: #cccee6}"
      );
      tabsContainer = document.createElement("div");
      tabsContainer.id = "tabs-list-container";
      tabsContainer.style.position = "fixed";
      tabsContainer.style.bottom = "5rem";
      tabsContainer.style.left = "2rem";
      tabsContainer.style.width = "15rem";
      tabsContainer.style.maxHeight = "20rem";
      tabsContainer.style.backgroundColor = "#eee";
      tabsContainer.style.boxShadow = "0px 0px 19px 7px rgba(0,0,0,0.2)";
      tabsContainer.style.zIndex = "1000000000";
      tabsContainer.style.padding = "0.25rem";
      tabsContainer.style.borderRadius = "0.25rem";
      tabsContainer.style.border = "0.25rem solid #fafafa";
      tabsContainer.style.animation = "tabsAppear .3s ease forwards";
      document.body.appendChild(tabsContainer);
    }
    document.styleSheets[0].insertRule(`
        @keyframes tabsAppear {
          from {
            opacity: 0;
            clip-path: polygon(0% 84.4%, 0% 100%,8.6% 100%,8.7% 84.4%);
          }
          to {
            opacity: 1;
            clip-path: polygon(0% 0%, 0% 100%,100% 100%,100% 0%)
          }
        }
      `);

    tabsContainer.innerHTML = "";

    tabs.forEach((tab) => {
      const tabElement = document.createElement("div");
      tabElement.style.padding = "0.5rem";
      tabElement.style.borderBottom = "1px solid #ccc";
      tabElement.style.backgroundColor = "#fafafa";

      if (tab.active) {
        tabElement.style.backgroundColor = "#ccc";
      }

      const title = document.createElement("div");
      title.textContent = tab.title;
      title.style.fontWeight = "bold";
      title.style.color = "#232323";
      title.style.whiteSpace = "nowrap";
      title.style.overflow = "hidden";
      title.style.textOverflow = "ellipsis";
      title.style.width = "100%";

      const url = document.createElement("div");
      url.textContent = tab.url;
      url.style.fontSize = "0.8rem";
      url.style.color = "#555";

      tabElement.appendChild(title);
      // tabElement.appendChild(url);
      tabElement.style.cursor = "pointer";
      tabElement.style.borderRadius = "0.25rem";
      tabElement.style.transition = "all .3s ease";
      tabElement.classList.add("tabContainer");

      tabElement.addEventListener("click", () => {
        isMenuOpen = false;
        document.getElementById("tabs-list-container").remove();
        chrome.runtime.sendMessage({ action: "switchTab", tabId: tab.id });
      });

      tabsContainer.appendChild(tabElement);
    });
  }
}, 250);
