package controllers;

import LyLib.Interfaces.IConst;
import LyLib.Utils.DateUtil;
import LyLib.Utils.Msg;
import LyLib.Utils.StrUtil;
import com.avaje.ebean.Ebean;
import controllers.biz.SmsBiz;
import models.*;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.Date;
import java.util.List;

import static play.data.Form.form;

public class HostController extends Controller implements IConst {

    // 绑定手机号
    public static Result phoneBind() {
        Msg msg = new Msg<>();
        Form<PhoneBindParser> httpForm = form(PhoneBindParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            PhoneBindParser phoneBindParser = httpForm.get();

            SmsInfo dbCode = SmsBiz.getLatestCode(phoneBindParser.phone, phoneBindParser.sms);
            msg.message = "短信验证码错误";
            if (dbCode != null) {
                if (phoneBindParser.sms.equals(dbCode.checkCode)) {
                    // 验证通过
                    play.Logger.info("sms pass, session openId is: " + session("WX_OPEN_ID"));
                    if (StrUtil.isNull(session("WX_OPEN_ID"))) {
                        msg.message = "短信验证码正确但用户数据出错";
                    } else {
                        List<Host> hosts = Host.find.where().eq("wxId", session("WX_OPEN_ID")).orderBy("id").findList();
                        if (hosts.size() > 0) {
                            hosts.get(0).phone = phoneBindParser.phone;
                            hosts.get(0).loginName = phoneBindParser.name;
//                            hosts.get(0).images = phoneBindParser.images;
//                            hosts.get(0).cardNumber = phoneBindParser.idcard;
                            hosts.get(0).status = 6;
                            hosts.get(0).save();

                            msg.flag = true;
                            msg.message = "";
                        } else {
                            msg.message = "短信验证码正确但用户数据出错";
                        }
                    }
                }
            }
        } else {
            if (httpForm.hasGlobalErrors())
                msg.message = httpForm.globalError().message();
            else {
                if (httpForm.hasErrors())
                    msg.message = "输入数据不正确, 请重试";
            }
        }
        return ok(Json.toJson(msg));
    }

    public static class PhoneBindParser {
        public String phone;
        public String sms;
        public String name;
//        public String images;
//        public String idcard;

        public String validate() {
            if (StrUtil.isNull(phone)) {
                return "手机号不能为空";
            }
            if (StrUtil.isNull(sms)) {
                return "短信验证码不能为空";
            }
            if (StrUtil.isNull(name)) {
                return "姓名不能为空";
            }
//            if (StrUtil.isNull(idcard)) {
//                return "姓名不能为空";
//            }
//            if (StrUtil.isNull(images)) {
//                return "身份证图片不能为空";
//            }
            return null;
        }
    }

    public static Result verifyBank() {
        Msg msg = new Msg<>();
        Form<VerifyBankParser> httpForm = form(VerifyBankParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            VerifyBankParser verifyBankParser = httpForm.get();

            List<Host> hosts = Host.find.where().eq("id", verifyBankParser.uid).orderBy("id").findList();
            if (hosts.size() > 0) {
                // todo: 银行卡校验(有效性? 唯一性?)
                BankCard bankCard = new BankCard();
                bankCard.bank = verifyBankParser.bankName;
                bankCard.name = verifyBankParser.bankCard;
                bankCard.refHostId = verifyBankParser.uid;
                bankCard.host = hosts.get(0);

                Ebean.save(bankCard);

                msg.flag = true;
                msg.message = "";
            } else {
                msg.message = "用户数据出错";
            }
        } else {
            if (httpForm.hasGlobalErrors())
                msg.message = httpForm.globalError().message();
            else {
                if (httpForm.hasErrors())
                    msg.message = "输入数据不正确, 请重试";
            }
        }
        return ok(Json.toJson(msg));
    }

    public static class VerifyBankParser {
        public long uid;
        public String bankName;
        public String bankCard;

