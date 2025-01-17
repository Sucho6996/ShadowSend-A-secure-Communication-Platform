# 🌌 **ShadowSend** - *Your Invisible Messenger* 🕵️‍♀️

**Welcome to ShadowSend!** A secure platform designed for ultimate message privacy using **Steganography** and **Encryption**. ShadowSend cleverly conceals your text within images, keeping your information safe and invisible!

---

## 🌟 **Core Features**

- **🔏 Secure Steganography**: Advanced bit manipulation conceals messages across RGB channels.
- **🖼️ Image Embedding**: Embed messages with no visible change in images.
- **📤 Easy Extraction**: Retrieve hidden text without knowing the length, thanks to delimiter-based extraction.
- **📱 OTP Verification**: Secure user authentication using Twilio's OTP services.
- **🛠️ Spring Boot**: Scalable backend with Spring Boot for streamlined management.

---

## 🛠️ **Tech Stack**

| **Tool**         | **Function**                             |
|------------------|------------------------------------------|
| 🟩 **Java**      | Core image processing logic              |
| 🌱 **Spring Boot** | Backend framework for secure communication |
| ⚙️ **Maven**     | Project build & dependencies             |
| 📷 **ImageIO**   | Java library for handling image formats  |
| ✉️ **Twilio**    | OTP service for user authentication      |

---

## 📦 **Getting Started**

1. **Clone the Repo**  
   ```bash
   git clone https://github.com/Sucho6996/ShadowSend-A-secure-Communication-Platform.git
   ```

2. **Navigate to Project**  
   ```bash
   cd ShadowSend-A-secure-Communication-Platform
   ```

3. **Install Dependencies**  
   ```bash
   mvn clean install
   ```

4. **Launch the Application**  
   ```bash
   mvn spring-boot:run
   ```

---

## 🚀 **How to Use**

### **Embed a Message in an Image**  

```java
SteganographyService stegoService = new SteganographyService();
byte[] imageWithMessage = stegoService.embedMessage(originalImageBytes, "Your secret message here");
```

### **Extract a Message from an Image**  

```java
String hiddenMessage = stegoService.extractMessage(imageWithMessageBytes);
```

> *Tip*: ShadowSend uses an 8-bit `00000000` delimiter for flexible message extraction.

---

## 🤝 **Contribute**

Love privacy as much as we do? Contribute by adding features, fixing issues, or enhancing functionality. **Fork, create PRs, and let’s make secure messaging accessible to all!**

---

## 📜 **License**

Licensed under the **MIT License** – See `LICENSE` for more.

Information related front end can be get from FrontEnd folder

