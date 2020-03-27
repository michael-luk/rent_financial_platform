package controllers.biz;

import com.avaje.ebean.Ebean;
import controllers.WeiXinController;
import models.*;

import java.util.Date;

public class SaveBiz {

    public static void beforeSave(Admin obj) {

    }

    public static void beforeUpdate(Admin obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(AdminJournal obj) {

    }

    public static void beforeUpdate(AdminJournal obj) {
    }

    public static void beforeSave(BankCard obj) {

    }

    public static void beforeUpdate(BankCard obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(Config obj) {

    }

    public static void beforeUpdate(Config obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(ContractRecord obj) {

    }

    public static void beforeUpdate(ContractRecord obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(CreditRecord obj) {

    }

    public static void beforeUpdate(CreditRecord obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(FundBackRecord obj) {
        obj.host.credit += obj.amount;
        Ebean.update(obj.host);
    }

    public static void beforeUpdate(FundBackRecord obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(Guest obj) {

    }

    public static void beforeUpdate(Guest obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(Host obj) {

    }

    public static void beforeUpdate(Host obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(House obj) {

    }

    public static void beforeUpdate(House obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(Info obj) {

    }

    public static void beforeUpdate(Info obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(Partner obj) {
        obj.comment = WeiXinController.generateResellerCode();
        obj.password = "123456";
        WeiXinController.generateResellerCodeBarcode(obj.comment);
        obj.images = obj.comment;
    }

    public static void beforeUpdate(Partner obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(Product obj) {

    }

    public static void beforeUpdate(Product obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(ProductRecord obj) {

    }

    public static void beforeUpdate(ProductRecord obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(RentContract obj) {

    }

    public static void beforeUpdate(RentContract obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(RentRecord obj) {

    }

    public static void beforeUpdate(RentRecord obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(Router obj) {

    }

    public static void beforeUpdate(Router obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(SmsInfo obj) {

    }

    public static void beforeUpdate(SmsInfo obj) {
        obj.lastUpdateTime = new Date();
    }

    public static void beforeSave(User obj) {

    }

    public static void beforeUpdate(User obj) {
        obj.lastUpdateTime = new Date();
    }
}