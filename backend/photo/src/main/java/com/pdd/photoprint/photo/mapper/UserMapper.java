package com.pdd.photoprint.photo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pdd.photoprint.photo.model.Users;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMapper extends BaseMapper<Users> {
    Users queryAnonymousUserByLoginName(String loginName);
}
