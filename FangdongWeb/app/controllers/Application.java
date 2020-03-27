package controllers;

import LyLib.Interfaces.IConst;
import LyLib.Utils.StrUtil;
import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.databind.JsonNode;
import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;
import controllers.biz.AdminBiz;
import controllers.biz.ConfigBiz;
import controllers.biz.HostBiz;
import models.*;
import play.data.Form;
import play.i18n.Lang;
import play.libs.F;
import play.libs.ws.WS;
import play.libs.ws.WSResponse;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;
import play.mvc.WebSocket;
import views.html.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import static play.data.Form.form;

public class Application extends Controller implements IConst {
    public static boolean taskFlag = true;
    public static String dbType = "";
    public static String dbUser = "";
    public static String dbPsw = "";
    public static String dbName = "";
    public static String mysqlBinDir = "";

    // 即时通讯频道(可组装成hashmap来区分不同的channel)
    public static ArrayList<WebSocket.Out> channels = new ArrayList<>();

    // connect & echo
    public static WebSocket<String> webSocket() {
        return WebSocket.whenReady((in, out) -> {
            // 收到消息事件
            in.onMessage((msg) -> {
                play.Logger.info("chat: " + msg);
            });

            // 断开事件
            in.onClose(() -> {
                play.Logger.info("您已断开连接！");
            });

            // 连接成功事件(可不设置)
            play.Logger.info("WebSocket 连接成功.");
//            out.write("您已连接!");

            // 收集所有的连接
            channels.add(out);
        });
    }

    // server push
    public static Result chat(String msg) {
        for (WebSocket.Out channel : channels) {
            channel.write(msg);
        }
        return ok();
    }

    public static Result checkAlive() {
        return ok("alive");
    }

    public static Result cfgSelfCheck() {
        if (ConfigBiz.selfCheck4All()) {
            return ok("all cfg pass self check.");
        } else {
            return ok("all cfg NOT pass self check.");
        }
    }

    public static Result login() {
//        session().clear();
//        session("login_user_name", admin.name);
//        session(SESSION_USER_ID, admin.id.toString());
        return Results.TODO;
    }
//
//    public static Result logout() {
//        session().clear();
//        return redirect(routes.Application.login());
//    }

    public static Result backendPage() {
        return redirect("/admin/admin");
    }

    public static Result backendLogin() {
        Admin admin = AdminBiz.findByloginName(session(SESSION_USER_NAME));
        if (admin != null && admin.userRoleEnum > 0) {
            return redirect("/admin/admin");
        } else
            return ok(backend_login.render(form(AdminLoginParser.class)));
    }

    public static F.Promise<Result> backendAuthenticate() {
        Form<AdminLoginParser> loginForm = form(AdminLoginParser.class).bindFromRequest();
        if (loginForm.hasErrors()) {
            play.Logger.error("admin login form error: " + loginForm.errors().toString());
            flash("logininfo", loginForm.globalError().message());
            return F.Promise.promise(() -> redirect(routes.Application.backendLogin()));
        } else {
            session().clear();
            Admin admin = AdminBiz.findByloginName(loginForm.get().username);

            if (admin != null) {
                Integer role = admin.userRoleEnum;
                if (role > 0) {
                    // 1管理员, 2超级管理员
                    // 更新最后一次登录的IP
                    // 异步获取登录ip地
                    admin.lastLoginIp = request().remoteAddress();
                    play.Logger.info("admin login on ip: " + admin.lastLoginIp);
                    admin.lastLoginTime = new Date();
                    session("admin_login_timeout", LyLib.Utils.DateUtil.Date2Str(admin.lastLoginTime));
                    Ebean.update(admin);

                    session("name", admin.name);
                    session(SESSION_USER_ID, admin.id.toString());
                    session(SESSION_USER_ROLE, role.toString());
                    play.Logger.info("admin login success: " + loginForm.get().username);

                    F.Promise<WSResponse> response
                            = WS.url("http://ip.taobao.com/service/getIpInfo.php?ip=" + admin.lastLoginIp).get();
                    return response.map(resp -> {
                        String respStr = resp.getBody();
                        play.Logger.info("response raw get admin login ip: " + respStr);

                        JsonNode respJson = resp.asJson();
                        if (respJson.get("code") != null && "0".equals(respJson.get("code").toString())) {
                            admin.lastLoginIpArea = respJson.get("data").get("country").asText()
                                    + respJson.get("data").get("region").asText()
                                    + respJson.get("data").get("city").asText()
                                    + respJson.get("data").get("isp").asText();
                        } else {
                            if ("0:0:0:0:0:0:0:1".equals(admin.lastLoginIp)) {
                                admin.lastLoginIpArea = "本机登录";
                            } else {
                                admin.lastLoginIpArea = "未知位置";
                            }
                        }
                        Ebean.update(admin);

                        // 登陆成功后的跳转(可以改成跳到其他界面)
                        return redirect("/admin/host");
                    }).recover(throwable -> redirect("/admin/host"));
                } else {
                    play.Logger.error("admin login failed on role: " + loginForm.get().username);
                    return F.Promise.promise(() -> forbidden("您没有权限登录后台"));
                }
            } else {
                play.Logger.error("admin login not found: " + loginForm.get().username);
                return F.Promise.promise(() -> redirect(routes.Application.backendLogin()));
            }
        }
    }

