package controllers;

import LyLib.Interfaces.IConst;
import LyLib.Utils.DateUtil;
import LyLib.Utils.StrUtil;
import com.avaje.ebean.Ebean;
import controllers.biz.ConfigBiz;
import me.chanjar.weixin.common.api.WxConsts;
import me.chanjar.weixin.common.bean.WxMenu;
import me.chanjar.weixin.common.bean.result.WxMediaUploadResult;
import me.chanjar.weixin.common.exception.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpInMemoryConfigStorage;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.api.WxMpServiceImpl;
import me.chanjar.weixin.mp.bean.WxMpCustomMessage;
import me.chanjar.weixin.mp.bean.result.WxMpOAuth2AccessToken;
import me.chanjar.weixin.mp.bean.result.WxMpQrCodeTicket;
import me.chanjar.weixin.mp.bean.result.WxMpUser;
import me.chanjar.weixin.mp.bean.result.WxMpUserList;
import models.Host;
import models.Partner;
import org.apache.commons.io.FileUtils;
import org.w3c.dom.Document;
import play.Play;
import play.libs.XPath;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;
import play.mvc.Security;

import javax.persistence.PersistenceException;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

public class WeiXinController extends Controller implements IConst {

    public static String wxMerchantId = "14470879";
    public static String wxMerchantApiKey = "c972e6bc45144730819b6efa99b34";

//    public static String wxSecretId = "c4769db99d42949c0bb63e498652e";
//    public static String wxAesKey = "YgVEG3AfIcq0ydGB5wftSwpF6XWZ7eaQhV1FXmz8";
//    public static String wxTokenStr = "fangdole";

    public static String lang = "zh_CN"; // 语言
    public static String getPrepayUrl = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    public static String doPayUrl = "http://funvantour.com/wxpay/pay/go";
    public static String notifyUrl = "http://funvantour.com/wxpay/pay/notify";

    public static String mediaId = "";

    public static WxMpService wxService;

    public static void wxInit() {
        WxMpInMemoryConfigStorage config = new WxMpInMemoryConfigStorage();
        play.Logger.info("create WxMpInMemoryConfigStorage class");
        config.setAppId(ConfigBiz.getStrConfig("weixin.appid")); // 设置微信公众号的appid
        config.setSecret(ConfigBiz.getStrConfig("weixin.secret")); //
        // 设置微信公众号的appcorpSecret
        config.setToken(ConfigBiz.getStrConfig("weixin.token")); // 设置微信公众号的token
        config.setAesKey(ConfigBiz.getStrConfig("weixin.aes")); //
        // 设置微信公众号的EncodingAESKey
        config.setPartnerId(wxMerchantId); //
        config.setPartnerKey(wxMerchantApiKey); //

        wxService = new WxMpServiceImpl();
        play.Logger.info("create WxMpService class");
        wxService.setWxMpConfigStorage(config);
        play.Logger.info("setWxMpConfigStorage");
        play.Logger.info("wx init finished");
    }

