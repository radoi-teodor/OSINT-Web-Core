class ContextMenu {
  constructor({ target = null, menuItems = [], mode = "dark" }) {
    this.target = target;
    this.menuItems = menuItems;
    this.mode = mode;
    this.targetNode = this.getTargetNode();
    this.menuItemsNode = this.getMenuItemsNode();
    this.isOpened = false;
  }

  getTargetNode() {
    const nodes = document.querySelectorAll(this.target);

    if (nodes && nodes.length !== 0) {
      return nodes;
    } else {
      console.error(`getTargetNode :: "${this.target}" target not found`);
      return [];
    }
  }

  getMenuItemsNode() {
    const nodes = [];

    if (!this.menuItems) {
      console.error("getMenuItemsNode :: Please enter menu items");
      return [];
    }

    this.menuItems.forEach((data, index) => {
      const item = this.createItemMarkup(data);
      item.firstChild.setAttribute(
        "style",
        `animation-delay: ${index * 0.08}s`
      );
      nodes.push(item);
    });

    return nodes;
  }

  refreshItems(menuItems = []){
    this.menuItems = menuItems;
    this.menuItemsNode = this.getMenuItemsNode();
    $(this.contextMenu).empty();
    var scrollWidth = 0;
    var scrollHeight = 0;
    for(let i = 0; i < this.menuItemsNode.length; i++){
      this.contextMenu.appendChild(this.menuItemsNode[i])
      scrollHeight += this.menuItemsNode[i].scrollHeight;
      if(scrollWidth<this.menuItemsNode[i].scrollWidth){
        scrollWidth = this.menuItemsNode[i].scrollWidth;
      }
    }
    this.contextMenu.setAttribute(
      "style",
      `--width: ${scrollWidth}px;
      --height: ${scrollHeight}px;
      --top: ${this.contextMenu.offsetTop}px;
      --left: ${this.contextMenu.offsetLeft}px;`
    );
  }

  createItemMarkup(data) {
    const button = document.createElement("BUTTON");
    const item = document.createElement("LI");
    var hasChildren = false;
    if(data.hasOwnProperty('hasChildren')){
      hasChildren = data.hasChildren;
    }

    button.innerHTML = data.content;
    button.classList.add("contextMenu-button");
    button.setAttribute("has-children", hasChildren);

    item.classList.add("contextMenu-item");

    if (data.divider) item.setAttribute("data-divider", data.divider);
    item.appendChild(button);

    if (data.events && data.events.length !== 0) {
      Object.entries(data.events).forEach((event) => {
        const [key, value] = event;
        button.addEventListener(key, value);
      });
    }

    return item;
  }

  renderMenu() {
    var menuContainer = document.createElement("UL");

    menuContainer.classList.add("contextMenu");
    menuContainer.setAttribute("data-theme", this.mode);
    this.menuItemsNode.forEach((item) => menuContainer.appendChild(item));

    return menuContainer;
  }

  closeMenu(menu) {
    if (this.isOpened) {
      this.isOpened = false;
      menu.remove();
    }
  }

  init() {
    this.contextMenu = this.renderMenu();
    var contextMenuLocal = this.contextMenu;
    document.addEventListener("click", (e) => {
      if((!$(e.target).hasClass('contextMenu')&& !$(e.target).hasClass('contextMenu-button')) || ($(e.target).hasClass('contextMenu-button') && $(e.target).attr('has-children') == 'false')){
        this.closeMenu(contextMenuLocal);
      }
    });
    window.addEventListener("blur", () => {
      this.closeMenu(contextMenuLocal);
    });


    this.targetNode.forEach((target) => {
      target.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (this.isOpened) {
          this.isOpened = false;
          contextMenuLocal.remove();
        }else{
          this.isOpened = true;
          const { clientX, clientY } = e;
          target.appendChild(contextMenuLocal);

          const positionY =
            clientY + this.contextMenu.scrollHeight >= window.innerHeight
              ? window.innerHeight - this.contextMenu.scrollHeight - 20
              : clientY;
          const positionX =
            clientX + this.contextMenu.scrollWidth >= window.innerWidth
              ? window.innerWidth - this.contextMenu.scrollWidth - 20
              : clientX;

          this.contextMenu.setAttribute(
            "style",
            `--width: ${this.contextMenu.scrollWidth}px;
            --height: ${this.contextMenu.scrollHeight}px;
            --top: ${positionY}px;
            --left: ${positionX}px;`
          );
        }
      });
    });
  }
}
