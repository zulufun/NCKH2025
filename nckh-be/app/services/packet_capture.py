import threading
from queue import Queue
from scapy.all import sniff
from scapy.layers.inet import IP

packet_queue = Queue()
send_data = False
packet_counter = 0
capture_thread = None

def packet_handler(packet):
    global packet_counter
    if packet.haslayer(IP):
        packet_info = {
            "src_ip": packet[IP].src,
            "dst_ip": packet[IP].dst,
            "protocol": packet[IP].proto,
            "details": str(packet.show(dump=True))
        }
        packet_queue.put((packet_counter, packet_info))
        packet_counter += 1

def capture_packets(interface):
    sniff(iface=interface, prn=packet_handler)

def start_capture():
    global send_data, capture_thread
    if not send_data:
        send_data = True
        capture_thread = threading.Thread(target=capture_packets, args=('Ethernet',))
        capture_thread.start()
    return {"status": "Data generation started"}

def stop_capture():
    global send_data
    if send_data:
        send_data = False
        if capture_thread is not None:
            capture_thread.join()
    return {"status": "Data generation stopped"}

def get_packet_queue():
    return packet_queue
