package com.pdd.photoprint.photo.Utils;

import com.pdd.photoprint.photo.mapper.UserAccessTokenMapper;
import com.pdd.photoprint.photo.model.UserAccessToken;
import com.pdd.photoprint.photo.model.Users;
import org.apache.tomcat.util.buf.HexUtils;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Calendar;
import java.util.Date;

public class AccessTokenGenerator {
    public static String generateAccessToken(String orginal, String salt) throws NoSuchAlgorithmException {
        String signOringal = orginal + salt;
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] encodedhash = digest.digest(signOringal.getBytes(StandardCharsets.UTF_8));
        return HexUtils.toHexString(encodedhash);
    }

    public static String refreshUserAccessToken(Users user, String loginName, UserAccessTokenMapper userAccessTokenMapper) throws NoSuchAlgorithmException {
        UserAccessToken accessToken = userAccessTokenMapper.queryTokenByUserId(user.getId());

        int random = (int)(Math.random() * 100000);

        if(accessToken != null) {
            userAccessTokenMapper.deleteById(accessToken.getUserId());
        }

        String token = AccessTokenGenerator.generateAccessToken(loginName, random + "");

        UserAccessToken newToken = new UserAccessToken();
        newToken.setAccessToken(token);

        Date date = new Date();
        newToken.setExpires(DateHelper.shiftDate(date, Calendar.MINUTE, 10));

        newToken.setUserId(user.getId());

        userAccessTokenMapper.insert(newToken);

        return newToken.getAccessToken();
    }
}
