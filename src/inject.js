const {loaded, hide, unHide, isHidden} = function () {
    let hidden = {};
    return {
        loaded: new Promise(resolve => {
            chrome.storage.sync.get(["hidden"], function (result) {
                hidden = result.hidden || {};
                resolve(hidden);
            });
        }),
        hide: function hide(id, description) {
            hidden[id] = description;
            chrome.storage.sync.set({hidden});
        },
        unHide: function show(id) {
            delete hidden[id];
            chrome.storage.sync.set({hidden});
        },
        isHidden: id => (hidden[id] || false),
    }
}()

let hiddenOnPage = [];

const inject = () => {
    let items = document.querySelectorAll("div.gl a")
    for (let i = 0; i < items.length; i++) {
        let elem = items[i];
        let id = new URL(elem.href).pathname;
        let desc = elem.querySelector("div.l").innerHTML;
        if (isHidden(id)) {
            elem.style.display = "none";
            hiddenOnPage.push(id);
            drawShowBtn();
            continue
        }
        let btn = document.createElement("button");
        btn.innerText = "hide";
        btn.style.position = "absolute";
        btn.style.left = "4px";
        btn.style.top = "-15px";
        btn.onclick = () => {
            hide(id, desc);
            elem.style.display = "none";
            hiddenOnPage.push(id);
            drawShowBtn();
            return false;
        }
        elem.appendChild(btn)
    }
};

function drawShowBtn() {
    let hiddenCountBtn = document.getElementById("hiddenCountBtn") || document.createElement("button");
    hiddenCountBtn.id = "hiddenCountBtn";
    hiddenCountBtn.innerText = "show " + hiddenOnPage.length + " hidden items";
    hiddenCountBtn.onclick = () => {
        for (let i = 0; i < hiddenOnPage.length; i++) {
            unHide(hiddenOnPage[i]);
            document.querySelector("div.gl a[href='" + hiddenOnPage[i] + "']").style.display = "block";
        }
        hiddenCountBtn.style.display = "none";
        window.location.reload();
    }
    document.querySelector("div.gl").appendChild(hiddenCountBtn)
}


if (document.readyState === "complete" || document.readyState === "interactive") {
    loaded.then(inject);
} else {
    window.addEventListener("DOMContentLoaded", () => loaded.then(inject));
    window.addEventListener("load", () => loaded.then(inject));
}