    public static class AdminLoginParser {

        public String username;
        public String password;
        public String captchaField;

        public String validate() {
            if (StrUtil.isNull(captchaField)) return "请输入验证码";
            if (!captchaField.equals(session().get("admin_login"))) return "验证码错误, 请重试";
            session().remove("admin_login");

            if (!AdminBiz.userExist(username)) return "不存在此用户";
            if (password != null && password.length() < 32) password = LyLib.Utils.MD5.getMD5(password);
            if (AdminBiz.authenticate(username, password) == null) return "用户名或密码错误";
            return null;
        }
    }

    public static Result backendLogout() {
        session().clear();
        flash("logininfo", "您已登出, 请重新登录");
        return redirect(routes.Application.backendLogin());
    }

    public static Result captcha(String tag) {
        DefaultKaptcha captcha = new DefaultKaptcha();
        Properties props = new Properties();
        Config config = new Config(props);
        captcha.setConfig(config);

        String text = captcha.createText();
        BufferedImage img = captcha.createImage(text);

        session(tag, text);

        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        try {
            ImageIO.write(img, "jpg", stream);
            stream.flush();
        } catch (IOException e) {
            play.Logger.error(e.getMessage());
        }
        return ok(stream.toByteArray()).as("image/jpg");
    }

    public static Result changeLanguage(String lang) {
//        Controller.clearLang();
//        String title = Messages.get(new Lang(Lang.forCode("fr")), "home.title")
//        flash("lan",language);

        Controller.changeLang(lang);
        Lang currentLang = Controller.lang();

        play.Logger.info("Accept-lang: " + request().acceptLanguages().toString());
        play.Logger.info("网站语言改为：" + currentLang.code()); // eg. zh-CN, en

        if ("zh-CN".equals(currentLang.code())) session("lang", "");
        if ("en".equals(currentLang.code())) session("lang", "En");

        return ok(currentLang.code());
    }

    //////////////////////////////// 业务 pages    ////////////////////////////////////


