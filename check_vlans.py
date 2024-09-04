#
# 	VLAN-Helper project
#	Copyright (c) 2024 Alexia Gossa <contact@nemelit.com>
#
#	This file is released under GPL-3.0 license
#
#
#	Alexia Gossa
#	nemelit.com
#	FRANCE
#
 
from scapy.all import *
import threading
import time
import sys

link_to_port1 		= "ens192f0"			# Connect this interface to your switch Port 1
link_to_port2 		= "ens192f1"			# Connect this interface to your switch Port 2
vlan_id_values 		= [0, 1, 27, 42]		# All tested VLAN
port1_name 			= "Port 1"				# Port 1 name
port2_name 			= "Port 2"				# Port 2 name
rx_vlan_id_state 	= -1
rx_stop_thread 		= threading.Event()
lock 				= threading.Lock()

def rx_packet():
	while not rx_stop_thread.is_set():
		def packet_callback(packet):
			global rx_vlan_id_state
			
			get_vlan_id = -1
			get_mac_src = ""
			get_mac_dst = ""
			
			if packet.haslayer(Dot3):
				get_mac_src = packet[Dot3].src
				get_mac_dst = packet[Dot3].dst
			
			if packet.haslayer(Ether):
				get_mac_src = packet[Ether].src
				get_mac_dst = packet[Ether].dst
				
			if get_mac_src == src_mac and get_mac_dst == dst_mac:
				
				get_vlan_id = 0
				
				if packet.haslayer(Dot1Q):
					get_vlan_id = packet[Dot1Q].vlan
					
				with lock:
					rx_vlan_id_state = get_vlan_id
			
			#print("Packet received:", packet.summary())
			
		sniff(iface=dst_iface, prn=packet_callback, timeout=0.2)

for iDirection in range(0,2):

	# Direction from port 1 to port 2 or port 2 to port 1
	if iDirection==0:
		src_iface = link_to_port1
		dst_iface = link_to_port2
		src_port  = port1_name
		dst_port  = port2_name
	else:
		src_iface = link_to_port2
		dst_iface = link_to_port1
		src_port  = port2_name
		dst_port  = port1_name

	# Get all MAC address
	src_mac = get_if_hwaddr(src_iface)
	dst_mac = get_if_hwaddr(dst_iface)	

	# Display ports, interfaces and MAC
	if iDirection==0:
		print(f"{port1_name} connected to interface {link_to_port1} = {src_mac}")
		print(f"{port2_name} connected to interface {link_to_port2} = {dst_mac}")
		print("")
		
	# Display direction	
	print(f"{src_port} to {dst_port}")		

	for vlan_id in vlan_id_values:
		eth_frame = Ether(src=src_mac, dst=dst_mac) / Dot1Q(vlan=vlan_id) / Raw(load="VLANCHECK")
		
		# Detect output VLAN ID state
		with lock:
			rx_vlan_id_state = -1
			
		# Do RX/TX during 1 second
		rx_thread = threading.Thread(target=rx_packet)
		rx_thread.start()
		time.sleep(0.1)		
		sendp(eth_frame, iface=src_iface, verbose=False)		
		time.sleep(0.1)		
		rx_stop_thread.set()
		rx_thread.join()		
		rx_stop_thread.clear()
		
		# Get VLAN ID state
		with lock:
			rx_vlan_id = rx_vlan_id_state
			
		# Send frame
		#print(f"{src_port} : ",end="")		
		if vlan_id==0:
			print("Frame not tagged 0",end="")
		else:
			print(f"Frame is tagged {vlan_id:2}",end="")
			
		
		#print(f" => {dst_port} : ",end="")
		print(f" => ",end="")

			
		# Receive frame
		if rx_vlan_id==-1:
			print("No output")
		else:
			if rx_vlan_id==0:
				print("Frame not tagged 0")
			else:
				print(f"Frame is tagged {rx_vlan_id:2}")
		
	print("")


sys.exit(0)
