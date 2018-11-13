const get =  function getChromeStorage(set) {
  chrome.storage.sync.get(data => {
    for (const time in data) {
      set(data[time].url, data[time].title, data[time].favIconUrl, time);
    }
  });
};

const set = function setReadingList(url, title, favIconUrl, time) {
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

const open = function openForAllLinks(href) {
  chrome.tabs.create({url: href});
};

const clear = function clearChromeStorage() {
  chrome.storage.sync.clear();
};

const remove = function removeFromChromeStorage(time) {
  chrome.storage.sync.remove(time);
};

const click = function clickEvents(e) {
  const tag = e.target.tagName;

  if (tag === 'A') {
    const id = e.target.parentNode.id;
    const href = e.target.href;

    open(href);
    remove(id);
  }

  if (tag === 'BUTTON') {
    clear();
    window.close();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  get(set);
  document.onclick = click;
});
