window.onload = function () {
    let
        ejsContent = {
            ejsContentName: {},
            ejsContentText: {},
            ejsContentObject: {},
            ejsContentCreate_at: {}
        },
        root,
        renderDOM,
        details = "",
        nameToken = "",
        localTime, localTimeDay, localTimeDate, localTimeSecond, localTimeString,
        imgObject,
        result,
        blob,
        url;

    root = document.getElementById('root');

    ejsContent.ejsContentName = document.getElementsByClassName('ejsContentName');
    ejsContent.ejsContentText = document.getElementsByClassName('ejsContentText');
    ejsContent.ejsContentObject = document.getElementsByClassName('ejsContentObject');
    ejsContent.ejsContentCreate_at = document.getElementsByClassName('ejsContentCreate_at');
    renderDOM = document.getElementById('ejsContent');

    for (let i = 0; i < ejsContent.ejsContentCreate_at.length; i++) {
        if (ejsContent.ejsContentName[i].innerHTML.indexOf("__LINE_TOKEN__") == -1) {
            nameToken = ejsContent.ejsContentName[i].innerHTML;
        } else {
            nameToken = "";
        }
        if (ejsContent.ejsContentCreate_at[i].innerHTML.indexOf("__LINE_TOKEN__") == -1) {
            localTime = new Date(Number(ejsContent.ejsContentCreate_at[i].innerHTML));
            localTimeDay = localTime.getDate();
            localTimeDate = localTime.getHours();
            localTimeMinutes = localTime.getMinutes();
            localTimeSecond = localTime.getSeconds();
            localTimeString = localTimeDay + "日" + localTimeDate + "時" + localTimeMinutes + "分" + localTimeSecond + "秒";
        }
        if (ejsContent.ejsContentText[i].innerHTML.indexOf("__LINE_TOKEN__") == -1) {
            details += "<div class='kaiwa'><figure class='kaiwa-img-right' title='" + localTimeString + "'><img src='/images/detail_line2.png' alt='./no-img2'>";
            details += "<figcaption class='kaiwa-img-description'>" + nameToken + "</figcaption>";
            details += "</figure><div class='kaiwa-text-left'><p class='kaiwa-text'>"
            details += ejsContent.ejsContentText[i].innerHTML;
            details += "</p></div></div>";
        }
        if (ejsContent.ejsContentObject[i].innerHTML.indexOf("__LINE_TOKEN__") == -1) {
            imgObject = JSON.parse(ejsContent.ejsContentObject[i].innerHTML);
            result = new Uint8Array(imgObject.data);
            blob = new Blob([result], { type: "image/jpeg" });
            url = URL.createObjectURL(blob);
            details += "<div class='kaiwa'><figure class='kaiwa-img-left'title='" + localTimeString + "'><img src='/images/detail_line2.png' alt='./no-img2'>";
            details += "<figcaption class='kaiwa-img-description'>" + nameToken + "</figcaption>";
            details += "</figure><img class='textImg' src='" + url + "' alt='送信画像'>"
            details += "</div>";
        }
    }
    root.innerHTML += details;
    renderDOM.parentNode.removeChild(renderDOM);
}