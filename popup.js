const get =  function getChromeStorage(add) {
  chrome.storage.sync.get(data => {
    for (const time in data) {
      add(data[time].url, data[time].title, data[time].favIconUrl, time);
    }
  });
};

const set = function setReadingListToPopup(url, title, favIconUrl, time) {
  const ul = document.getElementById('reading-list');
  const li = document.createElement('li');
  const a = document.createElement('a');
  const img = document.createElement('img');

  img.src = favIconUrl;
  a.href = url;
  a.innerText = title;
  a.target = '_blank';
  li.id = time;

  li.appendChild(img);
  li.appendChild(a);
  ul.appendChild(li);
};

const open = function openURLForLocalAccess(href) {
  chrome.tabs.create({url: href});
};

const clear = function clearChromeStorageAndReadingList() {
  chrome.storage.sync.clear();
  window.close();
};

const remove = function removeFromChromeStorage(time) {
  chrome.storage.sync.remove(time);
};

const play = function playAudio() {
  const audio = new Audio('audio.mp3');
  audio.play();
};

const click = function removeCurrentOrClearAllStorage(e) {
  const tag = e.target.tagName;

  if (tag === 'A') {
    const id = e.target.parentNode.id;
    const href = e.target.href;

    open(href);
    remove(id);
  }

  if (tag === 'BUTTON') {
    play();
    clear();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  get(set);
  document.onclick = click;
});
