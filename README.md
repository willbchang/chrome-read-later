<p align="center">
  <img src="assets/images/logotype.png" alt="Read Later Logo" height="150px"><br>
  <sub>Dedicated to my good friend <a href="https://github.com/evestorm">@evestorm</a></sub><br>
  A temporary bookmark focuses on reading later, rather than closing and removing.
</p>

## Installation
<a href="https://chrome.google.com/webstore/detail/fbmfcfkokefgbmfcjahdmomlifclekib/">
  <img src="assets/images/chrome-store-logo.png" width="250px" alt="chrome-store-logo">
</a>

[Manual Installation](https://github.com/willbchang/chrome-read-later/wiki/Manual-Installation)

## Features
- It saves almost all kinds of pages in any situation: `http://`, `https://`, `chrome://`, `localhost:`...
- It saves the reading progress of current page, **works on most pages**(I'm improving it).
- It syncs the reading list to your browser automatically, you can use one reading list in multiple Chrome browsers with one google account.

Check [todo list](https://github.com/willbchang/chrome-read-later/wiki/TODO) for the future features.

Known Issues: cannot save scroll position from `*.google.com`, `https://manga.bilibili.com/*`, or some sites has multiple scroll bars.

## Usages
### Mouse Click
**Current Page**:
- `Right Click` a link and select **Read Later** in context menus to save the target link info.
- `Right Click` current page and select **Read Later** in context menus to save page info and close current tab.
- `Click` the icon to open the **Reading List**(Popup Window).

**Reading List**(Popup Window):
- `Mouse Hover`: **show** full title and link.
- `Mouse Hover(image)`: **show** the delete icon.
- `Click`: **open** link in a **new tab**.
- `Click(image)`: **delete** current link.
- <kbd>Alt</kbd> + `Click`:  **update** link in **current tab**.
- <kbd>Command</kbd> + `Click`: **open** link in a **new tab** and **stay** in **current tab**, and **keep reading list**.

### Keyboard Shortcuts
**Current Page**:
- <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>: **Save** current page info.
- <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>: **Zoom In/Out** reading list.

**Reading List**(Popup Window):
- <kbd>↑</kbd>: **move** to **next** link.
- <kbd>↓</kbd>: **move** to **previous** link.
- <kbd>Backspace</kbd>: **delete** current link.
- <kbd>Command</kbd> + <kbd>z</kbd>: **restore** a deletion.
- <kbd>Enter</kbd>: **open** select link in a **new tab**.
- <kbd>Alt</kbd> + <kbd>Enter</kbd>: **update** link in **current tab**.
- <kbd>Command</kbd> + <kbd>Enter</kbd>: **open** link in a **new tab** and **stay** in **current tab**, and **keep reading list**.

**For Vim user**(Reading List):
- <kbd>Esc</kbd>: **close reading list**.
- <kbd>j</kbd>: **move** to **next** link.
- <kbd>k</kbd>: **move** to **previous** link.
- <kbd>gg</kbd>: **move** to the **first** link.
- <kbd>G</kbd>: **move** to the **last** link.
- <kbd>dd</kbd>: **delete** a link.
- <kbd>u</kbd>: **restore** a deletion.

## Contribution
Please read [contribution guide](https://github.com/willbchang/chrome-read-later/wiki/Contribution-Guide) first.
I explained the code structure and conventions to help you understand quickly. 😄

### Contributor
|                              Logo Designer                              |
| :---------------------------------------------------------------------: |
| ![Yasujizr](https://avatars0.githubusercontent.com/u/36993664?s=88&v=4) |
|                 [Yasujizr](https://github.com/Yasujizr)                 |

## Credits
- Special thanks to my girl friend YangYang, she gave me a lot of helpful suggestions, feedback and encouragement.
- Delete icon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com </a>

## LICENSE
[MIT](LICENSE)
