package com.SuchoCryptoStego.Decryption.service;

import org.springframework.stereotype.Service;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import javax.imageio.ImageIO;

@Service
public class SteganographyService {

    public String extractMessage(byte[] imageBytes) throws IOException {
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
        return extractBinaryMessageWithBitFunction(image);
    }

    private String extractBinaryMessageWithBitFunction(BufferedImage image) {
        StringBuilder binaryMessage = new StringBuilder();
        int bitPosition = 0; // Cycle through bit positions (0, 1, 2) in the blue component
        String delimiter = "########"; // 8-bit delimiter marking the end of the message

        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                int pixel = image.getRGB(x, y);

                // Extract the blue component
                int blue = pixel & 0xFF;

                // Extract the bit at the current bit position
                int bit = (blue >> bitPosition) & 1;
                binaryMessage.append(bit);

                // Update bit position to cycle through 0, 1, and 2
                bitPosition = (bitPosition + 1) % 3;

                // Check if the last 8 bits match the delimiter
                if (binaryMessage.length() >= 8 && binaryMessage.substring(binaryMessage.length() - 8).equals(delimiter)) {
                    // Remove the delimiter and convert the binary message to text
                    return binaryToText(binaryMessage.substring(0, binaryMessage.length() - 8));
                }
            }
        }

        // If no delimiter is found, convert everything (failsafe)
        return binaryToText(binaryMessage.toString());
    }

    private String binaryToText(String binaryMessage) {
        StringBuilder text = new StringBuilder();

        // Process 8 bits at a time to convert binary to characters
        for (int i = 0; i <= binaryMessage.length() - 8; i += 8) {
            String byteString = binaryMessage.substring(i, i + 8);
            int charCode = Integer.parseInt(byteString, 2);
            text.append((char) charCode);
        }

        return text.toString();
    }
}
