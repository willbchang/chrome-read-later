<p align="center">
  <img src="images/logotype.png" alt="Read Later Logo" height="150px">
</p>

<p align="center">  
  A Chrome extension focuses on reading later, rather than closing and removing.
</p>

## Installation
I haven't publish it to chrome store yet!
1. Download [Read-Later.zip](https://github.com/WillBChang/readlater/releases/latest) from releases.
2. Move it to the safe path(you won't delete it accidentally).
3. Go to `chrome://extensions/`
4. Open `Developer mode`.
5. Click `Load unpacked` and select the folder.

## Usages
### Save Reading List **Temporarily**
<kbd>alt</kbd> + <kbd>shift</kbd> + <kbd>s</kbd>
- [x] Press hotkey to save and close current tab.
  - [x] Avoid duplicated url.
    - [ ] Check dupilicate with the last `/` in url.
  - [ ] Avoid empty tab.
    - [x] `chrome://newtab`
    - [ ] `about:blank`
  - [x] Add websites' favicon in front of the reading list.
  - [ ] Get website scroll position.
- [x] Click a reading list item to open it in a tab and remove from storage.
  - [x] Load from current empty tab.
  - [x] A delete icon will appear when cursor is hovering a favicon.
    - [x] Click to delete.
  - [ ] Set website scroll position.
- [x] Right Click link and select read later to save(not in the search bar)
  - [ ] Filter selected link in google search.

### Zoom Out Reading list
<kbd>alt</kbd> + <kbd>shift</kbd> + <kbd>z</kbd>
- [x] Open clicked item in a tab and remove from reading list.
  - [x] Load from current empty tab.
  - [x] A delete icon will appear when cursor is hovering a favicon.
    - [x] Click to delete.
  - [ ] Set website scroll position.
- [ ] Thin scroll bar.
- Select items by <kbd>tab</kbd> and <kbd>shift</kbd> + <kbd>tab</kbd>.
- Use <kbd>enter</kbd> to open selected item.

<!-- ### Browse with Vim
I'll finish this before 2020/02.
- [ ] <kbd>j</kbd>
- [ ] <kbd>k</kbd>
- [ ] <kbd>d</kbd>
  - [ ] <kbd>dd</kbd>: delete a item
  - [ ] <kbd>d</kbd>@{num}<kbd>d</kbd>: delete x items
- [ ] <kbd>/</kbd> search item -->

You can config shortcuts from `chrome://extensions/shortcuts`
## Dependencies
```
npm install
```
or

```
npm install --save @types/chrome
npm install --save @types/jquery
```

## Contributor
| Logo Designer |
| :---: |
| ![Yasujizr](https://avatars0.githubusercontent.com/u/36993664?s=88&v=4)|
| [Yasujizr](https://github.com/Yasujizr) |

## LICENSE
[MIT](LICENSE)
