package controllers.biz;

import LyLib.Interfaces.IConst;
import LyLib.Utils.DateUtil;
import models.ProductRecord;
import play.mvc.Controller;

import java.math.BigDecimal;
import java.util.Date;

public class ProductRecordBiz extends Controller implements IConst {

    // 计算本金+利息
    // 复利
    public static BigDecimal getActualAmount(ProductRecord obj) {
        if (obj.status == 1) {
            if (obj.inDate == null) return BigDecimal.ZERO;
            int days = DateUtil.findDates(obj.inDate, new Date()).size() - 1;
            BigDecimal result = BigDecimal.valueOf(obj.amount * Math.pow((1 + obj.product.interest), days));
            return result;
        }
        return BigDecimal.ZERO;
    }

    // 复利
    public static BigDecimal getInterest(ProductRecord obj) {
        if (obj.inDate == null) return BigDecimal.ZERO;
        Date endDate = new Date();
        if (obj.fundBackDate != null) endDate = obj.fundBackDate;

        int days = DateUtil.findDates(obj.inDate, endDate).size() - 1;
        BigDecimal result = BigDecimal.valueOf(obj.amount * Math.pow(1 + obj.product.interest, days) - obj.amount);
        return result;
    }
}
