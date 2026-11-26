# 🌌 Midnight Vault

Midnight Vault is a secure, light-weight personal data locker built using HTML, vanilla JavaScript, Node.js, and an optimized local SQLite database backend. Featuring zero-knowledge intent, the client layout emphasizes local data privacy paradigms.

---

## 🛡️ Core Features

*   **Zero-Knowledge Context Layout:** Prominently highlights localized cryptographic architectures like **AES-256-GCM** and **Client-Side Encryption** mechanisms.
*   **Symmetric Vault Management:** Users can instantly provision an authentication session mapped to their secure local profile.
*   **Dual UI Profiles:** Includes a responsive UI with an integrated standard/dark-mode toggle configuration.
*   **Password Visibility Controls:** Easily switch between exposed text fields and dynamic masking representations using standard event listeners.
*   **SQLite Server Architecture:** Fast, file-based structured storage layer requiring zero cloud network provisioning or heavy background service dependencies.

---

## 🏗️ Technical Stack

*   **Frontend:** Semantic HTML5, CSS3, Vanilla JavaScript (ES6+ Architecture).
*   **Backend:** Node.js, Express.js micro-framework.
*   **Database:** SQLite (`sqlite3` module).
*   **Authentication Engine:** JSON Web Tokens (JWT) & `bcryptjs` for secure password hashing.

---

## 🚀 Getting Started

Follow these instructions to set up the repository environment on your local system.

### 📋 Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

### 📥 Installation & Setup

1. **Clone the project environment:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/private-notes-vault.git](https://github.com/YOUR_USERNAME/private-notes-vault.git)
   cd private-notes-vault/backend