    @Security.Authenticated(SecuredSuperAdmin.class)
    public static Result syncUserInfo() {
        Integer procCount = 0;

        try {
            WxMpUserList wxUserList = wxService.userList("");
            play.Logger.info("all wxUserList: " + wxUserList.getCount());
            play.Logger.info("all wxUserList openid: " + wxUserList.getOpenIds().size());

            for (String userOpenIds : wxUserList.getOpenIds()) {
                play.Logger.info("#" + procCount);
                WxMpUser wxUser = wxService.userInfo(userOpenIds, lang);
                play.Logger.info("wx user: " + wxUser.getNickname() + ", | subscribe: " + wxUser.isSubscribe());

//				User user = User.find.where().eq("wxOpenId", wxUser.getOpenId()).findUnique();
                List<Host> tryFoundUser = Host.find.where().eq("wxId", wxUser.getOpenId()).orderBy("id").findList();
                Host user = null;
                if (tryFoundUser.size() > 0) {
                    user = tryFoundUser.get(0);// 总是使用ID靠前的用户
                }

                String nickName = util.EmojiFilter.filterEmoji(wxUser.getNickname());
                if (user != null) {
                    // 已有用户, 更新微信名和头像资料
                    user.name = nickName;
                    user.headImages = wxUser.getHeadImgUrl();
                    play.Logger.info(String.format("userId: %s, userName: %s, headimg: %s, unionId: %s",
                            wxUser.getOpenId(), wxUser.getNickname(), wxUser.getHeadImgUrl(), wxUser.getUnionId()));
                    try {
                        Ebean.update(user);
                        play.Logger.info("user update: " + user.id + " | " + nickName);
                        procCount++;
                    } catch (Exception ex) {
                        play.Logger.info("user update fail: " + user.id + " | " + nickName);
                    }
                } else {
                    // 关注公众号但没进入过商城的微信用户, 帮他建系统用户
                    if (wxUser.isSubscribe()) {
                        Host newUser = new Host();
                        newUser.name = nickName;
                        newUser.headImages = wxUser.getHeadImgUrl();
                        newUser.wxId = wxUser.getOpenId();
//						newUser.unionId = wxUser.getUnionId();
//						newUser.country = wxUser.getCountry();
//						newUser.province = wxUser.getProvince();
//						newUser.city = wxUser.getCity();
//						newUser.headImgUrl = wxUser.getHeadImgUrl();
                        newUser.sexEnum = wxUser.getSexId();
//						newUser.registerIP = "0.0.0.0";// 表示系统自动生成

//						newUser.resellerCode = User.generateResellerCode();// 分销码自动生成
//						try {
//							newUser.resellerCodeImage = generateResellerCodeBarcode(newUser.resellerCode);
//						} catch (Exception e) {
//							play.Logger.error(DateUtil.Date2Str(new Date()) + " - error on create reseller barcode: "
//									+ e.getMessage());
//						} // 分销二维码自动生成

                        play.Logger.info(String.format("userId: %s, userName: %s, headimg: %s, unionId: %s",
                                wxUser.getOpenId(), wxUser.getNickname(), wxUser.getHeadImgUrl(), wxUser.getUnionId()));
                        try {
                            Ebean.save(newUser);
                            play.Logger.info("新建未进入过商城的用户: " + newUser.id + " | " + nickName);
                            procCount++;
                        } catch (Exception ex) {
                            play.Logger.info("user create fail: " + nickName + ", ex: " + ex.getMessage());
                        }
                    }
                }
            }
        } catch (WxErrorException e) {
            return ok("sync all user info from weixin issue: " + e.getMessage());
        }
        play.Logger.info("sync all user info from weixin, total: " + procCount);
        return ok("sync all user info from weixin, total: " + procCount);
    }

    public static Result doWxUser(String code, String resellerCode, String state) {

        // get user info from url parameter 'code'
        play.Logger.info("wx code: " + code);
        play.Logger.info("resellerCode: " + resellerCode);
        play.Logger.info("state: " + state);

        try {
            WxMpOAuth2AccessToken wxMpOAuth2AccessToken = wxService.oauth2getAccessToken(code);
            String openId = wxMpOAuth2AccessToken.getOpenId();

            handleWxUser(openId, resellerCode);

            play.Logger.info("redirect after handleWxUser: " + state);
            return redirect(state);
//            switch (state) {
//                case "mine":
//                    Host found = Host.find.where().eq("wxId", openId).findUnique();
//                    if (found == null) return Results.notFound();
//                    return ok(mine.render(found));
//                default:
//                    List<Info> infos = Info.find.where().eq("classify", "幻灯").orderBy("indexNum").findList();
//                    List<Product> products = Product.find.where().eq("promote", true).eq("visible", true).eq("status", 0).orderBy("indexNum").findList();
//                    return ok(index.render(infos, products));
//            }
        } catch (WxErrorException e) {
            play.Logger.error("error on get wx token: " + e.getMessage());
            return Results.notFound();
        }
    }

