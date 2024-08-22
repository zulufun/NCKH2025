from scapy.all import sniff
import threading
import queue

def capture_packets(interface, packet_queue):
    def start_sniffing():
        print(f"Bắt đầu bắt gói tin từ interface: {interface}\n")
        sniff(iface=interface, prn=lambda pkt: packet_queue.put(pkt.summary()))

    # Tạo và khởi chạy thread để bắt gói tin
    capture_thread = threading.Thread(target=start_sniffing)
    capture_thread.start()
    return capture_thread

def print_packets(packet_queue):
    text = ""  # Biến để lưu thông tin gói tin
    while True:
        packet_info = packet_queue.get()
        text += f"Packet: {packet_info}\n"  # Thêm thông tin gói tin vào biến text
        print(text)  # In ra nội dung của biến text

def main():
    interface = 'Ethernet'
    packet_queue = queue.Queue()
    # Khởi động các thread
    capture_thread = capture_packets(interface, packet_queue)
    print_thread = threading.Thread(target=print_packets, args=(packet_queue,))
    print_thread.start()

    capture_thread.join()  # Chờ đến khi thread bắt gói tin hoàn tất
    print_thread.join()  # Chờ đến khi thread in gói tin hoàn tất

if __name__ == "__main__":
    main()
