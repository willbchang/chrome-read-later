const get = function getChromeStorage(callback) {
  chrome.storage.sync.get(data => {
    const urls = [], times = [], titles = [];

    for (const time in data) {
      times.push(time);
      urls.push(data[time].url);
      titles.push(data[time].title);
    }

    callback(urls, times, titles);
  });
};

function loadReadingList() {
  get((urls, times, titles) => {
    for (let index = 0; index < times.length; index++) {
      addLinkToPopup(urls[index], titles[index]);
    }
  });
}

function addLinkToPopup(url, title) {
  const ul = document.getElementById('reading-list'),
      li = document.createElement('li'),
      a = document.createElement('a');

  a.href = url;
  a.innerText = title;
  a.target = '_blank';

  li.appendChild(a);
  ul.appendChild(li);
}

function clearReadingList() {
  chrome.storage.sync.clear();
  document.getElementById('reading-list').innerHTML = '';
}

loadReadingList();

document.addEventListener('DOMContentLoaded', function () {

  document.getElementById('reading-list').addEventListener("click", function (e) {
    const href = e.target.href,
        tag = e.target.tagName;

    if (tag !== "A") return;
    get((urls, times) => {
      const index = urls.indexOf(href);
      if (href.includes('chrome://') || href.includes('file://')) {
        chrome.tabs.create({url: href});
      }
      chrome.storage.sync.remove(times[index]);
    });
  });

  document.getElementById('clear').addEventListener('click', function () {
    const audio = new Audio('the-woman-says-a~.mp3');
    audio.play();
    clearReadingList();
  });
}, false);