    public static void handleWxUser(String openId, String resellerCode) throws WxErrorException {
        play.Logger.info("扫码用户处理: " + openId + " | " + resellerCode);
        session("WX_OPEN_ID", openId);
        play.Logger.info("wx open id: " + session("WX_OPEN_ID"));

        // get user other info by openId
        WxMpUser user = wxService.userInfo(openId, lang);
        if (user.isSubscribe()) {
            play.Logger.info(String.format("userId: %s, userName: %s, sex: %s, unionId: %s", user.getOpenId(),
                    user.getNickname(), user.getSexId(), user.getUnionId()));
            session("WX_NAME", user.getNickname());
        } else {
            play.Logger.info(String.format("user not subscribe, userId: %s", user.getOpenId()));
        }

        // 检查是否已经有关联用户
        List<Host> tryFoundUser = Host.find.where().eq("wxId", openId).orderBy("id").findList();
        Host found = null;
        if (tryFoundUser.size() > 0) {
            found = tryFoundUser.get(0);// 总是使用ID靠前的用户
        }

        if (found == null) {
            play.Logger.info("扫码用户注册: " + openId + " | " + resellerCode);
            // 无则注册
            session(SESSION_USER_NAME, "");
            session(SESSION_USER_ID, "");

            Host newObj = new Host();
            newObj.wxId = openId;
//			newObj.registerIP = request().remoteAddress();

            if (user.isSubscribe()) {
//                newObj.unionId = user.getUnionId();
                newObj.name = util.EmojiFilter.filterEmoji(user.getNickname());
//                newObj.country = user.getCountry();
//                newObj.province = user.getProvince();
//                newObj.city = user.getCity();
                newObj.headImages = user.getHeadImgUrl();
                newObj.sexEnum = user.getSexId();
                play.Logger.info("wx user register: " + newObj.name);
            } else {
                play.Logger.info("wx user not subscribe register: " + user.getOpenId());
            }

//            newObj.resellerCode = User.generateResellerCode();// 分销码自动生成
//            try {
//                newObj.resellerCodeImage = generateResellerCodeBarcode(newObj.resellerCode);
//            } catch (Exception e) {
//                play.Logger.error(
//                        DateUtil.Date2Str(new Date()) + " - error on create reseller barcode: " + e.getMessage());
//            } // 分销二维码自动生成
//
            // handle上线用户
            if (!StrUtil.isNull(resellerCode)) {
                Partner partner = Partner.find.where().eq("comment", resellerCode).findUnique();
                if (partner != null) {
                    newObj.refPartnerId = partner.id;
                    newObj.partner = partner;
                    play.Logger.info("用户的上线: " + partner.name);
                }
            }
//
////			Ebean.save(newObj);
            try {
                Ebean.save(newObj);
            } catch (PersistenceException ex) {
                play.Logger.error("创建用户遇到昵称火星文错误: " + ex.getMessage());
                newObj.name = "[表情]";
                Ebean.save(newObj);
            }

            session(SESSION_USER_ID, newObj.id.toString());

            if (user.isSubscribe()) {
                session(SESSION_USER_NAME, newObj.name);
            }
        } else {
            play.Logger.info("扫码用户登录: " + openId + " | " + resellerCode);
            // 否则写session
            session(SESSION_USER_ID, found.id.toString());

            if (user.isSubscribe()) {
                play.Logger.info("wx user login: " + user.getNickname());
                // handle not subscribe user info
                if (StrUtil.isNull(found.name)) {
//                    found.unionId = user.getUnionId();

                    found.name = util.EmojiFilter.filterEmoji(user.getNickname());
//                    found.country = user.getCountry();
//                    found.province = user.getProvince();
//                    found.city = user.getCity();
                    found.headImages = user.getHeadImgUrl();
                    found.sexEnum = user.getSexId();
                    play.Logger.info("该用户先前未关注, so获取用户额外资料: " + found.name);
                    try {
                        Ebean.update(found);
                    } catch (PersistenceException ex) {
                        play.Logger.error("该用户先前未关注, so获取用户额外资料遇到昵称火星文错误: " + ex.getMessage());
                        found.name = "[表情]";
                        Ebean.update(found);
                    }
                }
                session(SESSION_USER_NAME, found.name);
            } else {
                play.Logger.info("wx user login: " + user.getOpenId());
            }
            // handle上线用户(若之前有, 则不作更新处理)
            if (!StrUtil.isNull(resellerCode) && found.partner == null) {
                Partner partner = Partner.find.where().eq("comment", resellerCode).findUnique();
                if (partner != null) {
                    found.refPartnerId = partner.id;
                    found.partner = partner;
                    Ebean.update(found);
                    play.Logger.info("用户的上线: " + partner.name);
                }
            }
        }
    }

