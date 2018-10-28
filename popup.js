function loadReadingList() {
  chrome.storage.sync.get(null, function (links) {
    for (const url in links) {
      addLinkToPopup(url, links[url]);
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
    if (e.target.tagName === "A") {
      chrome.storage.sync.remove(e.target.href);
    }
  });

  document.getElementById('clear').addEventListener('click', function () {
    const audio = new Audio('the-woman-says-a~.mp3');
    audio.play();
    clearReadingList();
  })
}, false);
