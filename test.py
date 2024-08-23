import psutil
import time


def monitor_network(interval=1):
    # Lấy thông tin mạng ban đầu
    prev_net_io = psutil.net_io_counters()

    while True:
        time.sleep(interval)
        # Lấy thông tin mạng hiện tại
        net_io = psutil.net_io_counters()

        # Tính toán lưu lượng truyền gửi và nhận trong khoảng thời gian
        bytes_sent = net_io.bytes_sent - prev_net_io.bytes_sent
        bytes_recv = net_io.bytes_recv - prev_net_io.bytes_recv

        # In ra thông tin lưu lượng
        print(f"Bytes sent in last {interval} seconds: {bytes_sent}")
        print(f"Bytes received in last {interval} seconds: {bytes_recv}")

        # Cập nhật thông tin mạng trước đó
        prev_net_io = net_io


if __name__ == "__main__":
    monitor_network()
