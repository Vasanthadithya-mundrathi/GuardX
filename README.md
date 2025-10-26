# GuardX: AI-Powered Adaptive Web Application Firewall

![GuardX Dashboard](https://i.imgur.com/u0E7x8M.png)

GuardX is an intelligent, adaptive Web Application Firewall (WAF) that proactively detects and mitigates unknown threats by dynamically generating security rules in real-time, moving beyond the limitations of traditional signature-based firewalls. This project was developed for the **COSC - Hacktoberfest : Hackathon**.

## ✨ Features

- **Real-Time Security Dashboard**: A comprehensive overview of all security metrics, including total requests, threats detected/blocked, and top attack vectors.
- **Live Traffic Monitoring**: A detailed, real-time feed of all incoming requests, color-coded by threat level.
- **Adaptive Defense Engine**: The core of GuardX. When the WAF blocks an unknown or novel threat, it uses the **Google Gemini API** to analyze the malicious payload and automatically generates a new, dynamic security rule to protect against future, similar attacks.
- **Interactive Threat Map**: A live D3.js world map visualizing the geographic origin of incoming threats in real-time.
- **Variable Security Levels**: Instantly switch the WAF's protection level between **Low**, **Medium**, and **High** to see how different security postures handle attacks.
- **Attacker Toolkit**: A built-in suite of tools to simulate common web attacks, including Cross-Site Scripting (XSS), SQL Injection (SQLi), and Brute-Force attacks.
- **AI-Powered Payload Generation**: Describe an attack in natural language, and the Gemini API will generate a functional payload tailored to the target's current security level.
- **Interactive Server Terminal**: A simulated terminal environment providing diagnostic information about the server and WAF, including a live log viewer (`cat logs/waf.log`) and a simulated `nmap` port scan.

## ⚙️ How It Works: The Adaptive Defense Engine

GuardX's standout feature is its ability to learn from the threats it encounters.

1.  **Threat Identification**: The WAF inspects all traffic. When it blocks a request that doesn't match a known signature, it flags the payload as a potential zero-day or obfuscated attack.
2.  **AI-Powered Analysis**: The malicious payload is securely sent to the Google Gemini API for deep analysis of its structure, intent, and attack vector.
3.  **Dynamic Rule Generation**: The Gemini model generates a concise, human-readable description for a new, dynamic security rule designed to mitigate this specific threat.
4.  **Real-Time Deployment**: This new rule is instantly deployed to the WAF's active rule set. The firewall is now equipped to block this new attack pattern and its variants, effectively hardening itself in real-time.

## 🚀 Technology Stack

- **Frontend**: Angular (v20+), TypeScript
- **Styling**: Tailwind CSS
- **AI & Machine Learning**: Google Gemini API
- **Data Visualization**: D3.js, TopoJSON
- **Core Principles**: Standalone Components, Signal-based State Management, Zoneless Change Detection

## 👥 The Team (TEAM NO- 281)

- **Vasanthadithya** (160123749049)
- **Harini** (160123749015)
- **Manpreet** (160123749013)
- **Ridhima** (160123749018)
- **Srinath** (160123749303)