    // 随借随还
    // 1. 未授信, 进入授信页
    // 2. 已授信, 进入借款页
    public static Result sjshProductBuy() {
        if (!ConfigBiz.getBoolConfig("is.prod")) session("WX_OPEN_ID", "0");

        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                if (found.status == 6) { // 已授信
                    // 改成可以多次借款
                    return ok(borrow_info.render(found));
                } else {
                    if (found.status == 0) {
                        if (found.partner == null) {
                            // 跳到扫码提示
                            return needBarcodePage();
                        } else {
                            // 进入授信流程并绑定还款人
                            return ok(phone_bind.render(found));
                        }
                    }
                    return verifyingPage();

//                    if (found.status == 0) //未认证
//                        return ok(verify_partner.render(found));
//                    else if (found.status == 4) //运营商认证中, 执行第二步身份认证
//                        return ok(phone_bind.render(found));
//                        return ok(verify_bank.render(found));
//                    else if (found.status == 4) //银行卡已认证, 前往认证房源, 下一步后认证租约
//                        return ok(verify_house.render(found));
//                else if (found.status == 5) //房源已认证
//                    return ok(verify_contract.render(found));
//                else if (found.status == 8) //已授信
//                    return ok(product_sjsh.render(found));
                }
            }
        }
    }

    // 房东中心
    // 未授信时, 跳到授信页, 否则进入房东中心
    public static Result minePage() {
        if (!ConfigBiz.getBoolConfig("is.prod")) session("WX_OPEN_ID", "0");

        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                if (found.status == 6)
                    return ok(mine.render(found));
                else
                    return redirect("/p/product/fix/sjsh/buy");
            }
        }
    }

    public static Result verifyingPage() {
        return ok(verifying.render());
    }

    public static Result needBarcodePage() {
        return ok(need_barcode.render());
    }

    public static Result verifySubmitPage() {
        return ok(verify_submit.render());
    }

    public static Result partnerPage() {
        return ok(partner.render());
    }

    public static Result partnerLoginPage() {
        return ok(partner_login.render());
    }

    public static Result partnerMainPage() {
        play.Logger.info("loading " + request().uri() + "partner page with session: " + session("partner_login_name"));
        if (StrUtil.isNull(session("partner_login_name")) || StrUtil.isNull(session("partner_login_id"))) {
            return ok(partner_login.render());
        } else {
            play.Logger.info("partner_login_id: " + session("partner_login_id"));
            Partner found = Partner.find.where().eq("id", session("partner_login_id")).findUnique();
            if (found == null) {
                session().remove("partner_login_name");
                session().remove("partner_login_id");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(partner_main.render(found));
            }
        }
    }

    public static Result partnerBarcodePage(String barcode) {
        return ok(partner_barcode.render(barcode));
    }

    public static Result partnerAddHousePage() {
        play.Logger.info("loading " + request().uri() + "partner page with session: " + session("partner_login_name"));
        if (StrUtil.isNull(session("partner_login_name")) || StrUtil.isNull(session("partner_login_id"))) {
            return ok(partner_login.render());
        } else {
            play.Logger.info("partner_login_id: " + session("partner_login_id"));
            Partner found = Partner.find.where().eq("id", session("partner_login_id")).findUnique();
            if (found == null) {
                session().remove("partner_login_name");
                session().remove("partner_login_id");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(partner_house_add.render(found));
            }
        }
    }

    public static Result partnerHousePage() {
        play.Logger.info("loading " + request().uri() + "partner page with session: " + session("partner_login_name"));
        if (StrUtil.isNull(session("partner_login_name")) || StrUtil.isNull(session("partner_login_id"))) {
            return ok(partner_login.render());
        } else {
            play.Logger.info("partner_login_id: " + session("partner_login_id"));
            Partner found = Partner.find.where().eq("id", session("partner_login_id")).findUnique();
            if (found == null) {
                session().remove("partner_login_name");
                session().remove("partner_login_id");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(partner_house.render(found));
            }
        }
    }

    public static Result myWalletPage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                long totalRent = 0;
                for (House house : found.houses) {
                    if (house.status == 2) {
                        for (RentContract contract : house.rentContracts) {
                            if (contract.status == 1) {
                                totalRent += contract.rent * 24;
                            }
                        }
                    }
                }

                double rent4financial = 0;
                double rent4profit = 0;
                double borrowed = 0;
                for (ProductRecord productRecord : found.productRecords) {
                    if (productRecord.status == 1) {
                        borrowed += productRecord.amount;
                    }
                }
                borrowed = ((int) (borrowed * 100)) / 100;

                double borrowable = 0;
                String creditRateStr = StrUtil.isNotNull(found.lastLoginIpArea) ? found.lastLoginIpArea : "0.8";
                double creditRate = 0.8;
                try {
                    creditRate = Double.parseDouble(creditRateStr);
                } catch (NumberFormatException ex) {

                }
                borrowable = totalRent * creditRate;
                borrowable = ((int) (borrowable * 100)) / 100;

                double totalMoney = totalRent + rent4financial + rent4profit + borrowed + borrowable;
                double totalFundBack = Double.parseDouble(Long.toString(found.fundBackRecords.stream()
                        .filter(o -> o.status == 0).mapToLong(o -> o.amount).sum()));
                return ok(my_wallet.render(found, totalRent, rent4financial, rent4profit, borrowed, borrowable, totalMoney, totalFundBack));
            }
        }
    }

    public static Result verifyPartnerPage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(verify_partner.render(found));
            }
        }
    }

    public static Result sjshProductPage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(borrow_info.render(found));
            }
        }