    public static String changeCharset(String str, String newCharset) throws UnsupportedEncodingException {
        if (str != null) {
            // 用默认字符编码解码字符串。
            byte[] bs = str.getBytes();
            // 用新的字符编码生成字符串
            return new String(bs, newCharset);
        }
        return null;
    }

    // 公众号二维码相关 -----------

    //    @Security.Authenticated(SecuredSuperAdmin.class)
//    public static Result renewAllUserBarcode() {
//        play.Logger.info(DateUtil.Date2Str(new Date()) + " - " + request().method() + ": " + request().uri()
//                + " | DATA: " + request().body().asJson());
//
//        List<User> foundList = User.findAll();
//
//        for (User user : foundList) {
//            try {
//                String barcodeFilename = generateResellerCodeBarcode(user.resellerCode);
//                user.resellerCodeImage = barcodeFilename;
//                Ebean.update(user);
//                play.Logger.info("renew user barcode success: " + barcodeFilename);
//            } catch (Exception ex) {
//                play.Logger.error("renew user barcode fail, id: " + user.id.toString() + ", " + ex.getMessage());
//            }
//        }
//        play.Logger.info("renew all user barcode success: " + foundList.size());
//        return ok("renew all user barcode success: " + foundList.size());
//    }
//
    public static String generateResellerCode() {
        // 时间+4位字母
        String code = DateUtil.Date2Str(new Date(), "yyyyMMddHHmmss") + getRamdonLetter()
                + getRamdonLetter() + getRamdonLetter() + getRamdonLetter();
        code = code.toUpperCase();
        play.Logger.error(DateUtil.Date2Str(new Date()) + " - create reseller code: " + code);
        return code;
    }

    public static char getRamdonLetter() {
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return chars.charAt((int) (Math.random() * 52));
    }

    public static String generateResellerCodeBarcode(String resellerCode) {
        if (StrUtil.isNull(resellerCode)) {
            play.Logger.error("微信获取二维码参数错误, resellerCode: " + resellerCode);
            return null;
        }

        WxMpQrCodeTicket ticket = null;
        try {
            ticket = wxService.qrCodeCreateLastTicket(resellerCode);
            play.Logger.info("微信获取二维码票据: " + resellerCode);
        } catch (WxErrorException e) {
            play.Logger.error("微信获取二维码票据错误: " + e.getMessage());
            return null;
        }

        String path = Play.application().path().getPath() + "/public/barcode/";
        String destFileName = resellerCode + ".jpg";
        try {
            // 获得一个在系统临时目录下的文件，是jpg格式的
            File file = wxService.qrCodePicture(ticket);
            FileUtils.copyFile(file, new File(path + destFileName));

            FileUtils.copyFile(file, new File(Play.application().path().getPath() + "/public/upload/" + resellerCode));
            FileUtils.copyFile(file, new File(Play.application().path().getPath() + "/public/thumb/" + resellerCode));
            FileUtils.copyFile(file, new File(Play.application().path().getPath() + "/public/mid_thumb/" + resellerCode));
            play.Logger.info("微信获取二维码: " + path + destFileName);
        } catch (Exception e) {
            play.Logger.error("微信获取二维码图片错误: " + e.getMessage());
            return null;
        }
        return destFileName;
    }

    // 公众号服务器校验,通知,菜单 -----------

    public static Result serverVerify(String signature, String timestamp, String nonce, String echostr) {
        play.Logger.info(DateUtil.Date2Str(new Date()) + " - " + request().method() + ": " + request().uri()
                + " | DATA: " + request().body().asJson());

        String resultStr = String.format(" - result: signature=%s, timestamp=%s, nonce=%s, echostr=%s", signature,
                timestamp, nonce, echostr);
        play.Logger.info(DateUtil.Date2Str(new Date()) + resultStr);

        if (checkSignature(signature, timestamp, nonce)) {
            play.Logger.info("weixin server verify success: " + echostr);
            return ok(echostr);
        }
        play.Logger.info("weixin server verify fail");
        return notFound();
    }

