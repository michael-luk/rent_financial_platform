package controllers.gen;

import controllers.*;
import controllers.biz.*;
import play.mvc.WebSocket;
import util.*;
import views.html.*;
import views.html.gen.*;
import LyLib.Interfaces.IConst;
import LyLib.Utils.DateUtil;
import LyLib.Utils.PageInfo;
import LyLib.Utils.StrUtil;
import LyLib.Utils.Msg;
import com.avaje.ebean.Ebean;
import com.avaje.ebean.Page;
import com.avaje.ebean.Query;
import com.avaje.ebean.Transaction;
import java.util.ArrayList;
import models.House;
import models.Host;
import models.Partner;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;

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

import static controllers.Application.channels;
import static play.data.Form.form;

public class HouseController extends Controller implements IConst {
    
    public static Result housePage(Integer status, Integer notStatus,
                                     String fieldOn, String fieldValue, boolean isAnd,
                                     String searchOn, String kw,
                                     String startTime, String endTime,
                                     String order, String sort,
                                     Integer page, Integer size) {
        Msg<List<House>> msg = BaseController.doGetAll("House",
                status, notStatus,
                fieldOn, fieldValue, isAnd,
                searchOn, kw,
                startTime, endTime,
                order, sort,
                page, size);
        
        if (msg.flag) {
            return ok(house.render(msg.data));
        } else {
            msg.data = new ArrayList<>();
            return ok(msg.message);
        }
    }
    
    @Security.Authenticated(SecuredAdmin.class)
    public static Result houseBackendPage() {
        return ok(house_backend.render());
    }
    

