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
import models.Guest;
import models.Host;
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

public class GuestController extends Controller implements IConst {
    
    public static Result guestPage(Integer status, Integer notStatus,
                                     String fieldOn, String fieldValue, boolean isAnd,
                                     String searchOn, String kw,
                                     String startTime, String endTime,
                                     String order, String sort,
                                     Integer page, Integer size) {
        Msg<List<Guest>> msg = BaseController.doGetAll("Guest",
                status, notStatus,
                fieldOn, fieldValue, isAnd,
                searchOn, kw,
                startTime, endTime,
                order, sort,
                page, size);
        
        if (msg.flag) {
            return ok(guest.render(msg.data));
        } else {
            msg.data = new ArrayList<>();
            return ok(msg.message);
        }
    }
    
    @Security.Authenticated(SecuredAdmin.class)
    public static Result guestBackendPage() {
        return ok(guest_backend.render());
    }
    
    public static Result getGuestHosts(Long refId, Integer page, Integer size) {
        if (size == 0)
            size = PAGE_SIZE;
        if (page <= 0)
            page = 1;

        Msg<List<Host>> msg = new Msg<>();

        Guest found = Guest.find.byId(refId);
        if (found != null) {
            if (found.hosts.size() > 0) {
                Page<Host> records;
                records = Host.find.where().eq("guests.id", refId).orderBy("id desc").findPagingList(size)
                        .setFetchAhead(false).getPage(page - 1);

                if (records.getTotalRowCount() > 0) {
                    msg.flag = true;

                    PageInfo pageInfo = new PageInfo();
                    pageInfo.current = page;
                    pageInfo.total = records.getTotalRowCount();
                    pageInfo.size = size;
                    if (records.hasPrev())
                        pageInfo.hasPrev = true;
                    if (records.hasNext())
                        pageInfo.hasNext = true;

                    msg.data = records.getList();
                    msg.page = pageInfo;
                    play.Logger.info("result: " + msg.data.size());
                } else {
                    msg.message = NO_FOUND;
                    play.Logger.info("hosts row result: " + NO_FOUND);
                }
            } else {
                msg.message = NO_FOUND;
                play.Logger.info("hosts result: " + NO_FOUND);
            }
        } else {
            msg.message = NO_FOUND;
            play.Logger.info("guest result: " + NO_FOUND);
        }
        return ok(Json.toJson(msg));
    }

