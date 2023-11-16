let isMenuOpen = false;
const backdrop = document.createElement("div");
backdrop.id = "backdrop";
backdrop.classList.add("demoiselleContainer");
backdrop.style.top = "0";
backdrop.style.left = "0";
backdrop.style.width = "100%";
backdrop.style.height = "100%";
backdrop.style.zIndex = "9999";
backdrop.style.backgroundColor = "rgba(0,0,0,0.8)";
backdrop.style.animation = "backdrop .5s ease forwards";
backdrop.style.fontFamily = "DejaVu Sans, sans-serif";

setTimeout(() => {
  let styles = document.createElement("style");
  styles.textContent =
    menuAppearAnim +
    tabsAppearAnim +
    backdropAnim +
    inputAnim +
    ".pageBtn{background-color: transparent; border: none; transition: all .5s ease}" +
    ".pageBtn:hover{background-color: #fafafa !important; transform: scale(1.05)}" +
    ".demoiselleContainer { position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; background-color: rgba(0,0,0,0.72); z-index: 999999999; box-sizing: border-box; }" +
    ".tabContainer{background-color: #151515}" +
    ".tabContainer:hover{background-color: #333639}";
  document.head.appendChild(styles);
}, 250);

document.addEventListener("keydown", function (event) {
  if (event.altKey && event.key === "s" && !isMenuOpen) {
    event.preventDefault() && event.stopPropagation();

    const extensionContent = document.createElement("div");
    extensionContent.id = "extensionContent";
    extensionContent.style.position = "relative";
    extensionContent.style.fontFamily = "DejaVu Sans !important";

    chrome.runtime.sendMessage({ action: "getTabs" }, function (response) {
      let tabs = response.tabs;
      let tabsContainer = document.getElementById("tabs-list-container");
      tabsContainer = document.createElement("div");
      tabsContainer.id = "tabs-list-container";
      tabsContainer.style.width = "100%";
      tabsContainer.style.backgroundColor = "#252525";
      tabsContainer.style.boxShadow = "0px 0px 15px 5px rgba(171,171,171,0.15)";
      tabsContainer.style.zIndex = "1000000000";
      tabsContainer.style.padding = "16px 12px";
      tabsContainer.style.borderRadius = "8px";
      tabsContainer.style.border = "2px solid #eee";
      tabsContainer.style.animation = "input .5s ease forwards";
      tabsContainer.style.display = "flex";
      tabsContainer.style.flexDirection = "column";
      tabsContainer.style.gap = "8px";
      tabsContainer.style.overflow = "auto";
      tabsContainer.style.boxSizing = "border-box";

      tabs.forEach((tab) => {
        const tabElement = document.createElement("div");
        tabElement.classList.add("tabContainer");
        tabElement.style.fontFamily = "sans-serif";
        tabElement.style.padding = "8px";
        tabElement.style.display = "flex";
        tabElement.style.flexDirection = "row";
        tabElement.style.alignItems = "center";
        tabElement.style.justifyContent = "center";
        tabElement.style.gap = "8px";
        tabElement.style.cursor = "pointer";
        tabElement.style.borderRadius = "4px";
        tabElement.style.transition = "all .1s ease";
        tabElement.style.borderLeft = "6px solid transparent";
        tabElement.classList.add("tabContainer");
        tabElement.addEventListener("click", () => {
          closeExtension();
          chrome.runtime.sendMessage({
            action: "switchTab",
            tabId: tab.id,
          });
        });

        if (tab.active) {
          tabElement.style.borderColor = "#2196f3";
        }

        const favicon = document.createElement("img");
        favicon.src = tab.favIconUrl;
        favicon.style.width = "16px";
        favicon.style.height = "16px";
        tabElement.appendChild(favicon);

        const title = document.createElement("div");
        title.textContent = tab.title;
        title.style.fontFamily = "DejaVu Sans";
        title.style.fontWeight = "500";
        title.style.color = "#fafafa";
        title.style.whiteSpace = "nowrap";
        title.style.overflow = "hidden";
        title.style.textOverflow = "ellipsis";
        title.style.width = "100%";
        tabElement.appendChild(title);

        const closeButton = document.createElement("img");
        closeButton.src =
          "https://raw.githubusercontent.com/lnardon/Demoiselle/main/assets/close.png";
        closeButton.style.cursor = "pointer";
        closeButton.style.width = "22px";
        closeButton.style.height = "22px";
        closeButton.style.marginLeft = "8px";
        closeButton.addEventListener("click", function (event) {
          event.stopPropagation();
          closeExtension();
          chrome.runtime.sendMessage({ action: "closeTab", tabId: tab.id });
        });
        tabElement.appendChild(closeButton);

        tabsContainer.appendChild(tabElement);
      });
      extensionContent.appendChild(tabsContainer);
      isMenuOpen = true;
    });

    if (!document.getElementById("customSearchInput")) {
      const addressSection = document.createElement("div");
      addressSection.style.zIndex = 10000;
      addressSection.style.width = "100%";
      addressSection.style.display = "flex";
      addressSection.style.flexDirection = "row";
      addressSection.style.gap = "8px";
      addressSection.style.alignItems = "center";
      addressSection.style.justifyContent = "center";
      addressSection.style.animation = "input .5s ease forwards";
      addressSection.style.marginBottom = "16px";

      const addressBar = document.createElement("input");
      addressBar.id = "addressBar";
      addressBar.style.width = "100%";
      addressBar.style.border = "2px solid #212121";
      addressBar.style.borderRadius = "8px";
      addressBar.style.boxShadow = "0px 0px 1rem 0.25rem rgba(0, 0, 0, 0.2)";
      addressBar.style.padding = "12px";
      addressBar.style.boxSizing = "border-box";
      addressBar.style.backgroundColor = "#fafafa";
      addressBar.style.color = "#191919";
      addressBar.style.textDecoration = "none";
      addressBar.style.outline = "none";
      addressBar.style.fontSize = "20px";
      addressBar.style.fontWeight = "500";
      addressBar.style.fontFamily = "DejaVu Sans !important";
      addressBar.value = window.location.href;
      addressBar.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          let url = addressBar.value;
          if (url.substring(0, 4) !== "http") {
            url = "https://" + url;
          }
          closeExtension();
          window.open(url, "_self");
        }
      });

      const backButton = document.createElement("img");
      backButton.id = "backButton";
      backButton.classList.add("pageBtn");
      backButton.src =
        "https://raw.githubusercontent.com/lnardon/Demoiselle/main/assets/arrow.png";
      backButton.style.transform = "rotateY(180deg)";
      backButton.style.borderRadius = "8px";
      backButton.style.border = "none";
      backButton.style.color = "#191919";
      backButton.style.outline = "none";
      backButton.style.width = "55px";
      backButton.style.height = "55px";
      backButton.style.cursor = "pointer";
      backButton.style.transition = ".5s ease";
      backButton.addEventListener("click", function () {
        closeExtension();
        window.history.back();
      });

      const forwardButton = document.createElement("img");
      forwardButton.id = "forwardButton";
      forwardButton.classList.add("pageBtn");
      forwardButton.src =
        "https://raw.githubusercontent.com/lnardon/Demoiselle/main/assets/arrow.png";
      forwardButton.style.width = "55px";
      forwardButton.style.height = "55px";
      forwardButton.style.borderRadius = "8px";
      forwardButton.style.border = "none";
      forwardButton.style.color = "#191919";
      forwardButton.style.outline = "none";
      forwardButton.style.cursor = "pointer";
      forwardButton.style.transition = ".5s ease";
      forwardButton.addEventListener("click", function () {
        closeExtension();
        window.history.forward();
      });

      addressSection.appendChild(addressBar);
      addressSection.appendChild(backButton);
      addressSection.appendChild(forwardButton);
      extensionContent.appendChild(addressSection);

      const input = document.createElement("input");
      input.id = "customSearchInput";
      input.style.zIndex = 10000;
      input.style.width = "100%";
      input.style.fontSize = "32px";
      input.style.border = "2px solid #212121";
      input.style.borderRadius = "0.5rem";
      input.style.boxShadow = "0px 0px 1rem 0.25rem rgba(0, 0, 0, 0.2)";
      input.style.padding = "16px";
      input.style.boxSizing = "border-box";
      input.style.animation = "input .5s ease forwards";
      input.style.backgroundColor = "#fafafa";
      input.style.color = "#191919";
      input.style.textDecoration = "none";
      input.style.outline = "none";
      input.style.fontWeight = "bold";
      input.style.marginBottom = "16px";
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          const searchTerm = encodeURIComponent(input.value);
          const googleUrl = `https://www.google.com/search?q=${searchTerm}`;
          closeExtension();
          chrome.runtime.sendMessage({ action: "openGoogle", url: googleUrl });
        }
        if (e.key === "Escape") {
          e.stopPropagation();
          closeExtension();
        }
      });
      extensionContent.appendChild(input);

      backdrop.appendChild(extensionContent);
      document.body.appendChild(backdrop);
      input.focus();
    }
  }
});

// Helper functions
function closeExtension() {
  backdrop.innerHTML = "";
  backdrop.remove();
  isMenuOpen = false;
}

// CSS ANIMATIONS
const menuAppearAnim = `
  @keyframes menuAppear {
    from {
      opacity: 0;
      transform: scale(0.8)
    }
    to {
      opacity: 1;
      transform: scale(1)
    }
  }
`;

const tabsAppearAnim = `
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

const backdropAnim = `
  @keyframes backdrop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const inputAnim = `
  @keyframes input {
    from {
      opacity: 0;
      transform:scale(0.8) translateY(32px);
    }
    to {
      opacity: 1;
      transform:scale(1) translateY(0px);
    }
  }
`;
