<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Intrusion Detection System</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #121212;
            color: #fff;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .container {
            max-width: 900px;
            margin: auto;
            background: #1e1e1e;
            padding: 25px;
            box-shadow: 0px 4px 20px rgba(0, 255, 170, 0.2);
            border-radius: 12px;
        }
        h1 {
            color: #00ffab;
            text-shadow: 0px 0px 8px rgba(0, 255, 170, 0.8);
        }
        .alerts, .logs {
            text-align: left;
            margin-top: 20px;
        }
        .alert {
            background: linear-gradient(135deg, #ff4e50, #f9d423);
            color: white;
            padding: 12px;
            margin: 10px 0;
            border-radius: 6px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: fadeIn 0.5s ease-in-out;
        }
        .log {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 12px;
            margin: 5px 0;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            animation: fadeIn 0.5s ease-in-out;
        }
        .icon {
            font-size: 18px;
        }
        #alert-box, #log-box {
            max-height: 300px;
            overflow-y: auto;
            padding-right: 5px;
        }
        .buttons {
            margin-top: 20px;
        }
        button {
            background-color: #00ffab;
            color: #121212;
            border: none;
            padding: 10px 20px;
            margin: 5px;
            cursor: pointer;
            font-weight: bold;
            border-radius: 6px;
            transition: 0.3s;
        }
        button:hover {
            background-color: #00cc88;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Intrusion Detection System</h1>
        <div class="buttons">
            <button onclick="simulateAttack()">⚡ Simulate Attack</button>
            <button onclick="downloadLogs()">📥 Download Logs</button>
            <button onclick="clearAll()">🗑️ Clear Logs & Alerts</button>
        </div>
        <div class="alerts">
            <h2>🚨 Real-Time Alerts</h2>
            <div id="alert-box"></div>
        </div>
        <div class="logs">
            <h2>📜 System Logs</h2>
            <div id="log-box"></div>
        </div>
    </div>

    <script>
        class IntrusionDetectionSystem {
            constructor() {
                this.failedAttempts = [];
                this.anomalyThreshold = 3;
                this.alertSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
            }

            getTimeStamp() {
                return new Date().toLocaleTimeString();
            }

            addAlert(message) {
                const alertBox = document.getElementById("alert-box");
                const alertDiv = document.createElement("div");
                alertDiv.className = "alert";
                alertDiv.innerHTML = `<i class="fas fa-exclamation-triangle icon"></i> ${this.getTimeStamp()} - ${message}`;
                alertBox.prepend(alertDiv);
                this.alertSound.play();
                setTimeout(() => alertDiv.remove(), 6000);
            }

            addLog(message) {
                const logBox = document.getElementById("log-box");
                const logDiv = document.createElement("div");
                logDiv.className = "log";
                logDiv.innerHTML = `<i class="fas fa-terminal icon"></i> ${this.getTimeStamp()} - ${message}`;
                logBox.prepend(logDiv);
            }

            detectAnomalies(ip) {
                const now = Date.now();
                this.failedAttempts.push({ ip, time: now });

                this.failedAttempts = this.failedAttempts.filter(attempt => now - attempt.time < 60000);

                const attemptCounts = {};
                this.failedAttempts.forEach(attempt => {
                    attemptCounts[attempt.ip] = (attemptCounts[attempt.ip] || 0) + 1;
                });

                if (attemptCounts[ip] >= this.anomalyThreshold) {
                    this.addAlert(`🔴 Suspicious activity detected from IP: ${ip}`);
                }
            }
        }

        const ids = new IntrusionDetectionSystem();

        function simulateAttack() {
            const randomIP = `192.168.1.${Math.floor(Math.random() * 255)}`;
            ids.detectAnomalies(randomIP);
            ids.addLog(`🛑 ${randomIP} - Simulated Attack`);
        }

        function downloadLogs() {
            const logs = document.getElementById("log-box").innerText;
            const blob = new Blob([logs], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "intrusion_logs.txt";
            link.click();
        }

        function clearAll() {
            document.getElementById("alert-box").innerHTML = "";
            document.getElementById("log-box").innerHTML = "";
        }

        setTimeout(() => {
            ids.detectAnomalies("192.168.1.1");
            ids.addLog("🛑 192.168.1.1 - Failed SSH login attempt");
        }, 2000);

        setTimeout(() => {
            ids.detectAnomalies("203.0.113.45");
            ids.addLog("⚠️ 203.0.113.45 - Multiple brute-force attempts");
        }, 5000);

        setTimeout(() => { 
            ids.detectAnomalies("192.168.1.1"); 
        }, 7000);

        setTimeout(() => { 
            ids.detectAnomalies("192.168.1.1"); 
        }, 9000);
    </script>
</body>
</html>