    @Security.Authenticated(SecuredSuperAdmin.class)
    @MethodName("新增_House")
    @Role("create_house")
    public static Result add() {
        Msg<House> msg = new Msg<>();

        Form<HouseParser> httpForm = form(HouseParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            HouseParser formObj = httpForm.get();            
            House newObj = new House();
            
            String uniqueFieldIssue = BaseController.checkFieldUnique("House", formObj);
            if (StrUtil.isNotNull(uniqueFieldIssue)) {
                msg.message = "字段[" + TableInfoReader.getFieldComment("House", uniqueFieldIssue)
                        + "]存在同名数据";
                return ok(Json.toJson(msg));
            }

            newObj.name = formObj.name;
            newObj.classify = formObj.classify;
            newObj.province = formObj.province;
            newObj.city = formObj.city;
            newObj.zone = formObj.zone;
            newObj.address = formObj.address;
            newObj.age = formObj.age;
            newObj.size = formObj.size;
            newObj.structure = formObj.structure;
            newObj.rent = formObj.rent;
            newObj.credit = formObj.credit;
            newObj.visible = formObj.visible;
            newObj.status = formObj.status;
            newObj.images = formObj.images;
            newObj.description = formObj.description;
            newObj.comment = formObj.comment;

		    Host parentHost = Host.find.byId(formObj.refHostId);
		    newObj.host = parentHost;
		    newObj.refHostId = formObj.refHostId;
		    Partner parentPartner = Partner.find.byId(formObj.refPartnerId);
		    newObj.partner = parentPartner;
		    newObj.refPartnerId = formObj.refPartnerId;
            Transaction txn = Ebean.beginTransaction();
            try{
                SaveBiz.beforeSave(newObj);
                Ebean.save(newObj);
                
                
                txn.commit();
                msg.flag = true;
                msg.data = newObj;
                play.Logger.info("result: " + CREATE_SUCCESS);
                if (ConfigBiz.getBoolConfig("websocket"))
                    for (WebSocket.Out channel : channels) channel.write("new");
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
    @MethodName("修改_House")
    @Role("update_house")
    public static Result update(long id) {
        Msg<House> msg = new Msg<>();

        House found = House.find.byId(id);
        if (found == null) {
            msg.message = NO_FOUND;
            play.Logger.info("result: " + msg.message);
            return ok(Json.toJson(msg));
        }

        Form<HouseParser> httpForm = form(HouseParser.class).bindFromRequest();

        if (!httpForm.hasErrors()) {
            HouseParser formObj = httpForm.get();        
            
            String uniqueFieldIssue = BaseController.checkFieldUnique("House", formObj, 1);
            if (StrUtil.isNotNull(uniqueFieldIssue)) {
                msg.message = "字段[" + TableInfoReader.getFieldComment("House", uniqueFieldIssue)
                        + "]存在同名数据";
                return ok(Json.toJson(msg));
            }
            
            Transaction txn = Ebean.beginTransaction();
            try{
                found = House.find.byId(id);
                            
                found.name = formObj.name;
                found.classify = formObj.classify;
                found.province = formObj.province;
                found.city = formObj.city;
                found.zone = formObj.zone;
                found.address = formObj.address;
                found.age = formObj.age;
                found.size = formObj.size;
                found.structure = formObj.structure;
                found.rent = formObj.rent;
                found.credit = formObj.credit;
                found.visible = formObj.visible;
                found.status = formObj.status;
                found.images = formObj.images;
                found.description = formObj.description;
                found.comment = formObj.comment;

		        Host parentHost = Host.find.byId(formObj.refHostId);
		        found.refHostId = formObj.refHostId;
		        found.host = parentHost;
		        Partner parentPartner = Partner.find.byId(formObj.refPartnerId);
		        found.refPartnerId = formObj.refPartnerId;
		        found.partner = parentPartner;
                SaveBiz.beforeUpdate(found);
                Ebean.update(found);
                txn.commit();
                msg.flag = true;
                msg.data = found;
                play.Logger.info("result: " + UPDATE_SUCCESS);
                if (ConfigBiz.getBoolConfig("websocket"))
                    for (WebSocket.Out channel : channels) channel.write("update");
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
    
    public static class HouseParser {

        public String name;
        public String classify;
        public String province;
        public String city;
        public String zone;
        public String address;
        public int age;
        public String size;
        public String structure;
        public int rent;
        public int credit;
        public boolean visible;
        public int status;
        public String images;
        public String description;
        public String comment;
        public long refHostId;
        public long refPartnerId;

        public String validate() {
            if (StrUtil.isNull(name)) {
                return TableInfoReader.getFieldComment(House.class, "name") + "不能为空";
            }

            if (Host.find.byId(refHostId) == null) {
                return "无法找到上级, 请重试.";
            }
            if (Partner.find.byId(refPartnerId) == null) {
                return "无法找到上级, 请重试.";
            }
            return null;
        }
    }
    

    @Security.Authenticated(SecuredAdmin.class)
    @MethodName("导出报表_House")
    @Role("report_house")
	public static Result report(String startTime, String endTime) {
		String fileName = TableInfoReader.getTableComment(House.class) + "报表_" + DateUtil.NowString("yyyy_MM_dd_HH_mm_ss") + ".xls";

		// 创建工作薄对象
		HSSFWorkbook workbook2007 = new HSSFWorkbook();
		// 数据
        
        Query<House> query = Ebean.find(House.class);
        if (StrUtil.isNotNull(startTime) && StrUtil.isNotNull(endTime)){
            query.where().between("createdAt", startTime, endTime);
        }
        query.orderBy("id desc");
		List<House> list = query.findList();

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
		HSSFSheet sheet2 = workbook2007.createSheet(TableInfoReader.getTableComment(House.class) + "报表");
		// 设置列
        sheet2.setColumnWidth(0, 4000);
        sheet2.setDefaultColumnStyle(0, cellStyle);//name
        sheet2.setColumnWidth(1, 4000);
        sheet2.setDefaultColumnStyle(1, cellStyle);//classify
        sheet2.setColumnWidth(2, 4000);
        sheet2.setDefaultColumnStyle(2, cellStyle);//province
        sheet2.setColumnWidth(3, 4000);
        sheet2.setDefaultColumnStyle(3, cellStyle);//city
        sheet2.setColumnWidth(4, 4000);
        sheet2.setDefaultColumnStyle(4, cellStyle);//zone
        sheet2.setColumnWidth(5, 4000);
        sheet2.setDefaultColumnStyle(5, cellStyle);//address
        sheet2.setColumnWidth(6, 4000);
        sheet2.setDefaultColumnStyle(6, cellStyle);//age
        sheet2.setColumnWidth(7, 4000);
        sheet2.setDefaultColumnStyle(7, cellStyle);//size
        sheet2.setColumnWidth(8, 4000);
        sheet2.setDefaultColumnStyle(8, cellStyle);//structure
        sheet2.setColumnWidth(9, 4000);
        sheet2.setDefaultColumnStyle(9, cellStyle);//rent
        sheet2.setColumnWidth(10, 4000);
        sheet2.setDefaultColumnStyle(10, cellStyle);//credit
        sheet2.setColumnWidth(11, 4000);
        sheet2.setDefaultColumnStyle(11, cellStyle);//visible
        sheet2.setColumnWidth(12, 4000);
        sheet2.setDefaultColumnStyle(12, cellStyle);//status
        sheet2.setColumnWidth(13, 4000);
        sheet2.setDefaultColumnStyle(13, cellStyle);//created_at
        sheet2.setColumnWidth(14, 4000);
        sheet2.setDefaultColumnStyle(14, cellStyle);//last_update_time
        sheet2.setColumnWidth(15, 4000);
        sheet2.setDefaultColumnStyle(15, cellStyle);//description
        sheet2.setColumnWidth(16, 4000);
        sheet2.setDefaultColumnStyle(16, cellStyle);//comment
        sheet2.setColumnWidth(17, 4000);
        sheet2.setDefaultColumnStyle(17, cellStyle);//host_id
        sheet2.setColumnWidth(18, 4000);
        sheet2.setDefaultColumnStyle(18, cellStyle);//partner_id


		// 创建表头
		HSSFRow title = sheet2.createRow(0);
		title.setHeightInPoints(50);
		title.createCell(0).setCellValue(TableInfoReader.getTableComment(House.class) + "报表");
        title.createCell(1).setCellValue("");
        title.createCell(2).setCellValue("");
        title.createCell(3).setCellValue("");
        title.createCell(4).setCellValue("");
        title.createCell(5).setCellValue("");
        title.createCell(6).setCellValue("");
        title.createCell(7).setCellValue("");
        title.createCell(8).setCellValue("");
        title.createCell(9).setCellValue("");
        title.createCell(10).setCellValue("");
        title.createCell(11).setCellValue("");
        title.createCell(12).setCellValue("");
        title.createCell(13).setCellValue("");
        title.createCell(14).setCellValue("");
        title.createCell(15).setCellValue("");
        title.createCell(16).setCellValue("");
        title.createCell(17).setCellValue("");
        title.createCell(18).setCellValue("");
		sheet2.addMergedRegion(new Region(0, (short) 0, 0, (short) 18));
		HSSFCell ce = title.createCell((short) 1);

		HSSFRow titleRow = sheet2.createRow(1);
        
		// 设置行高
		titleRow.setHeightInPoints(30);
        titleRow.createCell(0).setCellValue(TableInfoReader.getFieldComment(House.class, "name"));//name
        titleRow.createCell(1).setCellValue(TableInfoReader.getFieldComment(House.class, "classify"));//classify
        titleRow.createCell(2).setCellValue(TableInfoReader.getFieldComment(House.class, "province"));//province
        titleRow.createCell(3).setCellValue(TableInfoReader.getFieldComment(House.class, "city"));//city
        titleRow.createCell(4).setCellValue(TableInfoReader.getFieldComment(House.class, "zone"));//zone
        titleRow.createCell(5).setCellValue(TableInfoReader.getFieldComment(House.class, "address"));//address
        titleRow.createCell(6).setCellValue(TableInfoReader.getFieldComment(House.class, "age"));//age
        titleRow.createCell(7).setCellValue(TableInfoReader.getFieldComment(House.class, "size"));//size
        titleRow.createCell(8).setCellValue(TableInfoReader.getFieldComment(House.class, "structure"));//structure
        titleRow.createCell(9).setCellValue(TableInfoReader.getFieldComment(House.class, "rent"));//rent
        titleRow.createCell(10).setCellValue(TableInfoReader.getFieldComment(House.class, "credit"));//credit
        titleRow.createCell(11).setCellValue(TableInfoReader.getFieldComment(House.class, "visible"));//visible
        titleRow.createCell(12).setCellValue(TableInfoReader.getFieldComment(House.class, "status"));//status
        titleRow.createCell(13).setCellValue(TableInfoReader.getFieldComment(House.class, "createdAt"));//created_at
        titleRow.createCell(14).setCellValue(TableInfoReader.getFieldComment(House.class, "lastUpdateTime"));//last_update_time
        titleRow.createCell(15).setCellValue(TableInfoReader.getFieldComment(House.class, "description"));//description
        titleRow.createCell(16).setCellValue(TableInfoReader.getFieldComment(House.class, "comment"));//comment
        titleRow.createCell(17).setCellValue(TableInfoReader.getFieldComment(House.class, "host"));//host_id
        titleRow.createCell(18).setCellValue(TableInfoReader.getFieldComment(House.class, "partner"));//partner_id
		HSSFCell ce2 = title.createCell((short) 2);
		ce2.setCellStyle(cellStyle); // 样式，居中

		// 遍历集合对象创建行和单元格
		for (int i = 0; i < list.size(); i++) {
			// 取出对象
			House item = list.get(i);
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
            if (item.classify == null) {
                cell1.setCellValue("");
            } else {
                cell1.setCellValue(item.classify);
            }
            HSSFCell cell2 = row.createCell(2);
            if (item.province == null) {
                cell2.setCellValue("");
            } else {
                cell2.setCellValue(item.province);
            }
            HSSFCell cell3 = row.createCell(3);
            if (item.city == null) {
                cell3.setCellValue("");
            } else {
                cell3.setCellValue(item.city);
            }
            HSSFCell cell4 = row.createCell(4);
            if (item.zone == null) {
                cell4.setCellValue("");
            } else {
                cell4.setCellValue(item.zone);
            }
            HSSFCell cell5 = row.createCell(5);
            if (item.address == null) {
                cell5.setCellValue("");
            } else {
                cell5.setCellValue(item.address);
            }
            HSSFCell cell6 = row.createCell(6);
            cell6.setCellValue(EnumInfoReader.getEnumName(House.class, "age", item.age));
            HSSFCell cell7 = row.createCell(7);
            if (item.size == null) {
                cell7.setCellValue("");
            } else {
                cell7.setCellValue(item.size);
            }
            HSSFCell cell8 = row.createCell(8);
            if (item.structure == null) {
                cell8.setCellValue("");
            } else {
                cell8.setCellValue(item.structure);
            }
            HSSFCell cell9 = row.createCell(9);
            cell9.setCellValue(EnumInfoReader.getEnumName(House.class, "rent", item.rent));
            HSSFCell cell10 = row.createCell(10);
            cell10.setCellValue(EnumInfoReader.getEnumName(House.class, "credit", item.credit));
            HSSFCell cell11 = row.createCell(11);
            cell11.setCellValue(item.visible ? "是" : "否");
            HSSFCell cell12 = row.createCell(12);
            cell12.setCellValue(EnumInfoReader.getEnumName(House.class, "status", item.status));
            HSSFCell cell13 = row.createCell(13);
            cell13.setCellValue(DateUtil.Date2Str(item.createdAt));
            HSSFCell cell14 = row.createCell(14);
            cell14.setCellValue(DateUtil.Date2Str(item.lastUpdateTime));
            HSSFCell cell15 = row.createCell(15);
            if (item.description == null) {
                cell15.setCellValue("");
            } else {
                cell15.setCellValue(item.description);
            }
            HSSFCell cell16 = row.createCell(16);
            if (item.comment == null) {
                cell16.setCellValue("");
            } else {
                cell16.setCellValue(item.comment);
            }
            HSSFCell cell17 = row.createCell(17);
            if (item.host == null) {
                cell17.setCellValue("");
            } else {
                cell17.setCellValue(item.host.name);
            }
            HSSFCell cell18 = row.createCell(18);
            if (item.partner == null) {
                cell18.setCellValue("");
            } else {
                cell18.setCellValue(item.partner.name);
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
