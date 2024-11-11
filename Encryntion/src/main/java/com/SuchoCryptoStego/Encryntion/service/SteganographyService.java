package com.SuchoCryptoStego.Encryntion.service;

import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;

@Service
public class SteganographyService {

    public byte[] embedMessage(byte[] imageBytes, String message) throws IOException {
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
        String binaryMessage = convertMessageToBinary(message);
        embedBinaryMessageWithBitFunction(image, binaryMessage);
        return imageToByteArray(image);
    }

    private String convertMessageToBinary(String message) {
        String delimiter = "########"; // 8-bit delimiter marking the end of the message
        String messageWithDelimiter=message+delimiter;
        StringBuilder binaryMessage = new StringBuilder();
        for (char c : messageWithDelimiter.toCharArray()) {
            binaryMessage.append(String.format("%8s", Integer.toBinaryString(c)).replace(' ', '0'));
        }
        return binaryMessage.toString();
    }

    private void embedBinaryMessageWithBitFunction(BufferedImage image, String binaryMessage) {
        int messageIndex = 0;
        int bitPosition = 0; // Cycle through bit positions (0, 1, 2) for the blue component

        for (int y = 0; y < image.getHeight() && messageIndex < binaryMessage.length(); y++) {
            for (int x = 0; x < image.getWidth() && messageIndex < binaryMessage.length(); x++) {
                int pixel = image.getRGB(x, y);

                // Extract RGB components
                int red = (pixel >> 16) & 0xFF;
                int green = (pixel >> 8) & 0xFF;
                int blue = pixel & 0xFF;

                // Determine the bit position to modify (0, 1, or 2)
                int bitValue = binaryMessage.charAt(messageIndex) - '0';
                blue = modifyBit(blue, bitPosition, bitValue);

                // Update bit position to cycle through 0, 1, and 2
                bitPosition = (bitPosition + 1) % 3;
                messageIndex++;

                // Combine modified RGB back into pixel
                int newPixel = (red << 16) | (green << 8) | blue;
                image.setRGB(x, y, newPixel);
            }
        }
    }

    private int modifyBit(int colorComponent, int bitPosition, int bitValue) {
        // Modify the specified bit of the color component to be `bitValue`
        return (colorComponent & ~(1 << bitPosition)) | (bitValue << bitPosition);
    }

    private byte[] imageToByteArray(BufferedImage image) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", bos);
        return bos.toByteArray();
    }
}
