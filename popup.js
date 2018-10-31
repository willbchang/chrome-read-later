function loadReadingList() {
  chrome.storage.sync.get(data => {
    for (const time in data) {
      addLinkToPopup(data[time].url, data[time].title, time, data[time].favIconUrl);
    }
  });
}

function addLinkToPopup(url, title, time, favIconUrl) {
  const ul = document.getElementById('reading-list'),
      li = document.createElement('li'),
      a = document.createElement('a'),
      img = document.createElement('img');

  img.src = favIconUrl;
  a.href = url;
  a.innerText = title;
  a.target = '_blank';
  li.id = time;

  li.appendChild(img);
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
    if (e.target.tagName !== "A") return;

    const href = e.target.href,
        time = e.target.parentNode.id;

    if (href.includes('chrome://') || href.includes('file://')) {
      chrome.tabs.create({url: href});
    }
    chrome.storage.sync.remove(time);
  });

  document.getElementById('clear').addEventListener('click', function () {
    const audio = new Audio('the-woman-says-a~.mp3');
    audio.play();
    clearReadingList();
  });
}, false);
