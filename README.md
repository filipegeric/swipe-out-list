# Swipe Out List

[DEMO](https://filipegeric.github.io/swipe-out-list/)

## Description

A simple swipe out list for mobile devices. Written using vanilla JS and touch events.

## Basic Usage

```html
<div id="list"></div>
<script type="text/javascript" src="swipe-out-list.js"></script>
<script>
  let items = ['item one', 'item two', 'item three'];
  let list = new SwipeOutList('list', items);
</script>
```

## Custom Styling

Additional styles can be applied either by writting actual css for classes `.swipe-out-list-item`, `.swipe-out-list-content`, `swipe-out-list-background` or by providing options object as third parameter.

```javascript
let styledList = new SwipeOutList('styled-list', ['styled one', 'styled 2', 'three three three'], {
      contentStyles: {
        backgroundColor: 'lightblue',
        borderBottom: 'solid 2px green',
        justifyContent: 'center',
        height: '4em'
      },
      backgroundStyles: {
        backgroundColor: 'violet'
      }
    });
```

## NonText List Items

Within `items` array you can also pass DOM elements. Anything that is not `Node.ELEMENT_NODE` is appended to the list as text.

```javascript
let a = document.createElement('a');
    a.setAttribute('href', 'https://google.com');
    a.innerText = 'google.com';
    let div = document.createElement('div');
    div.style.width = '100%';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-around';
    let link1 = document.createElement('a');
    link1.setAttribute('href', '#');
    link1.innerText = 'link1';
    let link2 = document.createElement('a');
    link2.setAttribute('href', '#');
    link2.innerText = 'link2';
    div.appendChild(link1);
    div.appendChild(link2);
    let domList = new SwipeOutList('dom-list', [a, div]);
```