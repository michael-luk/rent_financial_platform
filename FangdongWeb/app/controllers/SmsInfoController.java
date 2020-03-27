package controllers;

import LyLib.Interfaces.IConst;
import views.html.*;
import views.html.gen.*;
import LyLib.Utils.DateUtil;
import LyLib.Utils.PageInfo;
import LyLib.Utils.StrUtil;
import LyLib.Utils.Msg;
import com.avaje.ebean.Ebean;
import com.avaje.ebean.Page;
import com.avaje.ebean.Query;
import com.avaje.ebean.Transaction;

import java.util.*;

import controllers.biz.ConfigBiz;
import controllers.biz.SmsBiz;
import models.SmsInfo;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import views.html.*;

import java.io.UnsupportedEncodingException;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.util.Region;
import java.io.File;
import java.io.FileOutputStream;
import play.Play;

import javax.persistence.PersistenceException;
import com.todaynic.client.mobile.SMS;

import static play.data.Form.form;

public class SmsInfoController extends Controller implements IConst {
    public static Result getVetfy() {
        Msg msg = new Msg<>();
        Form<SmsInfo> httpForm = form(SmsInfo.class).bindFromRequest();

        if (!httpForm.hasErrors()) {
            SmsInfo checkCodeF = httpForm.get();
            Hashtable configTable = new Hashtable();
            //测试环境
//			configTable.put("VCPSERVER","testxml.todaynic.com");
            //真实环境
            configTable.put("VCPSERVER", ConfigBiz.getStrConfig("sms.server"));
            configTable.put("VCPSVPORT", ConfigBiz.getStrConfig("sms.port"));
            configTable.put("VCPUSERID", ConfigBiz.getStrConfig("sms.uid"));
            configTable.put("VCPPASSWD", ConfigBiz.getStrConfig("sms.psw"));

            String PhoneNumber = checkCodeF.phone;
            String randVery = getRandVery();
            SmsInfo checkCode = new SmsInfo();
            checkCode.phone = checkCodeF.phone;
            checkCode.checkCode = randVery;

            //写入发送的验证码到数据库中
            String MsgAbout = "租金所短信验证码： " + randVery + "，请不要透漏给别人";
            String SendTime = "0";     //即时发送	//reqguest.getParameteer("dtTime");
            String MsgContent = MsgAbout;
            String type = "0";    //通道选择: 0：默认通道； 2：通道2； 3：即时通道
            SMS smssender = new SMS(configTable);
            try {
                smssender.sendSMS(PhoneNumber, MsgContent, SendTime, type);
            } catch (Exception e) {
                msg.message = "获取验证码失败";
                play.Logger.error(msg.message + e.getMessage());
                return ok(Json.toJson(msg));
            }

            String sendXml = smssender.getSendXml();
            Hashtable recTable = smssender.getRespData();
            String receiveXml = smssender.getRecieveXml();
            String code = smssender.getCode();
            String recmsg = smssender.getMsg();

            checkCode.sendXml = sendXml;
            checkCode.returnTable = recTable.toString();
            checkCode.receiveXml = receiveXml;
            checkCode.code = code;
            if ("2000".equals(code)) {
                msg.flag = true;
                msg.message = "发送成功";
                play.Logger.info(msg.message + ", code: " + code);
            } else {
                msg.message = "发送失败";
                play.Logger.error(msg.message + ", code: " + code);
            }
            checkCode.returnMsg = recmsg;
            Ebean.save(checkCode);
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

    public static Result verifyCode() {
        Msg msg = new Msg<>();
        Form<SmsInfo> httpForm = form(SmsInfo.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            SmsInfo checkCode = httpForm.get();

            SmsInfo dbCode = SmsBiz.getLatestCode(checkCode.phone, checkCode.checkCode);
            if (dbCode != null) {
                msg.flag = true;
            } else {
                msg.flag = false;
                msg.message = "验证码错误";
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

    public static String getRandVery() {
        String res = "";
        res = res + Integer.toString(new Random().nextInt(10));
        res = res + Integer.toString(new Random().nextInt(10));
        res = res + Integer.toString(new Random().nextInt(10));
        res = res + Integer.toString(new Random().nextInt(10));
        return res;
    }
    
    public static Result smsInfoPage(Integer status, Integer notStatus,
                                     String fieldOn, String fieldValue, boolean isAnd,
                                     String searchOn, String kw,
                                     String startTime, String endTime,
                                     String order, String sort,
                                     Integer page, Integer size) {
        Msg<List<SmsInfo>> msg = BaseController.doGetAll("SmsInfo",
                status, notStatus,
                fieldOn, fieldValue, isAnd,
                searchOn, kw,
                startTime, endTime,
                order, sort,
                page, size);
        
        if (msg.flag) {
            return ok(sms_info.render(msg.data));
        } else {
            msg.data = new ArrayList<>();
            return ok(msg.message);
        }
    }
    
    @Security.Authenticated(SecuredAdmin.class)
    public static Result smsInfoBackendPage() {
        return ok(sms_info_backend.render());
    }
    

    @Security.Authenticated(SecuredSuperAdmin.class)
    public static Result add() {
        Msg<SmsInfo> msg = new Msg<>();

        Form<SmsInfoParser> httpForm = form(SmsInfoParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            SmsInfoParser formObj = httpForm.get();            
            SmsInfo newObj = new SmsInfo();

            if (SmsInfo.find.where().eq("name", formObj.name).findRowCount() > 0){
                msg.message = "存在同名数据";
                play.Logger.error("新建" + TableInfoReader.getTableComment(SmsInfo.class) + "时存在同名数据");
                return ok(Json.toJson(msg));
            }

            newObj.name = formObj.name;
            newObj.phone = formObj.phone;
            newObj.checkCode = formObj.checkCode;
            newObj.sendXml = formObj.sendXml;
            newObj.returnTable = formObj.returnTable;
            newObj.receiveXml = formObj.receiveXml;
            newObj.code = formObj.code;
            newObj.returnMsg = formObj.returnMsg;
            newObj.comment = formObj.comment;

            Transaction txn = Ebean.beginTransaction();
            try{
                Ebean.save(newObj);
                
                
                txn.commit();
                msg.flag = true;
                msg.data = newObj;
                play.Logger.info("result: " + CREATE_SUCCESS);
            } catch (PersistenceException ex){
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

    @Security.Authenticated(SecuredSuperAdmin.class)
    public static Result update(long id) {
        Msg<SmsInfo> msg = new Msg<>();

        SmsInfo found = SmsInfo.find.byId(id);
        if (found == null) {
            msg.message = NO_FOUND;
            play.Logger.info("result: " + msg.message);
            return ok(Json.toJson(msg));
        }

        Form<SmsInfoParser> httpForm = form(SmsInfoParser.class).bindFromRequest();

        if (!httpForm.hasErrors()) {
            SmsInfoParser formObj = httpForm.get();            
            Transaction txn = Ebean.beginTransaction();
            try{
                found = SmsInfo.find.byId(id);
                            
                found.name = formObj.name;
                found.phone = formObj.phone;
                found.checkCode = formObj.checkCode;
                found.sendXml = formObj.sendXml;
                found.returnTable = formObj.returnTable;
                found.receiveXml = formObj.receiveXml;
                found.code = formObj.code;
                found.returnMsg = formObj.returnMsg;
                found.comment = formObj.comment;

                Ebean.update(found);
                txn.commit();
                msg.flag = true;
                msg.data = found;
                play.Logger.info("result: " + UPDATE_SUCCESS);
            } catch (Exception ex){
                msg.message = UPDATE_ISSUE + ", ex: " + ex.getMessage();
                play.Logger.error(msg.message);
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
    
    public static class SmsInfoParser {

        public String name;
        public String phone;
        public String checkCode;
        public String sendXml;
        public String returnTable;
        public String receiveXml;
        public String code;
        public String returnMsg;
        public String comment;

        public String validate() {

            return null;
        }
    }
    

    @Security.Authenticated(SecuredAdmin.class)
	public static Result report(String startTime, String endTime) {
		String fileName = TableInfoReader.getTableComment(SmsInfo.class) + "报表_" + DateUtil.NowString("yyyy_MM_dd_HH_mm_ss") + ".xls";

		// 创建工作薄对象
		HSSFWorkbook workbook2007 = new HSSFWorkbook();
		// 数据
        
        Query<SmsInfo> query = Ebean.find(SmsInfo.class);
        if (StrUtil.isNotNull(startTime) && StrUtil.isNotNull(endTime)){
            query.where().between("createdAt", startTime, endTime);
        }
        query.orderBy("id desc");
		List<SmsInfo> list = query.findList();

        if (list.size() == 0) {
            if (StrUtil.isNotNull(startTime) && StrUtil.isNotNull(endTime)) {
                return ok("日期: " + startTime + " 至 " + endTime + ", 报表" + NO_FOUND + ", 请返回重试!");
            }
            return ok(NO_FOUND);
        }

		// 创建单元格样式
		HSSFCellStyle cellStyle = workbook2007.createCellStyle();
		// 设置边框属性
		cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
		// 指定单元格居中对齐
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		// 指定单元格垂直居中对齐
		cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		// 指定当单元格内容显示不下时自动换行
		cellStyle.setWrapText(true);
		// // 设置单元格字体
		HSSFFont font = workbook2007.createFont();
		font.setFontName("宋体");
		// 大小
		font.setFontHeightInPoints((short) 10);
		// 加粗
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		cellStyle.setFont(font);

		HSSFCellStyle style = workbook2007.createCellStyle();
		// 指定单元格居中对齐
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		// 指定单元格垂直居中对齐
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		HSSFFont font1 = workbook2007.createFont();
		font1.setFontName("宋体");
		font1.setFontHeightInPoints((short) 10);
		// 加粗
		font1.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		style.setFont(font1);

		// 创建工作表对象，并命名
		HSSFSheet sheet2 = workbook2007.createSheet(TableInfoReader.getTableComment(SmsInfo.class) + "报表");
		// 设置列
        sheet2.setColumnWidth(0, 4000);
        sheet2.setDefaultColumnStyle(0, cellStyle);//name
        sheet2.setColumnWidth(1, 4000);
        sheet2.setDefaultColumnStyle(1, cellStyle);//phone
        sheet2.setColumnWidth(2, 4000);
        sheet2.setDefaultColumnStyle(2, cellStyle);//check_code
        sheet2.setColumnWidth(3, 4000);
        sheet2.setDefaultColumnStyle(3, cellStyle);//send_xml
        sheet2.setColumnWidth(4, 4000);
        sheet2.setDefaultColumnStyle(4, cellStyle);//return_table
        sheet2.setColumnWidth(5, 4000);
        sheet2.setDefaultColumnStyle(5, cellStyle);//receive_xml
        sheet2.setColumnWidth(6, 4000);
        sheet2.setDefaultColumnStyle(6, cellStyle);//code
        sheet2.setColumnWidth(7, 4000);
        sheet2.setDefaultColumnStyle(7, cellStyle);//return_msg
        sheet2.setColumnWidth(8, 4000);
        sheet2.setDefaultColumnStyle(8, cellStyle);//created_at
        sheet2.setColumnWidth(9, 4000);
        sheet2.setDefaultColumnStyle(9, cellStyle);//comment


		// 创建表头
		HSSFRow title = sheet2.createRow(0);
		title.setHeightInPoints(50);
		title.createCell(0).setCellValue(TableInfoReader.getTableComment(SmsInfo.class) + "报表");
        title.createCell(1).setCellValue("");
        title.createCell(2).setCellValue("");
        title.createCell(3).setCellValue("");
        title.createCell(4).setCellValue("");
        title.createCell(5).setCellValue("");
        title.createCell(6).setCellValue("");
        title.createCell(7).setCellValue("");
        title.createCell(8).setCellValue("");
        title.createCell(9).setCellValue("");
		sheet2.addMergedRegion(new Region(0, (short) 0, 0, (short) 9));
		HSSFCell ce = title.createCell((short) 1);

		HSSFRow titleRow = sheet2.createRow(1);
        
		// 设置行高
		titleRow.setHeightInPoints(30);
        titleRow.createCell(0).setCellValue(TableInfoReader.getFieldComment(SmsInfo.class, "name"));//name
        titleRow.createCell(1).setCellValue(TableInfoReader.getFieldComment(SmsInfo.class, "phone"));//phone
        titleRow.createCell(2).setCellValue(TableInfoReader.getFieldComment(SmsInfo.class, "checkCode"));//check_code
        titleRow.createCell(3).setCellValue(TableInfoReader.getFieldComment(SmsInfo.class, "sendXml"));//send_xml
        titleRow.createCell(4).setCellValue(TableInfoReader.getFieldComment(SmsInfo.class, "returnTable"));//return_table
        titleRow.createCell(5).setCellValue(TableInfoReader.getFieldComment(SmsInfo.class, "receiveXml"));//receive_xml
        titleRow.createCell(6).setCellValue(TableInfoReader.getFieldComment(SmsInfo.class, "code"));//code
        titleRow.createCell(7).setCellValue(TableInfoReader.getFieldComment(SmsInfo.class, "returnMsg"));//return_msg
        titleRow.createCell(8).setCellValue(TableInfoReader.getFieldComment(SmsInfo.class, "createdAt"));//created_at
        titleRow.createCell(9).setCellValue(TableInfoReader.getFieldComment(SmsInfo.class, "comment"));//comment
		HSSFCell ce2 = title.createCell((short) 2);
		ce2.setCellStyle(cellStyle); // 样式，居中

		// 遍历集合对象创建行和单元格
		for (int i = 0; i < list.size(); i++) {
			// 取出对象
			SmsInfo item = list.get(i);
			// 创建行
			HSSFRow row = sheet2.createRow(i + 2);
			// 创建单元格并赋值
            HSSFCell cell0 = row.createCell(0);
            if (item.name == null) {
                cell0.setCellValue("");
            } else {
                cell0.setCellValue(item.name);
            }
            HSSFCell cell1 = row.createCell(1);
            if (item.phone == null) {
                cell1.setCellValue("");
            } else {
                cell1.setCellValue(item.phone);
            }
            HSSFCell cell2 = row.createCell(2);
            if (item.checkCode == null) {
                cell2.setCellValue("");
            } else {
                cell2.setCellValue(item.checkCode);
            }
            HSSFCell cell3 = row.createCell(3);
            if (item.sendXml == null) {
                cell3.setCellValue("");
            } else {
                cell3.setCellValue(item.sendXml);
            }
            HSSFCell cell4 = row.createCell(4);
            if (item.returnTable == null) {
                cell4.setCellValue("");
            } else {
                cell4.setCellValue(item.returnTable);
            }
            HSSFCell cell5 = row.createCell(5);
            if (item.receiveXml == null) {
                cell5.setCellValue("");
            } else {
                cell5.setCellValue(item.receiveXml);
            }
            HSSFCell cell6 = row.createCell(6);
            if (item.code == null) {
                cell6.setCellValue("");
            } else {
                cell6.setCellValue(item.code);
            }
            HSSFCell cell7 = row.createCell(7);
            if (item.returnMsg == null) {
                cell7.setCellValue("");
            } else {
                cell7.setCellValue(item.returnMsg);
            }
            HSSFCell cell8 = row.createCell(8);
            cell8.setCellValue(DateUtil.Date2Str(item.createdAt));
            HSSFCell cell9 = row.createCell(9);
            if (item.comment == null) {
                cell9.setCellValue("");
            } else {
                cell9.setCellValue(item.comment);
            }
		}

		// 生成文件
		String path = Play.application().path().getPath() + "/public/report/" + fileName;
		File file = new File(path);
        
        // 处理中文报表名
        String agent = request().getHeader("USER-AGENT");
        String downLoadName = null;
        try {
            if (null != agent && -1 != agent.indexOf("MSIE"))   //IE
            {
                downLoadName = java.net.URLEncoder.encode(fileName, "UTF-8");
            } else if (null != agent && -1 != agent.indexOf("Mozilla")) //Firefox
            {
                downLoadName = new String(fileName.getBytes("UTF-8"), "iso-8859-1");
            } else {
                downLoadName = java.net.URLEncoder.encode(fileName, "UTF-8");
            }
        } catch (UnsupportedEncodingException ex) {
            play.Logger.error("导出报表处理中文报表名出错: " + ex.getMessage());
        }
        if (downLoadName != null) {
            response().setHeader("Content-disposition", "attachment;filename="
                    + downLoadName);
            response().setContentType("application/vnd.ms-excel;charset=UTF-8");
        }
        
		FileOutputStream fos = null;
		try {
			fos = new FileOutputStream(file);
			workbook2007.write(fos);
		} catch (Exception e) {
            play.Logger.error("生成报表出错: " + e.getMessage());
		} finally {
			if (fos != null) {
				try {
					fos.close();
				} catch (Exception e) {
                    play.Logger.error("生成报表出错, 关闭流出错: " + e.getMessage());
				}
			}
		}
		return ok(file);
	}
}