//        return sjshProductBuy();
//        return ok(product_sjsh.render());
    }

    public static Result myPersonalInfoPage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(my_personal_info.render(found));
            }
        }
    }

    public static Result verifyBankPage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(verify_bank.render(found));
            }
        }
    }

    public static Result verifyHousePage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(verify_house.render(found));
            }
        }
    }

    public static Result sjshProductBorrow() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            Product sjsh = Product.find.where().eq("id", 1).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(product_sjsh_borrow.render(found, sjsh));
            }
        }
    }

    public static Result sjshProductSign(long pid, long money) {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(product_sjsh_sign.render(found, pid, money));
            }
        }
    }

    public static Result verifyContractPage(long houseId) {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            House found = House.find.where().eq("id", houseId).findUnique();
            if (found == null) {
                return notFound("无法找到房源数据");
            } else {
                // 页面加载业务
                return ok(verify_contract.render(found));
            }
        }
    }

    // 若有借款, 显示借款信息, 并可以进入过往借款 (借款只有一笔, 还了才有下一笔)
    // 若无借款, 直接显示过往借款
    public static Result myProductPage() {
        if (!ConfigBiz.getBoolConfig("is.prod")) session("WX_OPEN_ID", "0");

        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                List<ProductRecord> records = HostBiz.getCurrentAvailableProductRecords(found);
                if (records.size() == 1) {
                    return ok(my_current_product.render(records.get(0), HostBiz.hasProductRecordHistory(found)));
                } else {
                    if (records.size() == 0) {
                        return notFound("尚无借款记录");
                    } else {
                        return ok(my_product.render(found));
                    }
                }
            }
        }
    }

    public static Result myProductHistoryPage() {
        if (!ConfigBiz.getBoolConfig("is.prod")) session("WX_OPEN_ID", "0");

        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                List<ProductRecord> records = HostBiz.getCurrentAvailableProductRecords(found);
                if (records.size() == 0) {
                    return notFound("尚无借款记录");
                } else {
                    return ok(my_product.render(found));
                }
            }
        }
    }

    public static Result myBankCardPage() {
        if (!ConfigBiz.getBoolConfig("is.prod")) session("WX_OPEN_ID", "0");

        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(my_bankcard.render(found));
            }
        }
    }

    public static Result myBankCardSubmitPage() {
        if (!ConfigBiz.getBoolConfig("is.prod")) session("WX_OPEN_ID", "0");

        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(my_bankcard_submit.render(found));
            }
        }
    }

    public static Result myHouseContractPage() {
        if (!ConfigBiz.getBoolConfig("is.prod")) session("WX_OPEN_ID", "0");

        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(my_house_contract.render(found));
            }
        }
    }

    public static Result myHouseContractSubmitPage() {
        if (!ConfigBiz.getBoolConfig("is.prod")) session("WX_OPEN_ID", "0");

        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(my_house_contract_submit.render(found));
            }
        }
    }


    //////// 1.0 /////////////////////


    // 首页
    public static Result indexPage() {
//        List<Info> infos = Info.find.where().eq("classify", "幻灯").orderBy("indexNum").setMaxRows(3).findList();
//        List<Product> products = Product.find.where().eq("promote", true).eq("visible", true).eq("status", 0).orderBy("indexNum").findList();
//        return ok(index.render(infos, products));

        play.Logger.info("loading index page with session: " + session("WX_OPEN_ID"));

        if (session("WX_OPEN_ID") == null) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            List<Info> infos = Info.find.where().eq("classify", "幻灯").orderBy("indexNum").findList();
            List<Product> products = Product.find.where().eq("promote", true).eq("visible", true).eq("status", 0).orderBy("indexNum").findList();
            return ok(index.render(infos, products));
        }
    }

    // 所有产品
    public static Result allProductPage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                List<Product> products = Product.find.where().eq("visible", true).eq("status", 0).orderBy("indexNum")
                        .setMaxRows(50).findList();
                return ok(product_all.render(products));
            }
        }
    }

    // 产品详情
    public static Result productDetailsPage(long id) {
        Product product = Product.find.byId(id);
        if (product == null)
            return Results.notFound();
        else {
            return ok(product_details.render(product));
        }
    }

    // 购买产品(填额度)
    public static Result productBuyPage(long id) {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                Product currentProduct = Product.find.byId(id);
                if (currentProduct == null) return notFound("无法加载数据: " + request().uri());
                return ok(product_buy.render(found, currentProduct));
            }
        }
    }

    public static Result phoneBindPage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(phone_bind.render(found));
            }
        }
    }

    public static Result phoneChangePage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(phone_info.render(found));
            }
        }
    }

    public static Result myInfoPage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                if (found.status == 0) {
                    // 未认证
                    return ok(my_info_submit.render(found));
                } else {
                    return ok(my_info.render(found));
                }
            }
        }
    }

    public static Result myHousePage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(my_house.render(found));
            }
        }
    }

    public static Result myHousePageOnUser(long uid) {
        Host found = Host.find.byId(uid);
        return ok(my_house.render(found));
    }

    public static Result myHouseDetailsPage(long id) {
        House found = House.find.byId(id);
        if (found == null) return notFound("未找到房源数据");
        else return ok(my_house_details.render(found));
    }

    public static Result myHouseSubmitPage(Long uid) {
        return ok(my_house_submit.render(uid));
    }

    public static Result myGuestPage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(my_guest.render(found));
            }
        }
    }

    public static Result myCreditPage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                List<CreditRecord> creditRecords = CreditRecord.find.where()
                        .eq("host.id", found.id).eq("status", 0).orderBy("id desc").findList();
                return ok(my_credit.render(found, creditRecords));
            }
        }
    }

    public static Result myRentPage() {
        play.Logger.info("loading " + request().uri() + " page with session: " + session("WX_OPEN_ID"));
        if (StrUtil.isNull(session("WX_OPEN_ID"))) {
            return wxAutoLogin();
        } else {
            play.Logger.info("wx open id: " + session("WX_OPEN_ID"));
            Host found = Host.find.where().eq("wxId", session("WX_OPEN_ID")).findUnique();
            if (found == null) {
                session().remove("WX_OPEN_ID");
                return redirect(request().uri());
            } else {
                // 页面加载业务
                return ok(my_rent.render(found));
            }
        }
    }

    public static Result houseRoutersPage(long houseId) {
        return ok(house_routers.render(House.find.byId(houseId)));
    }

    public static Result routerDetailsPage(long id) {
        Router found = Router.find.byId(id);
        if (found == null) return notFound("无法找到路由器数据");

        return ok(router_online_devices.render(found));
    }

    public static Result wxAutoLogin() {
        String oauthUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + ConfigBiz.getStrConfig("weixin.appid")
                + "&redirect_uri=http%3A%2F%2F" + ConfigBiz.getStrConfig("domain.name") + "%2Fdowxuser%3FresellerCode="
                + "%26path=" + request().uri() + "&response_type=code&scope=snsapi_base#wechat_redirect"; //
        play.Logger.info("oauthUrl: " + oauthUrl);
        return redirect(oauthUrl);
    }

    public static Result clearSession() {
        session().clear();
        return ok("session cleared");
    }
}