        public String validate() {
            if (uid == 0) {
                return "用户id有误";
            }
            if (StrUtil.isNull(bankName)) {
                return "银行名称不能为空";
            }
            if (StrUtil.isNull(bankCard)) {
                return "银行卡不能为空";
            }
            return null;
        }
    }

    public static Result verifyHouse() {
        Msg msg = new Msg<>();
        Form<VerifyHouseParser> httpForm = form(VerifyHouseParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            VerifyHouseParser verifyHouseParser = httpForm.get();

            List<Host> hosts = Host.find.where().eq("id", verifyHouseParser.uid).orderBy("id").findList();
            if (hosts.size() > 0) {
                House newHouse = new House();
                newHouse.province = verifyHouseParser.province;
                newHouse.city = verifyHouseParser.city;
                newHouse.zone = verifyHouseParser.area;
                newHouse.address = verifyHouseParser.address;
                newHouse.name = verifyHouseParser.zone;
                newHouse.size = String.valueOf(verifyHouseParser.size);
                newHouse.age = verifyHouseParser.age;
                newHouse.structure = verifyHouseParser.structure;
                newHouse.comment = verifyHouseParser.comment;
                newHouse.images = verifyHouseParser.images;

                newHouse.refHostId = verifyHouseParser.uid;
                newHouse.host = hosts.get(0);
                Ebean.save(newHouse);

                msg.flag = true;
                msg.data = newHouse;
                msg.message = "";
            } else {
                msg.message = "用户数据出错";
            }
        } else {
            if (httpForm.hasGlobalErrors())
                msg.message = httpForm.globalError().message();
            else {
                if (httpForm.hasErrors())
                    msg.message = "输入数据不正确, 请重试";
            }
        }
        return ok(Json.toJson(msg));
    }

    public static class VerifyHouseParser {
        public long uid;
        public String province;
        public String city;
        public String area;
        public String address;
        public String zone;
        public int size;
        public int age;
        public String structure;
        public String comment;
        public String images;

        public String validate() {
            if (uid == 0) {
                return "用户id有误";
            }
            // todo: 补充
//            if (StrUtil.isNull(bankName)) {
//                return "银行名称不能为空";
//            }
//            if (StrUtil.isNull(bankCard)) {
//                return "银行卡不能为空";
//            }
            return null;
        }
    }

    public static Result verifyContract() {
        Msg msg = new Msg<>();
        Form<VerifyContractParser> httpForm = form(VerifyContractParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            VerifyContractParser verifyContractParser = httpForm.get();

            List<House> houses = House.find.where().eq("id", verifyContractParser.uid).orderBy("id").findList();
            if (houses.size() > 0) {
                RentContract newContract = new RentContract();
                newContract.name = "《" + houses.get(0).name + " 租赁合同》";
                newContract.rent = verifyContractParser.rentMoney;
                newContract.images = verifyContractParser.images;

                newContract.refHouseId = verifyContractParser.uid;
                newContract.house = houses.get(0);
                Ebean.save(newContract);

                msg.flag = true;
                msg.message = "";
            } else {
                msg.message = "用户数据出错";
            }
        } else {
            if (httpForm.hasGlobalErrors())
                msg.message = httpForm.globalError().message();
            else {
                if (httpForm.hasErrors())
                    msg.message = "输入数据不正确, 请重试";
            }
        }
        return ok(Json.toJson(msg));
    }

    public static class VerifyContractParser {
        public long uid;
        public int rentMoney;
        public String images;

        public String validate() {
            if (uid == 0) {
                return "房源数据有误";
            }
            if (StrUtil.isNull(images)) {
                return "照片不能为空";
            }
            if (rentMoney == 0) {
                return "租金不正确";
            }
            return null;
        }
    }

