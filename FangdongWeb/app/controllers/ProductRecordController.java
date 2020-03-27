package controllers;

import LyLib.Interfaces.IConst;
import LyLib.Utils.DateUtil;
import LyLib.Utils.Msg;
import com.avaje.ebean.Ebean;
import com.avaje.ebean.Transaction;
import models.*;
import play.mvc.Controller;
import play.mvc.Result;

import javax.persistence.PersistenceException;
import java.util.Date;

public class ProductRecordController extends Controller implements IConst {

    public static Result productBuy(long hid, long pid, long amount) {
        Msg<ProductRecord> msg = new Msg<>();

        // 检查数据
        Host host = Host.find.byId(hid);
        if (host == null) {
            msg.message = "无法获取房东数据";
            return notFound(msg.message);
        }
        Product product = Product.find.byId(pid);
        if (product == null) {
            msg.message = "无法获取金融产品数据";
            return notFound(msg.message);
        }

        // 检查数值
        if (host.credit < amount) {
            msg.message = "抱歉, 您额度不足";
            return notFound(msg.message);
        }
        if (amount < product.minInvestAmount) {
            msg.message = "抱歉, 您输入的额度低于本产品的最低贷款额度";
            return notFound(msg.message);
        }
        if (amount > product.maxInvestAmount) {
            msg.message = "抱歉, 您输入的额度超过了本产品的最高贷款额度";
            return notFound(msg.message);
        }
        return ContractRecordController.showNewContract(host, product, amount);


//        Msg<ProductRecord> msg = new Msg<>();
//
//        Form<ProductRecordParser> httpForm = form(ProductRecordParser.class).bindFromRequest();
//        if (!httpForm.hasErrors()) {
//            ProductRecordParser formObj = httpForm.get();
//            ProductRecord newObj = new ProductRecord();
//
//            // 检查数据
//            Host host = Host.find.byId(formObj.refHostId);
//            if (host == null) {
//                msg.message = "无法获取房东数据";
//                return ok(Json.toJson(msg));
//            }
//            Product product = Product.find.byId(formObj.refProductId);
//            if (product == null) {
//                msg.message = "无法获取金融产品数据";
//                return ok(Json.toJson(msg));
//            }
//
//            // 检查数值
//            if (host.credit < formObj.amount) {
//                msg.message = "抱歉, 您额度不足";
//                return ok(Json.toJson(msg));
//            }
//            if (formObj.amount < product.minInvestAmount) {
//                msg.message = "抱歉, 您输入的额度低于本产品的最低贷款额度";
//                return ok(Json.toJson(msg));
//            }
//            if (formObj.amount > product.maxInvestAmount) {
//                msg.message = "抱歉, 您输入的额度超过了本产品的最高贷款额度";
//                return ok(Json.toJson(msg));
//            }
//
//            return redirect(ContractRecordController.showNewContract(host, product, formObj.amount));
//
////            // 生成编号, 计算日期
////
////            // 建立关系
////
////            // 保存
////
////            newObj.name = formObj.name;
////            newObj.inDate = formObj.inDate;
////            newObj.outDate = formObj.outDate;
////            newObj.amount = formObj.amount;
////            newObj.status = formObj.status;
////            newObj.comment = formObj.comment;
////
////            Host parentHost = Host.find.byId(formObj.refHostId);
////            newObj.host = parentHost;
////            newObj.refHostId = formObj.refHostId;
////            Product parentProduct = Product.find.byId(formObj.refProductId);
////            newObj.product = parentProduct;
////            newObj.refProductId = formObj.refProductId;
////            Transaction txn = Ebean.beginTransaction();
////            try {
////                Ebean.save(newObj);
////
////
////                txn.commit();
////                msg.flag = true;
////                msg.data = newObj;
////                play.Logger.info("result: " + CREATE_SUCCESS);
////            } catch (PersistenceException ex) {
////                msg.message = CREATE_ISSUE + ", ex: " + ex.getMessage();
////                play.Logger.error(msg.message);
////                return ok(Json.toJson(msg));
////            } finally {
////                txn.end();
////            }
////            return ok(Json.toJson(msg));
//        } else {
//            if (httpForm.hasGlobalErrors())
//                msg.message = httpForm.globalError().message();
//            else {
//                if (httpForm.hasErrors())
//                    msg.message = "输入数据不正确, 请重试";
//            }
//            play.Logger.error("result: " + msg.message);
//            return ok(Json.toJson(msg));
//        }
    }

    public static char getRamdonLetter() {
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return chars.charAt((int) (Math.random() * 52));
    }

    public static Result productBuySuccessWithContract(long hid, long pid, long amount) {
        // 创建合同记录
        // 创建购买记录
        // 创建额度历史记录
        // 扣额度
        // 跳转到房东中心

        Msg msg = new Msg();
        Host host = Host.find.byId(hid);
        Product product = Product.find.byId(pid);

        ContractRecord newContract = new ContractRecord();
        newContract.refHostId = host.id;
        newContract.host = host;
        newContract.refProductId = product.id;
        newContract.product = product;
        newContract.contractTime = newContract.createdAt;
        newContract.name = DateUtil.Date2Str(new Date(), "yyyyMMddHHmmss") + getRamdonLetter()
                + getRamdonLetter() + getRamdonLetter() + getRamdonLetter();

        ProductRecord newRecord = new ProductRecord();
        newRecord.refHostId = host.id;
        newRecord.host = host;
        newRecord.refProductId = product.id;
        newRecord.product = product;
        newRecord.inDate = newRecord.createdAt;
        newRecord.outDate = DateUtil.DateAddTime(newRecord.inDate, 0, product.length, 0, 0, 0, 0, 0);
        newRecord.amount = amount;
        newRecord.name = DateUtil.Date2Str(new Date(), "yyyyMMddHHmmss") + getRamdonLetter()
                + getRamdonLetter() + getRamdonLetter() + getRamdonLetter();

        CreditRecord newCreditRecord = new CreditRecord();
        newCreditRecord.refHostId = host.id;
        newCreditRecord.host = host;
        newCreditRecord.creditRaise = -amount;
        newCreditRecord.name = "购买金融产品";

        host.credit -= amount;

        Transaction txn = Ebean.beginTransaction();
        try {
            Ebean.save(newContract);
            Ebean.save(newRecord);
            Ebean.save(newCreditRecord);
            Ebean.update(host);

            txn.commit();
            play.Logger.info("产品购买并签约成功: " + CREATE_SUCCESS);
            return redirect("/p/mine");
        } catch (PersistenceException ex) {
            msg.message = "产品购买并签约失败, ex: " + ex.getMessage();
            play.Logger.error(msg.message);
            return notFound(msg.message);
        } finally {
            txn.end();
        }
    }
}