    //    public static Result sendMsg(String openId, String msg) {
////		Ticket order = Ticket.find.where().eq("name", "100100100").findUnique();
//        try {
////			// 给管理员推送下单信息
////			// String adminMessageText = "";
////			// String adminid = "oJj7gvyIHkoC0nfGI2mmss9dzZRA";
////			StringBuffer buffer = new StringBuffer();
////			buffer.append("新订单到达！").append("\n\n");
////			buffer.append("订单号为：" + order.name).append("\n");
////			buffer.append("下单时间：" + order.createdAtStr).append("\n");
////			if (StrUtil.isNotNull(order.payTime))
////				buffer.append("支付时间：" + DateUtil.Date2Str(DateUtil.Str2Date(order.payTime, "yyyyMMddHHmmss")))
////						.append("\n");
////			else
////				buffer.append("尚未支付").append("\n");
////			if (order.buyer != null && StrUtil.isNotNull(order.buyer.name)) {
////				buffer.append("买家微信：").append("\n");
////				buffer.append(order.buyer.name).append("\n\n");
////			} else {
////				buffer.append("买家微信：此买家暂无昵称").append("\n\n");
////			}
////			buffer.append("收货人：").append("\n");
////			buffer.append(order.shipName).append("\n");
////			buffer.append("电话：").append("\n");
////			buffer.append(order.shipPhone).append("\n");
////			buffer.append("送货区域：").append("\n");
////			buffer.append(order.shipZone).append("\n");
////			buffer.append("送货街道：").append("\n");
////			buffer.append(order.shipArea).append("\n");
////			buffer.append("详细地址：").append("\n");
////			buffer.append(order.shipLocation).append("\n");
////			buffer.append("客户留言：").append("\n");
////			buffer.append(order.liuYan).append("\n\n");
////			buffer.append("菜品：").append("\n\n");
////
////			if (order.products.size() > 0) {
////				for (int i = 0; i < order.products.size(); i++) {
////					buffer.append(order.products.get(i).name + " " + order.quantity + " * " + order.price)
////							.append("\n");
////				}
////			} else {
////				buffer.append("订单无货品，请在后台查看！ 订单号为： ").append("\n");
////				buffer.append(order.name).append("\n");
////			}
////			buffer.append("\n");
////			buffer.append("订单总额：").append("\n");
////			buffer.append(order.amount).append("\n");
////			buffer.append("---------------").append("\n\n");
////
////			msg = buffer.toString();
//
//            // "\n" + productName;
//            WxMpCustomMessage adminMessage = WxMpCustomMessage.TEXT().toUser(openId).content(msg).build();
//            wxService.customMessageSend(adminMessage);
//
//            // 结束
//            play.Logger.info("通知用户:" + openId + ", msg: " + msg);
//
//        } catch (WxErrorException e) {
//            play.Logger.error("通知用户:" + openId + ", msg: " + msg + ". ex: " + e.getMessage());
//        }
//        return ok("订单通知已发送：" + msg);
//    }
//
    public static void sendMsgToWxUser(String openId, String msg) {
        try {
            StringBuffer buffer = new StringBuffer();
            buffer.append(msg).append("\n\n");

            msg = buffer.toString();

            WxMpCustomMessage adminMessage = WxMpCustomMessage.TEXT().toUser(openId).content(msg).build();
            wxService.customMessageSend(adminMessage);

            // 结束
            play.Logger.info("通知用户:" + openId + ", msg: " + msg);
        } catch (WxErrorException e) {
            play.Logger.error("通知用户:" + openId + ", msg: " + msg + ". ex: " + e.getMessage());
        }
    }

