package controllers.biz;

import LyLib.Interfaces.IConst;
import models.Host;
import models.ProductRecord;
import models.RentContract;
import play.mvc.Controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class HostBiz extends Controller implements IConst {

    // 获取某房东的当前总欠款(本息)
    public static BigDecimal getProductRecordAmountWithInterest(Host obj) {
        double amount = 0;
        for (ProductRecord record : obj.productRecords) {
            amount += ProductRecordBiz.getActualAmount(record).doubleValue();
        }
        return BigDecimal.valueOf(amount).setScale(2, BigDecimal.ROUND_HALF_UP);
    }

    // 获取某房东的当前生效的借款
    public static List<ProductRecord> getCurrentAvailableProductRecords(Host obj) {
        List<ProductRecord> list = new ArrayList<>();
        for (ProductRecord record : obj.productRecords) {
            if (record.status == 1) {
                list.add(record);
            }
        }
        return list;
    }

    // 查看某房东是否有历史借款
    public static boolean hasProductRecordHistory(Host obj) {
        for (ProductRecord record : obj.productRecords) {
            if (record.status > 1 && record.status != 4) {
                return true;
            }
        }
        return false;
    }

    // 房源租约审核通过即自动增加额度
    public static void addCreditWhenHouseRegistered(Host host, RentContract contract) {
        host.credit += contract.rent * 24;
        host.save();
    }
}
