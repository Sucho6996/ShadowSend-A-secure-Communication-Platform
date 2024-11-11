🌐 ShadowSend: A Secure Communication Platform 🔒

Welcome to ShadowSend, a platform that brings next-level privacy to your communications! Using steganography and encryption, ShadowSend allows you to hide text messages within images, making your data virtually invisible to prying eyes. Perfect for secure messaging and protecting sensitive information in a creative way.

✨ Features

  •	🔐 Steganographic Encryption: Hide messages inside images with advanced bit manipulation across RGB channels.
  
  •	🖼️ Message Embedding: Conceal text in images without altering their appearance.
  
  •	📥 Message Extraction: Retrieve hidden messages using a unique delimiter-based extraction—no need for message length!
  
  •	🚀 Spring Boot Powered: Built with Spring Boot for easy scalability and integration.

🛠️ Technologies Used

  •	Java: Image manipulation and core steganography logic.
  
  •	Spring Boot: Backend framework for seamless service management.
  
  •	Maven: Project build and dependency management.
  
  •	ImageIO: Java library for image processing and manipulation.

📦 Installation

1.	Clone the Repository:

  git clone https://github.com/Sucho6996/ShadowSend-A-secure-Communication-Platform.git

2.	Navigate to the Project Directory:

  cd ShadowSend-A-secure-Communication-Platform

3.	Build the Project: Use Maven to build the project:

  mvn clean install

4.	Run the Application: Start the application using:

  mvn spring-boot:run

🚀 Quick Start

  🔹 Embedding a Message

To embed a message in an image:

  SteganographyService stegoService = new SteganographyService();

  byte[] imageWithMessage = stegoService.embedMessage(originalImageBytes, "Your secret message here");

🔹 Extracting a Message

  To extract an embedded message from an image:

  String hiddenMessage = stegoService.extractMessage(imageWithMessageBytes);

*Note: ShadowSend uses an 8-bit delimiter (00000000) at the end of each hidden message, enabling flexible extraction without needing the message length.*

🌱 Contributing

  We’d love your help! If you have ideas for new features, code improvements, or anything else, feel free to fork the repo, make changes, and submit a pull request. 😊

📜 License

  This project is licensed under the MIT License - see the LICENSE file for details.
________________________________________

