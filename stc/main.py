import os
import time
import re
from collections import Counter

def collect_logs(log_file='/var/log/auth.log'):
    try:
        with open(log_file, 'r') as file:
            logs = file.readlines()
        return logs
    except FileNotFoundError:                                                          
        print(f"Log file {log_file} not found!")
        return []

def extract_login_attempts(logs):
    failed_attempts = []
    for line in logs:
        if 'Failed password' in line:
            ip_address = re.findall(r'from (\S+)', line)
            timestamp = time.time()  # Capture the current timestamp
            if ip_address:
                failed_attempts.append((ip_address[0], timestamp))
    return failed_attempts

def detect_anomalies(failed_attempts, threshold=5, time_window=60):
    current_time = time.time()
    
    # Filter attempts in the given time window
    recent_attempts = [attempt for attempt in failed_attempts if current_time - attempt[1] <= time_window]
    
    # Count failed attempts per IP
    ip_counter = Counter([attempt[0] for attempt in recent_attempts])
    
    # Identify IPs exceeding the threshold
    anomalies = {ip: count for ip, count in ip_counter.items() if count >= threshold}
    
    return anomalies

def generate_alert(anomalies):
    if anomalies:
        print("\n[ALERT] Potential Intrusion Detected!")
        for ip, count in anomalies.items():
            print(f"Suspicious IP: {ip} - Failed Attempts: {count}")
    else:
        print("\n[INFO] No anomalies detected.")

def run_ids(log_file='/var/log/auth.log'):
    print("Starting Intrusion Detection System...\n")
    failed_attempts = []  # Keep track of failed attempts over time

    while True:
        logs = collect_logs(log_file)
        new_attempts = extract_login_attempts(logs)
        failed_attempts.extend(new_attempts)  # Append new attempts to history
        anomalies = detect_anomalies(failed_attempts)
        generate_alert(anomalies)
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    run_ids()
