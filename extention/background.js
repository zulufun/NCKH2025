chrome.webNavigation.onCompleted.addListener(async function (details) {
    const targetUrl = details.url;
    const email = "user_email@gmail.com"; // Thêm cơ chế thu thập email người dùng nếu có
    const additionalData = {
        browser: navigator.userAgent
    };

    // Gửi yêu cầu đến FastAPI server
    fetch('http://localhost:8000/log_access/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: targetUrl,
            email: email,
            additional_data: additionalData
        })
    })
    .then(response => response.json())
    .then(data => console.log("Data sent successfully:", data))
    .catch(error => console.error("Error sending data:", error));

}, {url: [{urlMatches: 'https://web.facebook.com/*'}]});

// Tạo cảnh báo khi truy cập trang Facebook
chrome.webNavigation.onCompleted.addListener(function (details) {
    chrome.tabs.executeScript(details.tabId, {
        code: `alert('Bạn đang truy cập vào Facebook!');`
    });
}, {url: [{urlMatches: 'https://web.facebook.com/*'}]});