    @Security.Authenticated(SecuredSuperAdmin.class)
    @MethodName("新增_Guest")
    @Role("create_guest")
    public static Result add() {
        Msg<Guest> msg = new Msg<>();

        Form<GuestParser> httpForm = form(GuestParser.class).bindFromRequest();
        if (!httpForm.hasErrors()) {
            GuestParser formObj = httpForm.get();            
            Guest newObj = new Guest();
            
            String uniqueFieldIssue = BaseController.checkFieldUnique("Guest", formObj);
            if (StrUtil.isNotNull(uniqueFieldIssue)) {
                msg.message = "字段[" + TableInfoReader.getFieldComment("Guest", uniqueFieldIssue)
                        + "]存在同名数据";
                return ok(Json.toJson(msg));
            }

            newObj.name = formObj.name;
            newObj.loginName = formObj.loginName;
            newObj.sexEnum = formObj.sexEnum;
            newObj.phone = formObj.phone;
            newObj.cardNumber = formObj.cardNumber;
            newObj.email = formObj.email;
            newObj.address = formObj.address;
            newObj.birth = formObj.birth;
            newObj.password = formObj.password;
            newObj.status = formObj.status;
            newObj.userRoleEnum = formObj.userRoleEnum;
            newObj.images = formObj.images;
            newObj.houseName = formObj.houseName;
            newObj.building = formObj.building;
            newObj.unit = formObj.unit;
            newObj.room = formObj.room;
            newObj.amount = formObj.amount;
            newObj.totalAmount = formObj.totalAmount;
            newObj.contractLength = formObj.contractLength;
            newObj.contractStartDate = formObj.contractStartDate;
            newObj.contractEndDate = formObj.contractEndDate;
            newObj.comment = formObj.comment;

            if (formObj.hosts == null) {
                formObj.hosts = new ArrayList<>();
            }
            newObj.hosts = formObj.hosts;
        
            Transaction txn = Ebean.beginTransaction();
            try{
                SaveBiz.beforeSave(newObj);
                Ebean.save(newObj);
                
                for (Host jsonRefObj : formObj.hosts){
                    Host dbRefObj = Host.find.byId(jsonRefObj.id);
                    dbRefObj.guests.add(newObj);
                    dbRefObj.save();
                }
                
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
    @MethodName("修改_Guest")
    @Role("update_guest")
    public static Result update(long id) {
        Msg<Guest> msg = new Msg<>();

        Guest found = Guest.find.byId(id);
        if (found == null) {
            msg.message = NO_FOUND;
            play.Logger.info("result: " + msg.message);
            return ok(Json.toJson(msg));
        }

        Form<GuestParser> httpForm = form(GuestParser.class).bindFromRequest();

        if (!httpForm.hasErrors()) {
            GuestParser formObj = httpForm.get();        
            
            String uniqueFieldIssue = BaseController.checkFieldUnique("Guest", formObj, 1);
            if (StrUtil.isNotNull(uniqueFieldIssue)) {
                msg.message = "字段[" + TableInfoReader.getFieldComment("Guest", uniqueFieldIssue)
                        + "]存在同名数据";
                return ok(Json.toJson(msg));
            }
            
            Transaction txn = Ebean.beginTransaction();
            try{
                found = Guest.find.byId(id);
                            
                found.name = formObj.name;
                found.loginName = formObj.loginName;
                found.sexEnum = formObj.sexEnum;
                found.phone = formObj.phone;
                found.cardNumber = formObj.cardNumber;
                found.email = formObj.email;
                found.address = formObj.address;
                found.birth = formObj.birth;
                found.password = formObj.password;
                found.status = formObj.status;
                found.userRoleEnum = formObj.userRoleEnum;
                found.images = formObj.images;
                found.houseName = formObj.houseName;
                found.building = formObj.building;
                found.unit = formObj.unit;
                found.room = formObj.room;
                found.amount = formObj.amount;
                found.totalAmount = formObj.totalAmount;
                found.contractLength = formObj.contractLength;
                found.contractStartDate = formObj.contractStartDate;
                found.contractEndDate = formObj.contractEndDate;
                found.comment = formObj.comment;

                // 处理多对多 guest <-> Host, 先清掉对面的
                for (Host refObj : found.hosts) {
                    if (refObj.guests.contains(found)) {
                        refObj.guests.remove(found);
                        refObj.save();
                    }
                }

                // 清掉自己这边的
                found.hosts = new ArrayList<>();
                found.save();

                // 两边加回
                List<Host> allRefHosts = Host.find.all();
                if (formObj.hosts != null) {
                    for (Host jsonRefObj : formObj.hosts) {
                        for (Host dbRefObj : allRefHosts) {
                            if (dbRefObj.id == jsonRefObj.id) {
                                if (!found.hosts.contains(dbRefObj)) {
                                    found.hosts.add(dbRefObj);
                                }
                                if (!dbRefObj.guests.contains(found)) {
                                    dbRefObj.guests.add(found);
                                    dbRefObj.save();
                                }
                            }

                        }
                    }
                }
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
    
    public static class GuestParser {

        public String name;
        public String loginName;
        public String wxId;
        public int sexEnum;
        public String phone;
        public String cardNumber;
        public String email;
        public String address;
        public Date birth;
        public String password;
        public int status;
        public int userRoleEnum;
        public String images;
        public String houseName;
        public String building;
        public String unit;
        public String room;
        public int amount;
        public int totalAmount;
        public String contractLength;
        public Date contractStartDate;
        public Date contractEndDate;
        public String comment;
        public List<Host> hosts;        

        public String validate() {
            if (StrUtil.isNull(name)) {
                return TableInfoReader.getFieldComment(Guest.class, "name") + "不能为空";
            }

            return null;
        }
    }
    
    @Security.Authenticated(SecuredSuperAdmin.class)
    @MethodName("删除_Guest")
    @Role("dalete_guest")
    public static Result delete(long id) {
        Msg<Guest> msg = new Msg<>();

        Guest found = Guest.find.byId(id);
        if (found != null) {
            Transaction txn = Ebean.beginTransaction();
            try{
                // 解除多对多的关联
                for (Host host : found.hosts) {
                    host.guests.remove(found);
                    host.save();
                }
                found.hosts = new ArrayList<>();
                
                found.save();
                Ebean.delete(found);
                txn.commit();
                
                msg.flag = true;
                play.Logger.info("result: " + DELETE_SUCCESS);
                if (ConfigBiz.getBoolConfig("websocket"))
                    for (WebSocket.Out channel : channels) channel.write("delete");
            } catch (PersistenceException ex){
                msg.message = DELETE_ISSUE + ", ex: " + ex.getMessage();
                play.Logger.error(msg.message);
            } finally {
                txn.end();
            }
        } else {
            msg.message = NO_FOUND;
            play.Logger.info("result: " + NO_FOUND);
        }
        return ok(Json.toJson(msg));
    }

    @Security.Authenticated(SecuredAdmin.class)
    @MethodName("导出报表_Guest")
    @Role("report_guest")
	public static Result report(String startTime, String endTime) {
		String fileName = TableInfoReader.getTableComment(Guest.class) + "报表_" + DateUtil.NowString("yyyy_MM_dd_HH_mm_ss") + ".xls";

		// 创建工作薄对象
		HSSFWorkbook workbook2007 = new HSSFWorkbook();
		// 数据
        
        Query<Guest> query = Ebean.find(Guest.class);
        if (StrUtil.isNotNull(startTime) && StrUtil.isNotNull(endTime)){
            query.where().between("createdAt", startTime, endTime);
        }
        query.orderBy("id desc");
		List<Guest> list = query.findList();

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
		HSSFSheet sheet2 = workbook2007.createSheet(TableInfoReader.getTableComment(Guest.class) + "报表");
		// 设置列
        sheet2.setColumnWidth(0, 4000);
        sheet2.setDefaultColumnStyle(0, cellStyle);//name
        sheet2.setColumnWidth(1, 4000);
        sheet2.setDefaultColumnStyle(1, cellStyle);//login_name
        sheet2.setColumnWidth(2, 4000);
        sheet2.setDefaultColumnStyle(2, cellStyle);//sex_enum
        sheet2.setColumnWidth(3, 4000);
        sheet2.setDefaultColumnStyle(3, cellStyle);//phone
        sheet2.setColumnWidth(4, 4000);
        sheet2.setDefaultColumnStyle(4, cellStyle);//card_number
        sheet2.setColumnWidth(5, 4000);
        sheet2.setDefaultColumnStyle(5, cellStyle);//email
        sheet2.setColumnWidth(6, 4000);
        sheet2.setDefaultColumnStyle(6, cellStyle);//address
        sheet2.setColumnWidth(7, 4000);
        sheet2.setDefaultColumnStyle(7, cellStyle);//birth
        sheet2.setColumnWidth(8, 4000);
        sheet2.setDefaultColumnStyle(8, cellStyle);//password
        sheet2.setColumnWidth(9, 4000);
        sheet2.setDefaultColumnStyle(9, cellStyle);//created_at
        sheet2.setColumnWidth(10, 4000);
        sheet2.setDefaultColumnStyle(10, cellStyle);//status
        sheet2.setColumnWidth(11, 4000);
        sheet2.setDefaultColumnStyle(11, cellStyle);//user_role_enum
        sheet2.setColumnWidth(12, 4000);
        sheet2.setDefaultColumnStyle(12, cellStyle);//house_name
        sheet2.setColumnWidth(13, 4000);
        sheet2.setDefaultColumnStyle(13, cellStyle);//building
        sheet2.setColumnWidth(14, 4000);
        sheet2.setDefaultColumnStyle(14, cellStyle);//unit
        sheet2.setColumnWidth(15, 4000);
        sheet2.setDefaultColumnStyle(15, cellStyle);//room
        sheet2.setColumnWidth(16, 4000);
        sheet2.setDefaultColumnStyle(16, cellStyle);//amount
        sheet2.setColumnWidth(17, 4000);
        sheet2.setDefaultColumnStyle(17, cellStyle);//total_amount
        sheet2.setColumnWidth(18, 4000);
        sheet2.setDefaultColumnStyle(18, cellStyle);//contract_length
        sheet2.setColumnWidth(19, 4000);
        sheet2.setDefaultColumnStyle(19, cellStyle);//contract_start_date
        sheet2.setColumnWidth(20, 4000);
        sheet2.setDefaultColumnStyle(20, cellStyle);//contract_end_date
        sheet2.setColumnWidth(21, 4000);
        sheet2.setDefaultColumnStyle(21, cellStyle);//last_update_time
        sheet2.setColumnWidth(22, 4000);
        sheet2.setDefaultColumnStyle(22, cellStyle);//comment


		// 创建表头
		HSSFRow title = sheet2.createRow(0);
		title.setHeightInPoints(50);
		title.createCell(0).setCellValue(TableInfoReader.getTableComment(Guest.class) + "报表");
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
        title.createCell(19).setCellValue("");
        title.createCell(20).setCellValue("");
        title.createCell(21).setCellValue("");
        title.createCell(22).setCellValue("");
		sheet2.addMergedRegion(new Region(0, (short) 0, 0, (short) 22));
		HSSFCell ce = title.createCell((short) 1);

		HSSFRow titleRow = sheet2.createRow(1);
        
		// 设置行高
		titleRow.setHeightInPoints(30);
        titleRow.createCell(0).setCellValue(TableInfoReader.getFieldComment(Guest.class, "name"));//name
        titleRow.createCell(1).setCellValue(TableInfoReader.getFieldComment(Guest.class, "loginName"));//login_name
        titleRow.createCell(2).setCellValue(TableInfoReader.getFieldComment(Guest.class, "sexEnum"));//sex_enum
        titleRow.createCell(3).setCellValue(TableInfoReader.getFieldComment(Guest.class, "phone"));//phone
        titleRow.createCell(4).setCellValue(TableInfoReader.getFieldComment(Guest.class, "cardNumber"));//card_number
        titleRow.createCell(5).setCellValue(TableInfoReader.getFieldComment(Guest.class, "email"));//email
        titleRow.createCell(6).setCellValue(TableInfoReader.getFieldComment(Guest.class, "address"));//address
        titleRow.createCell(7).setCellValue(TableInfoReader.getFieldComment(Guest.class, "birth"));//birth
        titleRow.createCell(8).setCellValue(TableInfoReader.getFieldComment(Guest.class, "password"));//password
        titleRow.createCell(9).setCellValue(TableInfoReader.getFieldComment(Guest.class, "createdAt"));//created_at
        titleRow.createCell(10).setCellValue(TableInfoReader.getFieldComment(Guest.class, "status"));//status
        titleRow.createCell(11).setCellValue(TableInfoReader.getFieldComment(Guest.class, "userRoleEnum"));//user_role_enum
        titleRow.createCell(12).setCellValue(TableInfoReader.getFieldComment(Guest.class, "houseName"));//house_name
        titleRow.createCell(13).setCellValue(TableInfoReader.getFieldComment(Guest.class, "building"));//building
        titleRow.createCell(14).setCellValue(TableInfoReader.getFieldComment(Guest.class, "unit"));//unit
        titleRow.createCell(15).setCellValue(TableInfoReader.getFieldComment(Guest.class, "room"));//room
        titleRow.createCell(16).setCellValue(TableInfoReader.getFieldComment(Guest.class, "amount"));//amount
        titleRow.createCell(17).setCellValue(TableInfoReader.getFieldComment(Guest.class, "totalAmount"));//total_amount
        titleRow.createCell(18).setCellValue(TableInfoReader.getFieldComment(Guest.class, "contractLength"));//contract_length
        titleRow.createCell(19).setCellValue(TableInfoReader.getFieldComment(Guest.class, "contractStartDate"));//contract_start_date
        titleRow.createCell(20).setCellValue(TableInfoReader.getFieldComment(Guest.class, "contractEndDate"));//contract_end_date
        titleRow.createCell(21).setCellValue(TableInfoReader.getFieldComment(Guest.class, "lastUpdateTime"));//last_update_time
        titleRow.createCell(22).setCellValue(TableInfoReader.getFieldComment(Guest.class, "comment"));//comment
		HSSFCell ce2 = title.createCell((short) 2);
		ce2.setCellStyle(cellStyle); // 样式，居中

		// 遍历集合对象创建行和单元格
		for (int i = 0; i < list.size(); i++) {
			// 取出对象
			Guest item = list.get(i);
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
            if (item.loginName == null) {
                cell1.setCellValue("");
            } else {
                cell1.setCellValue(item.loginName);
            }
            HSSFCell cell2 = row.createCell(2);
            cell2.setCellValue(EnumInfoReader.getEnumName(Guest.class, "sexEnum", item.sexEnum));
            HSSFCell cell3 = row.createCell(3);
            if (item.phone == null) {
                cell3.setCellValue("");
            } else {
                cell3.setCellValue(item.phone);
            }
            HSSFCell cell4 = row.createCell(4);
            if (item.cardNumber == null) {
                cell4.setCellValue("");
            } else {
                cell4.setCellValue(item.cardNumber);
            }
            HSSFCell cell5 = row.createCell(5);
            if (item.email == null) {
                cell5.setCellValue("");
            } else {
                cell5.setCellValue(item.email);
            }
            HSSFCell cell6 = row.createCell(6);
            if (item.address == null) {
                cell6.setCellValue("");
            } else {
                cell6.setCellValue(item.address);
            }
            HSSFCell cell7 = row.createCell(7);
            cell7.setCellValue(DateUtil.Date2Str(item.birth));
            HSSFCell cell8 = row.createCell(8);
            if (item.password == null) {
                cell8.setCellValue("");
            } else {
                cell8.setCellValue(item.password);
            }
            HSSFCell cell9 = row.createCell(9);
            cell9.setCellValue(DateUtil.Date2Str(item.createdAt));
            HSSFCell cell10 = row.createCell(10);
            cell10.setCellValue(EnumInfoReader.getEnumName(Guest.class, "status", item.status));
            HSSFCell cell11 = row.createCell(11);
            cell11.setCellValue(EnumInfoReader.getEnumName(Guest.class, "userRoleEnum", item.userRoleEnum));
            HSSFCell cell12 = row.createCell(12);
            if (item.houseName == null) {
                cell12.setCellValue("");
            } else {
                cell12.setCellValue(item.houseName);
            }
            HSSFCell cell13 = row.createCell(13);
            if (item.building == null) {
                cell13.setCellValue("");
            } else {
                cell13.setCellValue(item.building);
            }
            HSSFCell cell14 = row.createCell(14);
            if (item.unit == null) {
                cell14.setCellValue("");
            } else {
                cell14.setCellValue(item.unit);
            }
            HSSFCell cell15 = row.createCell(15);
            if (item.room == null) {
                cell15.setCellValue("");
            } else {
                cell15.setCellValue(item.room);
            }
            HSSFCell cell16 = row.createCell(16);
            cell16.setCellValue(EnumInfoReader.getEnumName(Guest.class, "amount", item.amount));
            HSSFCell cell17 = row.createCell(17);
            cell17.setCellValue(EnumInfoReader.getEnumName(Guest.class, "totalAmount", item.totalAmount));
            HSSFCell cell18 = row.createCell(18);
            if (item.contractLength == null) {
                cell18.setCellValue("");
            } else {
                cell18.setCellValue(item.contractLength);
            }
            HSSFCell cell19 = row.createCell(19);
            cell19.setCellValue(DateUtil.Date2Str(item.contractStartDate));
            HSSFCell cell20 = row.createCell(20);
            cell20.setCellValue(DateUtil.Date2Str(item.contractEndDate));
            HSSFCell cell21 = row.createCell(21);
            cell21.setCellValue(DateUtil.Date2Str(item.lastUpdateTime));
            HSSFCell cell22 = row.createCell(22);
            if (item.comment == null) {
                cell22.setCellValue("");
            } else {
                cell22.setCellValue(item.comment);
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
