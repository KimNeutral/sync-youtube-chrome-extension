window.onload = function() {
    addShareButtonIfNotExist();
}

// 유튜브의 경우 화면이 바뀔 때 transitioned가 발생함.
document.addEventListener('transitionend', function(e) {
    if (e.target.id === 'progress')
        addShareButtonIfNotExist();
});

function onShareButtonClicked() {
    var url = getVideoShareUrlWithCurrentTime();
    var seconds = getCurrentSeconds();
    var title = getVideoTitle();
    var thumbnail = getVideoThumbnailUrl();

    var dict = {
        'title': title,
        'url': url,
        'thumbnail': thumbnail,
        'seconds': seconds
    };

    chrome.storage.local.get(['token'], function(result) {
        if(!result.token) {
            alert('로그인 해주세요');
            return;
        }

        $.ajax({
            type: 'POST',
            url: 'http  ://10.80.163.90:8080/api/auth/youtube/',
            headers: {
                'Authorization': result.token
            },
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(dict),
            success: function (data) {
                alert(data);
            },
            error: function (xhr) {
                alert('failed');
            }
        });
    });
}

function addShareButtonIfNotExist() {
    var rightControlsElements = document.getElementsByClassName("ytp-right-controls");
    console.log(rightControlsElements);

    if (!rightControlsElements || rightControlsElements.length == 0) return;    

    if (document.getElementById("btn-send-to-mobile")) return;

    var rightControls = rightControlsElements[0];
    var button = document.createElement("button");
    var buttonInnerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow"></use><path d="m27.318541,16.572697l-8.116454,-8.558904l0,5.104828l-1.723991,0c-5.351978,0 -9.687875,4.171124 -9.687875,9.318672l0,2.7065l0.765877,-0.80859c2.605812,-2.746174 6.291783,-4.311494 10.157781,-4.311494l0.488208,0l0,5.107882l8.116454,-8.558896zm0,0" fill="#fff"></path></svg>';
    
    button.innerHTML = buttonInnerHTML;
    button.classList.add('ytp-button');
    button['id'] = 'btn-send-to-mobile'
    button['title'] = 'Share to mobile';
    button['aria-haspopup'] = 'true';

    button.onclick = onShareButtonClicked;

    rightControls.insertBefore(button, rightControls.firstChild);
}

function getVideoShareUrl() {
    var id = getVideoID(getCurrentUrl());
    if (id) {
        return 'https://youtu.be/' + id;
    }
    return '';
}

function getVideoShareUrlWithCurrentTime() {
    var url = getVideoShareUrl();

    if(url && url !== '') {
        var seconds = getCurrentSeconds();
        url += '?t=' + seconds;
        return url;
    }
    return '';
}

function getVideoID(url) {
    return url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/)[1];
}

function getCurrentUrl() {
    return window.location.href;
}

function getCurrentSeconds() {
    var currentTimeElements = document.getElementsByClassName("ytp-time-current");
    if (!currentTimeElements || currentTimeElements.length == 0) return;

    var currentTime = currentTimeElements[0];
    var timeStr = currentTime.innerHTML;
    var splited = timeStr.split(':');

    let points = [1, 60, 3600, 86400];

    var seconds = 0;

    for (let i = splited.length - 1; i >= 0; i --) {
        seconds += points[splited.length - i - 1] * splited[i];
    }
    return seconds;
}

function getVideoTitle() {
    var title = document.title;
    // Remove postfix ' - Youtube'
    title = title.substr(0, title.length - 10);

    return title;
}

function getVideoThumbnailUrl() {
    var id = getVideoID(getCurrentUrl());

    return "https://img.youtube.com/vi/${id}/maxresdefault.jpg";
}
