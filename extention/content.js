// Hàm để gửi dữ liệu đến server
function sendDataToServer(data) {
    fetch('http://localhost:8000/collect', { // Đổi URL thành URL của server bạn
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
        // Có thể thu thập thêm thông tin từ DOM nếu cần
        email: document.querySelector('input[name="email"]')?.value || 'unknown',
      };
  
      // Gửi dữ liệu đến server
      sendDataToServer(userData);
    }
  });
  