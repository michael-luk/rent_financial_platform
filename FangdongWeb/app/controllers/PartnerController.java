package controllers;

import LyLib.Interfaces.IConst;
import LyLib.Utils.Msg;
import LyLib.Utils.StrUtil;
import com.avaje.ebean.Ebean;
import controllers.biz.SaveBiz;
import models.Host;
import models.House;
import models.Partner;
import models.RentContract;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.partner_login;

import java.util.Date;
import java.util.List;

import static play.data.Form.form;

public class PartnerController extends Controller implements IConst {

    public static Result login() {
        Msg<Partner> msg = new Msg<>();

        Form<PartnerLoginParser> httpForm = form(PartnerLoginParser.class).bindFromRequest();

        if (!httpForm.hasErrors()) {
            PartnerLoginParser formObj = httpForm.get();

            List<Partner> foundList = Partner.find.where().eq("name", formObj.username).eq("password", formObj.psw)
                    .orderBy("id").findList();

            if (foundList.size() > 0) {
                msg.flag = true;
                session("partner_login_id", foundList.get(0).id.toString());
                session("partner_login_name", foundList.get(0).name);
            } else {
                msg.message = "登录失败, 请检查用户名和密码";
            }
            return ok(Json.toJson(msg));
        } else {
            if (httpForm.hasGlobalErrors())
                msg.message = httpForm.globalError().message();
            else {
                if (httpForm.hasErrors())
                    msg.message = "输入数据不正确, 请重试";
            }
            play.Logger.error("result: " + msg.message);
        }
        return ok(Json.toJson(msg));
    }

    public static class PartnerLoginParser {

        public String username;
        public String psw;

        public String validate() {
            if (StrUtil.isNull(username)) {
                return "用户名不能为空";
            }
            if (StrUtil.isNull(psw)) {
                return "密码不能为空";
            }
            return null;
        }
    }

    public static Result partnerSessionClearPage() {
        session().remove("partner_login_id");
        session().remove("partner_login_name");
        return ok(partner_login.render());
    }

    public static Result houseAdd() {
        Msg msg = new Msg<>();
        Form<HouseAddParser> httpForm = form(HouseAddParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            HouseAddParser houseAddParser = httpForm.get();

            List<Host> hosts = Host.find.where().eq("loginName", houseAddParser.hostName)
                    .eq("phone", houseAddParser.phone)
                    .orderBy("id").findList();//todo: 是否只允许已授信的?
            if (hosts.size() > 0) {

                Partner partner = Partner.find.byId(houseAddParser.partnerId);
                if (partner != null) {
                    House newHouse = new House();
                    newHouse.province = houseAddParser.province;
                    newHouse.city = houseAddParser.city;
                    newHouse.zone = houseAddParser.area;
                    newHouse.address = houseAddParser.address;
                    newHouse.name = houseAddParser.zone;
                    newHouse.size = String.valueOf(houseAddParser.size);
                    newHouse.age = houseAddParser.age;
                    newHouse.structure = houseAddParser.structure;
                    newHouse.comment = partner.name;
                    String[] images = houseAddParser.images.split(",");
                    newHouse.images = images[0] + "," + images[1];

                    newHouse.refHostId = hosts.get(0).id;
                    newHouse.host = hosts.get(0);
                    newHouse.refPartnerId = partner.id;
                    newHouse.partner = partner;
                    newHouse.rent = houseAddParser.rentMoney;
                    Ebean.save(newHouse);

                    RentContract newContract = new RentContract();
                    newContract.name = "《" + newHouse.name + " 租赁合同》";
                    newContract.rent = houseAddParser.rentMoney;
                    newContract.images = images[2] + "," + images[3];

                    newContract.refHouseId = newHouse.id;
                    newContract.house = newHouse;
                    Ebean.save(newContract);

                    // 增加额度
                    hosts.get(0).credit += newContract.rent * 24;
                    hosts.get(0).lastUpdateTime = new Date();
                    Ebean.update(hosts.get(0));

                    msg.flag = true;
                    msg.message = "";
                } else {
                    msg.message = "运营商有误, 请检查";
                }
            } else {
                msg.message = "无法找到该房东, 请检查";
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

    public static class HouseAddParser {
        public long partnerId;
        public String phone;
        public String hostName;
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

        public String validate() {
            if (partnerId == 0) {
                return "运营商id有误";
            }
            if (images.split(",").length != 4) {
                return "必须上传两张房产证照片和两张租赁合同照片";
            }
            if (StrUtil.isNull(phone)) {
                return "房东手机号不能为空";
            }
            if (StrUtil.isNull(hostName)) {
                return "房东姓名不能为空";
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
}
