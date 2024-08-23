import threading
import queue
from scapy.all import sniff

packet_queue = queue.Queue()
packet_counter = 0

class SendDataHandler:
    def __init__(self):
        self.send_data = False

    def set_send_data(self, value):
        self.send_data = value

    def get_send_data(self):
        return self.send_data

send_data_handler = SendDataHandler()

def capture_packets(interface, packet_queue):
    def packet_handler(packet):
        global packet_counter
        packet_info = packet.summary()
        packet_queue.put((packet_counter, packet_info))
        packet_counter += 1

    def start_sniffing():
        print(f"Bắt đầu bắt gói tin từ interface: {interface}\n")
        sniff(iface=interface, prn=packet_handler)

    capture_thread = threading.Thread(target=start_sniffing)
    capture_thread.start()
    return capture_thread

# Khởi động việc bắt gói tin
capture_thread = capture_packets('Ethernet', packet_queue)