    public static void sendImgToWxUser(String openId, String mediaId) {
        if (StrUtil.isNull(mediaId)) {
            play.Logger.error("WX发送图片失败, 无media_id");
            return;
        }
        try {
            WxMpCustomMessage imgMessage = WxMpCustomMessage
                    .IMAGE()
                    .toUser(openId)
                    .mediaId(mediaId)
                    .build();
            wxService.customMessageSend(imgMessage);
            play.Logger.info("WX发送图片:" + openId + ", msg: " + mediaId);
        } catch (WxErrorException e) {
            play.Logger.error("WX发送图片:" + openId + ", msg: " + mediaId + ". ex: " + e.getMessage());
        }
    }

//    public static void sendOrderMsgToWxUser(String openId, Ticket order) {
//        String msg = "";
//        try {
//            StringBuffer buffer = new StringBuffer();
//            buffer.append("新订单到达！").append("\n\n");
//
//            buffer.append("店铺：").append("\n");
//            Store store = Store.find.byId(order.refStoreId);
////			buffer.append(store.area.toUpperCase()).append("\n");
//
//            buffer.append("订单号为：").append("\n");
//            buffer.append(order.name.toUpperCase()).append("\n");
//            buffer.append("下单时间：").append("\n");
//            buffer.append(order.createdAt).append("\n");
//            if (StrUtil.isNotNull(order.payTime)) {
//                buffer.append("支付时间：").append("\n");
//                buffer.append(DateUtil.Date2Str(DateUtil.Str2Date(order.payTime, "yyyyMMddHHmmss"))).append("\n");
//            } else
//                buffer.append("尚未支付").append("\n");
//            if (order.user != null && StrUtil.isNotNull(order.user.name)) {
//                buffer.append("买家微信：").append("\n");
//                buffer.append(order.user.name).append("\n\n");
//            } else {
//                buffer.append("买家微信：此买家暂无昵称").append("\n\n");
//            }
////			buffer.append("收货人：").append("\n");
////			buffer.append(order.shipName).append("\n");
////			buffer.append("电话：").append("\n");
////			buffer.append(order.shipPhone).append("\n");
////			buffer.append("送货区域：").append("\n");
////			buffer.append(order.shipZone).append("\n");
////			buffer.append("送货街道：").append("\n");
////			buffer.append(order.shipArea).append("\n");
////			buffer.append("详细地址：").append("\n");
////			buffer.append(order.shipLocation).append("\n");
////			buffer.append("客户留言：").append("\n");
////			buffer.append(order.liuYan).append("\n\n");
////			buffer.append("菜品：").append("\n\n");
//
//            if (order.products.size() > 0) {
//                List<Integer> quantityList = StrUtil.getIntegerListFromSplitStr(order.quantity);
//                for (int i = 0; i < order.products.size(); i++) {
//                    buffer.append(order.products.get(i).name + " " + quantityList.get(i) + " × "
//                            + order.products.get(i).price).append("\n");
//                }
//            } else {
//                buffer.append("订单无货品，请在后台查看！ 订单号为： ").append("\n");
//                buffer.append(order.name).append("\n");
//            }
//            buffer.append("\n");
//            buffer.append("订单总额：").append(order.amount).append("\n");
//            buffer.append("---------------").append("\n\n");
//
//            msg = buffer.toString();
//
//            // "\n" + productName;
//            WxMpCustomMessage adminMessage = WxMpCustomMessage.TEXT().toUser(openId).content(msg).build();
//            wxService.customMessageSend(adminMessage);
//
//            // 结束
//            play.Logger.info("通知用户:" + openId + ", msg: " + msg);
//        } catch (WxErrorException e) {
//            play.Logger.error("通知用户:" + openId + ", msg: " + msg + ". ex: " + e.getMessage());
//        }
//    }

