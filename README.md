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
I'll refactor the code before 2019/12/13.
### **Temporary** Reading List
<kbd>alt</kbd> + <kbd>shift</kbd> + <kbd>s</kbd>
- [x] Save by hotkey will close current tab.
  - [x] Avoid duplicated url.
  - [ ] Check whether url is available.
  - [x] Add websites' favicon in front of the reading list.
  - [ ] Get current time of video/audio.
- [x] Click list item will remove it from the reading list.
  - [x] Load from current empty tab
  - [ ] A delete icon will appear when cursor is hovering a favicon.
  - [ ] Set stored time of video/audio.
- [x] Right Click link and select read later to save(not in the search bar)

### Zoom Out Reading list
<kbd>alt</kbd> + <kbd>shift</kbd> + <kbd>z</kbd>

- You need to config it on your own for now, from `chrome://extensions/shortcuts`. I'll set it as default laterly. 
- Browse list items by <kbd>tab</kbd>.
- Use <kbd>enter</kbd> to open selected item.

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
| [![Yasujizr](https://avatars0.githubusercontent.com/u/36993664?s=88&v=4)](https://github.com/Yasujizr) |
| [Yasujizr](https://github.com/Yasujizr) |

## LICENSE
[MIT](LICENSE)
