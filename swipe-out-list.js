const SwipeOutList = function(listId, items, options = { contentStyles: {}, backgroundStyles: {}, backgroundImageUrl: null }) {
  /*
    - make public, put demo on github pages
    - write documentation
  */
  const VERTICAL = 1;
  const HORIZONTAL = -1;
  const listElement = document.getElementById(listId);
  const backgroundImg = options.backgroundImageUrl ? `<img src="${options.backgroundImageUrl}" alt="delete" />` : `<svg height="32px" viewBox="0 0 32 32" width="32px">
      <title/><desc/><defs/>
      <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
        <g fill="#929292" id="icon-26-trash-can">
          <path d="M21,6 L25,6 L25,7 L8,7 L8,6 L12,6 L12,5 C12,3.88772964 12.8942627,3 13.9973917,3 L19.0026083,3 C20.1041422,3 21,3.8954305 21,5 L21,6 L21,6 Z M8,8 L8,26.9986131 C8,28.6562333 9.33396149,30 11.0001262,30 L21.9998738,30 C23.6567977,30 25,28.6569187 25,26.9986131 L25,8 L8,8 L8,8 Z M9,9 L9,27.0092049 C9,28.1086907 9.89339733,29 10.9918842,29 L22.0081158,29 C23.1082031,29 24,28.1017876 24,27.0092049 L24,9 L9,9 L9,9 Z M12,11 L12,27 L13,27 L13,11 L12,11 L12,11 Z M16,11 L16,27 L17,27 L17,11 L16,11 L16,11 Z M20,11 L20,27 L21,27 L21,11 L20,11 L20,11 Z M14.0029293,4 C13.4490268,4 13,4.44386482 13,5 L13,6 L20,6 L20,5 C20,4.44771525 19.5621186,4 18.9970707,4 L14.0029293,4 L14.0029293,4 Z" id="trash-can"/>
        </g>
      </g>
    </svg>
  `;
  let touchStart = null;
  let movedTo = null;
  let movingElement = null;
  let axis = null;

  const findContentParent = function(element) {
    while(element.parentNode && element.className !== 'swipe-out-list-content') {
      element = element.parentNode;
    }
    return element;
  };

  const handleTouchMove = function(e) {
    movedTo = e.changedTouches[0].clientX;
    if(axis === null || axis === VERTICAL) {
      let difX = touchStart.clientX - movedTo;
      let difY = touchStart.clientY - e.changedTouches[0].clientY;
      if(difX < 0) { 
        difX *= -1; 
      }
      if(difY < 0) { 
        difY *= -1; 
      }
      if(difX > difY) {
        axis = HORIZONTAL;
      } else {
        axis = VERTICAL;
      }
      return;
    }

    if(!movingElement) {
      movingElement = e.target.className === 'swipe-out-list-content' ? e.target : findContentParent(e.target);
    }

    if(touchStart.clientX > movedTo) {
      movingElement.style.transform = `translate3d(${-Math.abs(touchStart.clientX - movedTo)}px, 0px, 0px)`;
    } else {
      movingElement.style.transform = `translate3d(${Math.abs(touchStart.clientX - movedTo)}px, 0px, 0px)`;
    }
  };

  const handleTouchEnd = function(e) {
    
    if(movingElement) {
      let translate3dX = parseInt(movingElement.style.transform.split('(')[1]);
      if(Math.abs(translate3dX) > movingElement.offsetWidth/3) {
        movingElement.dispatchEvent(new CustomEvent('swipedout', { bubbles: true, detail: movingElement }));
        swipeOut(translate3dX, movingElement);
      } else {
        snapBack(translate3dX, movingElement);
      }
    }
    axis = null;
    movingElement = null;
  };

  const composeListItem = function(content) {
    let listItem = document.createElement('div');
    listItem.className = 'swipe-out-list-item';
    listItem.style.cssText = `
      position: relative;
      height: ${options.contentStyles.height || '100px'};
      transition: height .5s;
    `;
    let contentElement = document.createElement('div');
    contentElement.className = 'swipe-out-list-content';
    contentElement.style.cssText = `
      box-sizing: border-box;
      display: ${options.contentStyles.display || 'flex'};
      align-items: ${options.contentStyles.alignItems || 'center'};
      padding-left: ${options.contentStyles.paddingLeft || '5px'};
      background-color: ${options.contentStyles.backgroundColor || 'white'};
      position: ${options.contentStyles.position || 'absolute'};
      top: ${options.contentStyles.top || 0};
      left: ${options.contentStyles.left || 0};
      border-bottom: ${options.contentStyles.borderBottom || 'solid 1px #b9b6b6'};
      min-height: ${options.contentStyles.minHeight || '2em'};
      width: ${options.contentStyles.width || '100%'};
      height: ${options.contentStyles.height || '100%'};
      justify-content: ${options.contentStyles.justifyContent || 'flex-start'};
    `;
    if(content.nodeType === Node.ELEMENT_NODE) {
      contentElement.appendChild(content);
    } else {
      contentElement.innerText = content;
    }
    
    listItem.appendChild(contentElement);
    let backgroundElement = document.createElement('div');
    backgroundElement.className = 'swipe-out-list-background';
    backgroundElement.style.cssText = `
      display: ${options.backgroundStyles.display || 'flex'};
      align-items: ${options.backgroundStyles.alignItems || 'center'};
      justify-content: ${options.backgroundStyles.justifyContent || 'space-between'};
      transition: all 0.5s;
      z-index: ${options.backgroundStyles.zIndex || -1};
      background-color: ${options.backgroundStyles.backgroundColor || '#ff0000d9'};
      position: ${options.backgroundStyles.position || 'absolute'};
      top: ${options.backgroundStyles.top || 0};
      left: ${options.backgroundStyles.left || 0};
      width: ${options.backgroundStyles.width || '100%'};
      height: ${options.backgroundStyles.height || '100%'};
    `;
    
    backgroundElement.innerHTML = `
      <div style="transition: all .5s; padding: 10px;">
        ${backgroundImg}
      </div>
      <div style="transition: all .5s; padding: 10px;">
        ${backgroundImg}
      </div>
    `;
    
    
    listItem.appendChild(backgroundElement);
    return listItem;
  };

  const snapBack = function(currentTransform, element) {
    let interval = setInterval(function() {
      if(currentTransform > 0) {
        element.style.transform = `translate3d(${currentTransform - 5}px, 0px, 0px)`;
        currentTransform -= 5;
      } else {
        element.style.transform = `translate3d(${currentTransform + 5}px, 0px, 0px)`;
        currentTransform += 5;
      }

      if(Math.abs(currentTransform) <= 5) {
        element.style.transform = `translate3d(0px, 0px, 0px)`;
        clearInterval(interval);
      }
      
      if(currentTransform === 0) {
        clearInterval(interval);
      }
    }, 10);
  };

  const swipeOut = function(currentTransform, element) {
    let interval = setInterval(function() {
      if(currentTransform > 0) {
        element.style.transform = `translate3d(${currentTransform + 5}px, 0px, 0px)`;
        currentTransform += 5;
      } else {
        element.style.transform = `translate3d(${currentTransform - 5}px, 0px, 0px)`;
        currentTransform -= 5;
      }
      
      if(Math.abs(currentTransform) >= element.offsetWidth + 20) {
        const parent = element.parentNode;
        parent.removeChild(element);
        parent.style.height = '0px';
        parent.children[0].children[0].style.opacity = 0;
        parent.children[0].children[1].style.opacity = 0;
        setTimeout(function() {
          parent.parentNode.removeChild(parent);
        }, 500);
        clearInterval(interval);
      }
    }, 5);
  };

  if(!options.contentStyles) {
    options.contentStyles = {};
  }
  if(!options.backgroundStyles) {
    options.backgroundStyles = {};
  }

  for (let i = 0; i < items.length; i++) {
    let newItem = composeListItem(items[i]);
    let newItemsContent = newItem.children[0];
    newItemsContent.addEventListener('touchstart', function(e) {
      touchStart = e.touches[0];
    });
    newItemsContent.addEventListener('touchmove', handleTouchMove);
    newItemsContent.addEventListener('touchend', handleTouchEnd);
    listElement.appendChild(newItem);
  }

};