    public static Result verifyPartner() {
        Msg msg = new Msg<>();
        Form<VerifyPartnerParser> httpForm = form(VerifyPartnerParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            VerifyPartnerParser verifyPartnerParser = httpForm.get();

            List<Host> hosts = Host.find.where().eq("id", verifyPartnerParser.uid).orderBy("id").findList();
            if (hosts.size() > 0) {
//                Partner partner = Partner.find.byId(verifyPartnerParser.partnerId);
//                if (partner == null) {
//                    msg.message = "运营商数据出错";
//                } else {
                    hosts.get(0).status = 4;
                    hosts.get(0).save();

                    msg.flag = true;
                    msg.message = "";
//                }
            } else {
                msg.message = "房东数据出错";
            }
        } else {
            if (httpForm.hasGlobalErrors())
                msg.message = httpForm.globalError().message();
            else {
                if (httpForm.hasErrors())
                    msg.message = "输入数据不正确, 请重试";
            }
        }
        return ok(Json.toJson(msg));
    }

    public static class VerifyPartnerParser {
        public long uid;
        public String area;
        public long partnerId;

        public String validate() {
            if (uid == 0) {
                return "房东数据有误";
            }
//            if (StrUtil.isNull(area)) {
//                return "地区不能为空";
//            }
//            if (partnerId == 0) {
//                return "运营商数据有误";
//            }
            return null;
        }
    }

    public static Result myHouseContractSubmit() {
        Msg msg = new Msg<>();
        Form<MyHouseContractSubmitParser> httpForm = form(MyHouseContractSubmitParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            MyHouseContractSubmitParser myHouseContractSubmitParser = httpForm.get();

            List<Host> hosts = Host.find.where().eq("id", myHouseContractSubmitParser.uid).orderBy("id").findList();
            if (hosts.size() > 0) {
                House newHouse = new House();
                newHouse.province = myHouseContractSubmitParser.province;
                newHouse.city = myHouseContractSubmitParser.city;
                newHouse.zone = myHouseContractSubmitParser.area;
                newHouse.address = myHouseContractSubmitParser.address;
                newHouse.name = myHouseContractSubmitParser.zone;
                newHouse.size = String.valueOf(myHouseContractSubmitParser.size);
                newHouse.age = myHouseContractSubmitParser.age;
                newHouse.structure = myHouseContractSubmitParser.structure;
                newHouse.comment = myHouseContractSubmitParser.comment;
                String[] images = myHouseContractSubmitParser.images.split(",");
                newHouse.images = images[0] + "," + images[1];

                newHouse.refHostId = myHouseContractSubmitParser.uid;
                newHouse.host = hosts.get(0);
                Ebean.save(newHouse);

                RentContract newContract = new RentContract();
                newContract.name = "《" + newHouse.name + " 租赁合同》";
                newContract.rent = myHouseContractSubmitParser.rentMoney;
                newContract.images = images[2] + "," + images[3];

                newContract.refHouseId = newHouse.id;
                newContract.house = newHouse;
                Ebean.save(newContract);

                msg.flag = true;
                msg.message = "";
            } else {
                msg.message = "用户数据出错";
            }
        } else {
            if (httpForm.hasGlobalErrors())
                msg.message = httpForm.globalError().message();
            else {
                if (httpForm.hasErrors())
                    msg.message = "输入数据不正确, 请重试";
            }
        }
        return ok(Json.toJson(msg));
    }

    public static class MyHouseContractSubmitParser {
        public long uid;
        public String province;
        public String city;
        public String area;
        public String address;
        public String zone;
        public int size;
        public int age;
        public String structure;
        public int rentMoney;
        public String images;
        public String comment;

        public String validate() {
            if (uid == 0) {
                return "用户id有误";
            }
            if (images.split(",").length != 4) {
                return "必须上传两张产权证明照片和两张租赁合同照片";
            }
            // todo: 补充
//            if (StrUtil.isNull(bankName)) {
//                return "银行名称不能为空";
//            }
//            if (StrUtil.isNull(bankCard)) {
//                return "银行卡不能为空";
//            }
            return null;
        }
    }

