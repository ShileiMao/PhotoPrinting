package com.pdd.photoprint.photo.Configs.Security;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.pdd.photoprint.photo.Utils.DateHelper;
import com.pdd.photoprint.photo.mapper.UserAccessTokenMapper;
import com.pdd.photoprint.photo.model.UserAccessToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Calendar;
import java.util.Date;

@Slf4j
@Component
public class UserTokenValidator {
    private UserAccessTokenMapper tokenMapper;

    @Autowired
    public void setTokenMapper(UserAccessTokenMapper tokenMapper) {
        this.tokenMapper = tokenMapper;
    }

    public boolean validateToken(String userLogin, String token, String userType) {
        System.out.println("trying to verify user : " + userLogin);

        QueryWrapper<UserAccessToken> accessTokenQueryWrapper = new QueryWrapper<>();
        accessTokenQueryWrapper.lambda().eq(UserAccessToken::getAccessToken, token);

        UserAccessToken accessToken = tokenMapper.selectOne(accessTokenQueryWrapper);
        if(accessToken == null || accessToken.getExpires().before(new Date())) {
            tokenMapper.delete(accessTokenQueryWrapper);

            log.info("Access token expired or not exists: " + accessToken == null ? "" : accessToken.getAccessToken());
            return false;
        }

        // 修改有效时间
        Date date = new Date();
        Date expireDate = DateHelper.shiftDate(date, Calendar.MINUTE, 10);
        accessToken.setExpires(expireDate);

        log.info("extending valid time for token: " + token);
        tokenMapper.update(accessToken, accessTokenQueryWrapper);

        return true;
    }
}
