let isMenuOpen = false;

setTimeout(() => {
  document.styleSheets[0].insertRule(menuAppear);
  document.styleSheets[0].insertRule(tabsAppear);
  document.styleSheets[0].insertRule(backdrop);
  document.styleSheets[0].insertRule(input);

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
    "menuAppear .7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";
  document.body.append(menu);

  menu.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "getTabs" }, function (response) {
      if (isMenuOpen) {
        document.getElementById("tabs-list-container").style.animation =
          "tabsAppear .3s ease reverse";
        isMenuOpen = false;
        document.getElementById("tabs-list-container").remove();
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
      tabsContainer.style.padding = "0.25rem 0.125rem";
      tabsContainer.style.borderRadius = "0.25rem";
      tabsContainer.style.border = "0.25rem solid #fafafa";
      tabsContainer.style.animation = "tabsAppear .3s ease forwards";
      tabsContainer.style.display = "flex";
      tabsContainer.style.flexDirection = "column";
      tabsContainer.style.gap = "0.25rem";
      document.body.appendChild(tabsContainer);
    }
    tabsContainer.innerHTML = "";

    tabs.forEach((tab) => {
      const tabElement = document.createElement("div");
      tabElement.style.padding = "0.5rem";
      tabElement.style.borderBottom = "1px solid #ccc";
      tabElement.style.backgroundColor = "#fafafa";
      tabElement.style.display = "flex";
      tabElement.style.flexDirection = "row";
      tabElement.style.gap = "0.5rem";
      tabElement.style.cursor = "pointer";
      tabElement.style.borderRadius = "0.25rem";
      tabElement.style.transition = "all .3s ease";
      tabElement.classList.add("tabContainer");
      tabElement.addEventListener("click", () => {
        isMenuOpen = false;
        document.getElementById("tabs-list-container").remove();
        chrome.runtime.sendMessage({
          action: "switchTab",
          tabId: tab.id,
        });
      });

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
      tabElement.appendChild(title);

      const closeButton = document.createElement("span");
      closeButton.textContent = "X";
      closeButton.style.cursor = "pointer";
      closeButton.style.padding = "0 0.5rem";
      closeButton.style.color = "red";
      closeButton.style.fontWeight = "bold";
      closeButton.addEventListener("click", function (event) {
        event.stopPropagation();
        isMenuOpen = false;
        document.getElementById("tabs-list-container").remove();
        chrome.runtime.sendMessage({ action: "closeTab", tabId: tab.id });
      });

      tabElement.appendChild(closeButton);
      tabsContainer.appendChild(tabElement);
    });
  }
}, 250);

document.addEventListener("keydown", function (event) {
  if (event.altKey && event.key === "s") {
    event.preventDefault();

    if (!document.getElementById("customSearchInput")) {
      const backdrop = document.createElement("div");
      backdrop.style.position = "fixed";
      backdrop.style.top = "0";
      backdrop.style.left = "0";
      backdrop.style.width = "100vw";
      backdrop.style.height = "100vh";
      backdrop.style.zIndex = "9999";
      backdrop.style.backgroundColor = "rgba(0,0,0,0.72)";
      backdrop.style.animation = "backdrop .3s ease forwards";
      document.body.appendChild(backdrop);

      const input = document.createElement("input");
      input.id = "customSearchInput";
      input.style.position = "fixed";
      input.style.top = "50%";
      input.style.left = "50%";
      input.style.transform = "translate(-50%, -50%)";
      input.style.zIndex = 10000;
      input.style.width = "90%";
      input.style.maxWidth = "35rem";
      input.style.fontSize = "2rem";
      input.style.border = "0.125rem solid #212121";
      input.style.borderRadius = "0.5rem";
      input.style.boxShadow = "0px 0px 2rem 1rem rgba(0, 0, 0, 0.5)";
      input.style.padding = "0.75rem 1rem";
      input.style.boxSizing = "border-box";
      input.style.animation = "input .3s ease forwards";
      input.style.backgroundColor = "#fafafa";
      input.style.color = "#191919";
      input.style.textDecoration = "none";
      input.style.outline = "none";
      input.style.fontWeight = "bold";

      document.body.appendChild(input);
      input.focus();

      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          const searchTerm = encodeURIComponent(input.value);
          const googleUrl = `https://www.google.com/search?q=${searchTerm}`;
          input.remove();
          backdrop.remove();
          chrome.runtime.sendMessage({ action: "openGoogle", url: googleUrl });
        }
        if (e.key === "Escape") {
          backdrop.remove();
          input.remove();
        }
      });
    }
  }
});

// CSS ANIMATIONS
const menuAppear = `
  @keyframes menuAppear {
    from {
      opacity: 0;
      transform: scale(0.32)
    }
    to {
      opacity: 1;
      transform: scale(1)
    }
  }
`;

const tabsAppear = `
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
`;

const backdrop = `
  @keyframes backdrop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const input = `
  @keyframes input {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.32) translateY(2rem);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1) translateY(0rem);
    }
  }
`;
