const init = () => {
    chrome.storage.sync.get(["hidden"], function (result) {
        console.log('loaded from storage:', result.hidden);
        document.getElementById("list").innerHTML = Object.keys(result.hidden).map(
            id => `<li><a href="https://www.list.am/${id}" target="_blank">${result.hidden[id]}</a></li>`
        ).join("");
    });
    document.getElementById("clear").onclick = () => {
        chrome.storage.sync.set({hidden:{}}, () => console.log("storage cleared"));
        document.getElementById("list").innerHTML = "";
    }
}
if (document.readyState === "complete"  || document.readyState === "interactive") {
    init();
} else {
    window.addEventListener("DOMContentLoaded",init);
    window.addEventListener("load", init);
}