    public static Result addMenu() {
        WxMenu wxMenu = new WxMenu();

        // 租金所(收租金, 随借随还), 我是房东, 合作伙伴

        // 第一个按钮
//        WxMenu.WxMenuButton button1_1 = new WxMenu.WxMenuButton();
//        button1_1.setType("view");
//        button1_1.setName("收租金");
//        button1_1.setUrl("http://fangdl.woyik.com");
//
//        WxMenu.WxMenuButton button1_2 = new WxMenu.WxMenuButton();
//        button1_2.setType("view");
//        button1_2.setName("随借随还");
//        button1_2.setUrl("http://fangdl.woyik.com/p/product/all");
//
//        List<WxMenu.WxMenuButton> button1List = new ArrayList<>();
//        button1List.add(button1_1);
//        button1List.add(button1_2);
//
//        WxMenu.WxMenuButton button1 = new WxMenu.WxMenuButton();
//        button1.setSubButtons(button1List);
//        button1.setName("租金所");

        WxMenu.WxMenuButton button1 = new WxMenu.WxMenuButton();
        button1.setType("view");
        button1.setName("租约钱包");
        button1.setUrl("http://fangdl.woyik.com/p/product/fix/sjsh");

        // 第二个按钮
        WxMenu.WxMenuButton button2 = new WxMenu.WxMenuButton();
        button2.setType("view");
        button2.setName("个人中心");
        button2.setUrl("http://fangdl.woyik.com/p/mine");

//        WxMenu.WxMenuButton button3 = new WxMenu.WxMenuButton();
//        button3.setType("view");
//        button3.setName("合作伙伴");
//        button3.setUrl("http://fangdl.woyik.com/p/partner");

//        WxMenu.WxMenuButton button2 = new WxMenu.WxMenuButton();
//        button2.setType("view");
//        button2.setName("金融产品");
//        button2.setUrl("http://fangdl.woyik.com/p/product/all");

        // 第三个按钮集合
        WxMenu.WxMenuButton button3_1 = new WxMenu.WxMenuButton();
        button3_1.setType("view");
        button3_1.setName("合作伙伴");
        button3_1.setUrl("http://fangdl.woyik.com/p/partner");

        WxMenu.WxMenuButton button3_2 = new WxMenu.WxMenuButton();
        button3_2.setType("view");
        button3_2.setName("还款人");
        button3_2.setUrl("http://fangdl.woyik.com/p/partner/login");

        List<WxMenu.WxMenuButton> button3List = new ArrayList<>();
        button3List.add(button3_1);
        button3List.add(button3_2);

        WxMenu.WxMenuButton button3 = new WxMenu.WxMenuButton();
        button3.setSubButtons(button3List);
        button3.setName("合作伙伴");

        List<WxMenu.WxMenuButton> buttons = new ArrayList<>();
        buttons.add(button1);
        buttons.add(button2);
        buttons.add(button3);
        wxMenu.setButtons(buttons);

        try {
            wxService.menuCreate(wxMenu);
            play.Logger.info("新增菜单成功: " + wxMenu.toString());
        } catch (WxErrorException e) {
            play.Logger.error("微信新增菜单错误: " + e.getMessage());
            return notFound("微信新增菜单错误: " + e.getMessage());
        }
        return ok("新增菜单成功: " + wxMenu.toString());
    }