    public static Result productSign() {
        Msg msg = new Msg<>();
        Form<ProductSignParser> httpForm = form(ProductSignParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            ProductSignParser productSignParser = httpForm.get();

            List<Host> hosts = Host.find.where().eq("id", productSignParser.uid).orderBy("id").findList();
            if (hosts.size() > 0) {
                List<Product> products = Product.find.where().eq("id", productSignParser.pid).orderBy("id").findList();
                if (products.size() > 0) {
                    ProductRecord record = new ProductRecord();
                    record.name = DateUtil.Date2Str(new Date(), "yyyyMMddHHmmss")
                            + getRamdonLetter() + getRamdonLetter();
                    record.name = record.name.toUpperCase();
                    record.inDate = new Date();
                    record.amount = productSignParser.money;

                    record.refHostId = productSignParser.uid;
                    record.host = hosts.get(0);
                    record.refProductId = productSignParser.pid;
                    record.product = products.get(0);

                    Ebean.save(record);

                    hosts.get(0).credit -= record.amount;
                    hosts.get(0).save();

                    msg.flag = true;
                    msg.message = "";
                } else {
                    msg.message = "产品数据出错";
                }
            } else {
                msg.message = "用户数据出错";
            }
        } else {
            if (httpForm.hasGlobalErrors())
                msg.message = httpForm.globalError().message();
            else {
                if (httpForm.hasErrors())
                    msg.message = "输入数据不正确, 请重试";
            }
        }
        return ok(Json.toJson(msg));
    }

    public static class ProductSignParser {
        public long uid;
        public long pid;
        public long money;

        public String validate() {
            if (uid == 0) {
                return "用户id有误";
            }
            if (pid == 0) {
                return "产品id有误";
            }
            if (money == 0) {
                return "借款有误";
            }
            return null;
        }
    }

    public static char getRamdonLetter() {
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return chars.charAt((int) (Math.random() * 52));
    }

    // 房东资料认证
    public static Result myInfoSubmit() {
        // 根据post的id获取房东, 更新信息, 状态设为"认证中"(1)
        Msg msg = new Msg<>();
        Form<MyHostInfoParser> httpForm = form(MyHostInfoParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            MyHostInfoParser myHostInfoParser = httpForm.get();

            Host found = Host.find.byId(myHostInfoParser.uid);
            if (found == null) {
                msg.message = "无法找到用户信息";
                msg.errorCode = 2;
            } else {
                if (found.status == 3) {
                    // 已认证的
                    msg.message = "用户已认证, 请勿重复认证";
                    msg.errorCode = 3;
                } else {
                    found.name = myHostInfoParser.name;
                    found.address = myHostInfoParser.address;
                    found.sexEnum = myHostInfoParser.sex;
                    found.birth = DateUtil.Str2Date(myHostInfoParser.birthDay, "yyyy-MM-dd");
                    found.images = myHostInfoParser.images;
                    found.status = 1;

                    Ebean.update(found);
                    msg.flag = true;
                }
            }
        } else {
            if (httpForm.hasGlobalErrors()) {
                msg.message = httpForm.globalError().message();
                msg.errorCode = 1;
            } else {
                if (httpForm.hasErrors()) {
                    msg.message = "输入数据不正确, 请重试";
                    msg.errorCode = 1;
                }
            }
        }
        return ok(Json.toJson(msg));
    }

    public static class MyHostInfoParser {
        public long uid;
        public int sex;
        public String name;
        public String birthDay;
        public String address;
        public String images;

        public String validate() {
            if (StrUtil.isNull(name)) {
                return "姓名不能为空";
            }
            if (StrUtil.isNull(birthDay)) {
                return "生日不能为空";
            }
            if (StrUtil.isNull(address)) {
                return "地址不能为空";
            }
            if (StrUtil.isNull(images)) {
                return "图片不能为空";
            }
            return null;
        }
    }
}
