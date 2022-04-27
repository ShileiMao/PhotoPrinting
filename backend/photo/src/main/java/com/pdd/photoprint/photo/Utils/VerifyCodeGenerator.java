package com.pdd.photoprint.photo.Utils;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class VerifyCodeGenerator {
    private static int codeCount = 4;//Define the number of verification codes displayed on the picture
    private static int xx = 15;
    private static int codeY = 16;
    private static char[] codeSequence = {'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
            'S','T','U','V','W','X','Y','Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

    /**
     * Generate a map collection
     * code is the generated verification code
     * codePic is the generated verification code BufferedImage object
     * @return
     */
    public static Map<String,Object> generateCodeAndPic(int width, int height, int fontHeight) {
        //Define image buffer
        BufferedImage buffImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        //Graphics2D gd = buffImg.createGraphics();
        //Graphics2D gd = (Graphics2D) buffImg.getGraphics();
        Graphics gd = buffImg.getGraphics();
        //Create a random number generator class
        Random random = new Random();
        //Fill the image with white
        gd.setColor(Color.WHITE);
        gd.fillRect(0, 0, width, height);

        //Create a font, the font size should be based on the height of the picture.
        Font font = new Font("Fixedsys", Font.BOLD, fontHeight);
        //Set the font.
        gd.setFont(font);

        //Draw the border.
        gd.setColor(Color.BLACK);
        gd.drawRect(0, 0, width-1, height-1);

        //Randomly generate 40 interference lines, so that the authentication code in the image is not easily detected by other programs.
        gd.setColor(Color.BLACK);
        for (int i = 0; i <30; i++) {
            int x = random.nextInt(width);
            int y = random.nextInt(height);
            int xl = random.nextInt(12);
            int yl = random.nextInt(12);
            gd.drawLine(x, y, x + xl, y + yl);
        }

        //randomCode is used to save the randomly generated verification code for the user to verify after logging in.
        StringBuffer randomCode = new StringBuffer();
        int red = 0, green = 0, blue = 0, angle = 0;

        //Randomly generate a verification code with codeCount numbers.
        for (int i = 0; i <codeCount; i++) {
            //Get the randomly generated verification code number.
            String code = String.valueOf(codeSequence[random.nextInt(36)]);
            //Generate random color components to construct color values, so that the color value of each number output will be different.
            red = random.nextInt(255);
            green = random.nextInt(255);
            blue = random.nextInt(255);
            angle = random.nextInt(120);

            //Draw the verification code into the image with a randomly generated color.
            gd.setColor(new Color(red, green, blue));
//            gd.drawString(code, (i + 1) * xx, codeY);

//            drawRotate((Graphics2D) gd, (i + 1) * xx, codeY, angle,code, font);
            drawRotate((Graphics2D) gd, (i + 1) * xx, height / 2 - 5, angle,code, font);

            //Combine the four random numbers generated.
            randomCode.append(code);
        }

        gd.dispose();

        Map<String,Object> map =new HashMap<String,Object>();
        //Store verification code
        map.put("code", randomCode);
        //Store the generated verification code BufferedImage object
        map.put("codePic", buffImg);
        return map;
    }

    public static void drawRotate(Graphics2D g2d, double x, double y, int angle, String text, Font font) {
//        g2d.translate((float)x,(float)y);
//        g2d.rotate(Math.toRadians(angle));
//        g2d.drawString(text,(int)0,(int)0);
//        g2d.rotate(-Math.toRadians(angle));
//        g2d.translate(-(float)x,-(float)y);

        AffineTransform affineTransform = new AffineTransform();
        affineTransform.rotate(Math.toRadians(angle), 0, 0);
        Font rotatedFont = font.deriveFont(affineTransform);
        g2d.setFont(rotatedFont);
        g2d.drawString(text,(int)x,(int)y);

    }

    public static void main(String[] args) throws Exception {
        //Create file output stream object
        OutputStream out = new FileOutputStream("/Users/shileimao/Desktop/randomImgs/"+System.currentTimeMillis()+".jpg");
        Map<String,Object> map = VerifyCodeGenerator.generateCodeAndPic(120,50,30);
        ImageIO.write((RenderedImage) map.get("codePic"), "jpeg", out);
        System.out.println("The value of the verification code: "+map.get("code"));
    }
}
