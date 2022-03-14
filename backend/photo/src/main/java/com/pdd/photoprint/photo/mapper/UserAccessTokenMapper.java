package com.pdd.photoprint.photo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pdd.photoprint.photo.model.UserAccessToken;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAccessTokenMapper extends BaseMapper<UserAccessToken> {
    UserAccessToken queryTokenByUserId(Integer userId);
}
