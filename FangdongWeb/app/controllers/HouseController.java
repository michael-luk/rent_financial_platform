package controllers;

import LyLib.Interfaces.IConst;
import LyLib.Utils.Msg;
import com.avaje.ebean.Ebean;
import com.avaje.ebean.Transaction;
import controllers.gen.HouseController.HouseParser;
import models.Host;
import models.House;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;

import javax.persistence.PersistenceException;

import static play.data.Form.form;

public class HouseController extends Controller implements IConst {

    @Security.Authenticated(Secured.class)
    public static Result addMyHouse() {
        Msg<House> msg = new Msg<>();

        Form<HouseParser> httpForm = form(HouseParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            HouseParser formObj = httpForm.get();
            House newObj = new House();

            newObj.name = formObj.name;
            newObj.classify = formObj.classify;
            newObj.address = formObj.address;
            newObj.age = formObj.age;
            newObj.size = formObj.size;
            newObj.structure = formObj.structure;
            newObj.rent = formObj.rent;
            newObj.credit = formObj.credit;
            newObj.visible = formObj.visible;
            newObj.status = 0;
            newObj.images = formObj.images;
            newObj.description = formObj.description;
            newObj.comment = formObj.comment;

            Host parentHost = Host.find.byId(formObj.refHostId);
            if (parentHost == null) {
                msg.message = "用户信息有误";
                msg.errorCode = 1;
                return ok(Json.toJson(msg));
            }

            newObj.host = parentHost;
            newObj.refHostId = formObj.refHostId;
            Transaction txn = Ebean.beginTransaction();
            try {
                Ebean.save(newObj);


                txn.commit();
                msg.flag = true;
                msg.data = newObj;
                play.Logger.info("result: " + CREATE_SUCCESS);
            } catch (PersistenceException ex) {
                msg.message = CREATE_ISSUE + ", ex: " + ex.getMessage();
                play.Logger.error(msg.message);
                return ok(Json.toJson(msg));
            } finally {
                txn.end();
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
}
