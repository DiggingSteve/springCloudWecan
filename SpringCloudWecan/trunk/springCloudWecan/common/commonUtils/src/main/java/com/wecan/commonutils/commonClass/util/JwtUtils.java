package com.wecan.commonutils.commonClass.util;

import com.alibaba.fastjson.JSON;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.wecan.commonutils.commonClass.result.ReturnResult;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtUtils {

    /**
     * token密钥
     */
    private static final String SECRET = "WeCan";

    /**
     * token有效日期,7天
     */
    private static final int TOKEN_EXP = 1000 * 60 * 60 * 24 * 7;

    public static ReturnResult createToken(Object user) {
        try {
            Map<String, Object> map = new HashMap<>();
            map.put("alg", "HS256");
            map.put("typ", "JWT");

            String token = JWT.create().withHeader(map)
                    .withClaim("iss", "rooney-server")//签发人
                    .withClaim("aud", "app")//受众
                    .withClaim("user", null == user ? "" : JSON.toJSONString(user))//自定义字段
                    .withIssuedAt(new Date())//签发日期
                    .withExpiresAt(new Date(System.currentTimeMillis() + TOKEN_EXP))//过期日期
                    .sign(Algorithm.HMAC256(SECRET));//签名

            return ReturnResult.success().putData("token", token);
        } catch (Exception e) {
            e.printStackTrace();
            return ReturnResult.error().changeMessage("创建token失败");
        }
    }

    /**
     * 验证token
     *
     * @param token
     * @return
     */
    public static ReturnResult verifyToken(String token) {
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SECRET)).build();
            DecodedJWT jwt = verifier.verify(token);

            //获取token用户信息
            if (jwt == null || jwt.getClaim("user").isNull() || "".equalsIgnoreCase(jwt.getClaim("user").asString())) {
                return ReturnResult.error().changeMessage("缺少用户信息");
            }

            return ReturnResult.success().putData("user", jwt.getClaim("user").asString());

        } catch (IllegalArgumentException e) {
            return ReturnResult.error().changeMessage("token非法");
        } catch (JWTVerificationException e) {
            return ReturnResult.error().changeMessage("token已过期");
        } catch (Exception e) {
            return ReturnResult.error().changeMessage(e.getMessage());
        }
    }
}