    //用户在公众号的一切操作，微信都会调这个接口通知我们
    public static Result serverNotification() {
        play.Logger.info(DateUtil.Date2Str(new Date()) + " - " + request().method() + ": " + request().uri()
                + " | DATA: " + request().body().toString());

        Document doc = request().body().asXml();
        if (doc == null) {
            play.Logger.error("null xml notify from wx");
            return ok("");
        }

        String openId = XPath.selectText("//FromUserName", doc);// 发送方帐号（一个OpenID）
        String createTime = XPath.selectText("//CreateTime", doc);
        String msgType = XPath.selectText("//MsgType", doc);// 消息类型，event
        String event = XPath.selectText("//Event", doc);// 事件类型，subscribe(关注)、SCAN(扫码)
        String eventKey = XPath.selectText("//EventKey", doc);// 扫二维码带的小尾巴scene_id
        String ticket = XPath.selectText("//Ticket", doc);// 二维码的ticket，可用来换取二维码图片

        // 处理关注以及扫码, 按openid注册用户, 并把上线绑定(scene_id即分销码)
        if ("event".equals(msgType) && ("subscribe".equals(event) || "SCAN".equals(event))) {
            try {
                play.Logger.info("接收微信通知: [" + event + "], eventKey: " + eventKey);
                handleWxUser(openId, eventKey.replace("qrscene_", ""));

                // 推送一个关注后的消息
//                sendMsgToWxUser(openId, "房东您好，欢迎光临租金所。我们给您提供一个预支平台，您可以利用房子的租约授信，预支未来的房租收入。真正做到：租约授信，预支未来。");
                sendImgToWxUser(openId, mediaId);
            } catch (WxErrorException e) {
                play.Logger.error("接收微信通知错误: [" + event + "], ex: " + e.getMessage());
            }
        }

        // 点击普通按钮的处理, 如"关于xx"
        // if ("event".equals(msgType) && "CLICK".equals(event)) {
        // try {
        // play.Logger.info("接收微信通知: [" + event + "], eventKey: " + eventKey);
        //
        // // 设置消息的内容等信息
        // String wxMessageText =
        // "东莞市龙鑫酒业有限公司，社交个性定制酒专业服务商。\n\n主要生产、销售“龍鑫浩然”品牌系列茅台镇酱香型白酒。
        // 我们坚守传承茅台镇酿酒传统工艺，传递东方古老酱香型白酒养生文化，倡导责任、信任、关爱、尊重的价值观，专注为个人收藏、企业庆典、婚宴、私人聚会、生日、寿宴、社交送礼等提供个性化定制酒服务。
        // 以个性化定制酒为载体，帮助客户在不同社交场合更好的表达自我，传情达意。让定制者体现无法复制的身份，是定制者个人品味的外延与价值彰显的载体。
        // \n龙鑫酒业在广东东莞、贵州仁怀茅台镇设立总办事处，在全国各省、市设立分办事处，属一家大型专业性的辐射全国的酒业销售公司。\n\n全国服务热线：400-8080-298\n东莞市龙鑫酒业有限公司\n地址：东莞市樟木头镇长虹百汇23栋1077号\n电话：0769-86051510";
        // WxMpCustomMessage wxMessage = WxMpCustomMessage
        // .TEXT()
        // .toUser(openId)
        // .content(wxMessageText)
        // .build();
        // wxService.customMessageSend(wxMessage);
        // play.Logger.info("发送按钮点击消息给用户: " + eventKey);
        // } catch (WxErrorException e) {
        // play.Logger.error("接收微信通知错误: [" + event + "], ex: " +
        // e.getMessage());
        // }
        // }
        return ok("");
    }

    public static boolean checkSignature(String signature, String timestamp, String nonce) {
        String[] arr = new String[]{ConfigBiz.getStrConfig("weixin.token"), timestamp, nonce};
        // 将token、timestamp、nonce三个参数进行字典序排序
        Arrays.sort(arr);
        StringBuilder content = new StringBuilder();
        for (int i = 0; i < arr.length; i++) {
            content.append(arr[i]);
        }
        MessageDigest md = null;
        String tmpStr = null;

        try {
            md = MessageDigest.getInstance("SHA-1");
            // 将三个参数字符串拼接成一个字符串进行sha1加密
            byte[] digest = md.digest(content.toString().getBytes());
            tmpStr = byteToStr(digest);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        content = null;
        // 将sha1加密后的字符串可与signature对比，标识该请求来源于微信
        return tmpStr != null ? tmpStr.equals(signature.toUpperCase()) : false;
    }

    private static String byteToStr(byte[] byteArray) {
        String strDigest = "";
        for (int i = 0; i < byteArray.length; i++) {
            strDigest += byteToHexStr(byteArray[i]);
        }
        return strDigest;
    }

    private static String byteToHexStr(byte mByte) {
        char[] Digit = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
        char[] tempArr = new char[2];
        tempArr[0] = Digit[(mByte >>> 4) & 0X0F];
        tempArr[1] = Digit[mByte & 0X0F];

        String s = new String(tempArr);
        return s;
    }

    // deprecated below ------------------ consider move to util class

    // get seconds from 1970
    private static String createTimestamp() {
        return Long.toString(System.currentTimeMillis() / 1000);
    }

    // wx pay ramdon string
    private static String createNonceStr() {
        return UUID.randomUUID().toString();
    }

    public static void uploadImage() {
        String imgFile = Play.application().path().getPath() + "\\public\\images\\welcome.jpg";
        File file = new File(imgFile);
        WxMediaUploadResult res = null;
        try {
            res = wxService.mediaUpload(WxConsts.MEDIA_IMAGE, file);
            mediaId = res.getMediaId();
            play.Logger.info("WX上传图片: " + mediaId);
        } catch (WxErrorException e) {
            play.Logger.info("WX上传图片失败: " + e.getMessage());
        }
    }
}
