package controllers;

import LyLib.Interfaces.IConst;
import LyLib.Utils.MD5;
import LyLib.Utils.Msg;
import models.Router;
import play.libs.F;
import play.libs.Json;
import play.libs.ws.WS;
import play.mvc.Controller;
import play.mvc.Result;

public class RouterController extends Controller implements IConst {

    public static F.Promise<Result> getOnlineDevicesFromApi(long routerId) {
        Msg<String> msg = new Msg<>();

        Router found = Router.find.byId(routerId);
        play.Logger.info("get router online devices from api on router id: " + routerId);

        if (found == null) {
            msg.message = NO_FOUND;
            return F.Promise.promise(() -> ok(Json.toJson(msg)));
        }

        Long timestamp = System.currentTimeMillis() / 1000L;

        String paramsStr = String.format("{\"mac\":\"%s\",\"mobile\":%s}", found.name, found.bindPhone);

        String verifyStrBefore = String.format("%s%s%s%s%s", found.appId, found.secret,
                "app.api_v1.biz.GetDeviceListManfacturerBrandByMac", paramsStr, timestamp.toString());
        play.Logger.info("str before md5: " + verifyStrBefore);

        String verify = MD5.getMD5(verifyStrBefore);
        play.Logger.info("md5 verify: " + verify);

        String postData = String.format("app_id=%s&method=app.api_v1.biz.GetDeviceListManfacturerBrandByMac" +
                        "&timestamp=%s&params=%s&verify=%s", found.appId, timestamp.toString(),
                paramsStr, verify);
        play.Logger.info("postData: " + postData);

        return WS.url("https://api.hiwifi.com/call").setContentType("application/x-www-form-urlencoded")
                .post(postData).map(resp -> {
                    String respStr = resp.getBody();
                    play.Logger.info("response raw: " + respStr);

                    if (respStr.startsWith("{\"code\":0")) {
                        msg.flag = true;
                        msg.data = respStr;
                    } else {
                        msg.message = "无法获取数据,请咨询技术部";
                    }
                    return ok(Json.toJson(msg));
                });
    }

//    private static class hiWiFiApiDataParser1 {
//        public String method;
//        public int app_id;
//        public hiWiFiApiParamParser1 params;
//        public long timestamp;
//        public String verify;
//    }
//
//    private static class hiWiFiApiParamParser1 {
//        public String mac;
//        public long mobile;
//    }
}
