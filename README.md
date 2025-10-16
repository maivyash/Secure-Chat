# 🛡️ SecureComm - Military-Grade Chat Application

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)

**A next-generation MERN stack secure chat application with blockchain authentication, VPN tunneling, end-to-end encryption, and military-grade security features.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Security](#-security)

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Quick Start](#-quick-start)
- [User Roles](#-user-roles)
- [Blockchain Authentication](#-blockchain-authentication)
- [VPN Tunneling](#-vpn-tunneling)
- [End-to-End Encryption](#-end-to-end-encryption)
- [Geo-Location Tracking](#-geo-location-tracking)
- [Real-time Messaging](#-real-time-messaging)
- [File Sharing](#-file-sharing)
- [Analytics Dashboard](#-analytics-dashboard)
- [API Documentation](#-api-documentation)
- [Security](#️-security)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**SecureComm** is a next-gen, military-grade chat system with:

- 🔗 **Blockchain Authentication**
- 🔒 **VPN Tunneling**
- 🔐 **End-to-End Encryption**
- 📍 **Geo-Location Tracking**
- 📊 **Advanced Analytics**
- 💬 **Modern Chat Features**
- 📁 **Secure File Sharing**
- 🔔 **Real-time Notifications**

---

## ✨ Key Features

### 🔐 Security First
- Blockchain-based authentication with Ethereum smart contracts  
- MetaMask wallet integration for passwordless login  
- AES-256-GCM encryption for all communications  
- Multi-hop VPN tunneling for anonymity  
- Cryptographic signatures for message verification  
- Immutable audit logs stored on blockchain  

### 💬 Advanced Messaging
- Real-time messaging with Socket.io  
- Reactions, threading, editing, deletion  
- Pin and forward messages  
- Message search with filters  
- Typing indicators & read receipts  

### 📁 File Management
- Drag-and-drop encrypted uploads  
- Multi-file support with previews  
- 10MB upload limit with validation  
- AES-256 encrypted file storage  

### 📊 Analytics & Monitoring
- Real-time activity tracking  
- VPN & blockchain statistics  
- User analytics and message trends  
- Geo-visualization dashboard  

---

## 🛠️ Tech Stack

### Backend
- Node.js, Express.js, MongoDB, Mongoose  
- Socket.io, JWT, bcrypt, crypto-js  
- ethers.js, multer  

### Frontend
- React, React Router, Axios  
- Socket.io-client, Recharts, React Leaflet  
- Lucide React, date-fns, ethers.js  

### Blockchain
- Solidity, Hardhat, MetaMask  
- OpenZeppelin, ethers.js  

---

## 🏗️ Architecture

```text
CLIENT
 ├── React App
 ├── Socket.io Client
 ├── MetaMask Wallet
 └── VPN Client
       ↓ HTTPS / WebSocket / Web3 / Encrypted
SERVER
 ├── Express API
 ├── Socket.io Server
 ├── Blockchain Service
 ├── VPN Tunnel
 └── MongoDB Database
       ↓
ETHEREUM BLOCKCHAIN
 └── Smart Contracts
# Setup blockchain
cd blockchain
npm install
npx hardhat node
npm run deploy:local
# Add MetaMask localhost network (Chain ID: 1337)
cd ..
npm run dev
