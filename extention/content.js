// Thu thập dữ liệu khi người dùng truy cập vào Facebook
if (window.location.href.includes("facebook.com")) {
    const userEmail = "user@gmail.com"; // Ví dụ, bạn có thể lấy thông tin người dùng qua API của ứng dụng
    const currentUrl = window.location.href;
    const accessTime = new Date().toISOString();

    // Gửi dữ liệu về server qua API
    fetch("http://localhost:8000/log_access/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: userEmail,
            url: currentUrl,
            access_time: accessTime,
            additional_data: {
                browser: navigator.userAgent
            }
        })
    })
    .then(response => response.json())
    .then(data => console.log("Data logged:", data))
    .catch(error => console.error("Error logging data:", error));

    // Hiển thị cảnh báo
    alert("Bạn đang truy cập vào Facebook!");
}
