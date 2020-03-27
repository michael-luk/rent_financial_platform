package models;

import LyLib.Interfaces.IConst;
import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import play.db.ebean.Model;
import util.Comment;
import util.EnumMap;
import util.SearchField;
import util.TableComment;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "guest")
@TableComment("租客")
public class Guest extends Model implements IConst {

    @Id
    public Long id;

    @NotNull
    @SearchField
    @Comment("姓名")
    public String name;

    @Comment("登录名")
    public String loginName;

    @Comment("微信ID")
    public String wxId;

    @Comment("性别")
    @EnumMap(value = "0,1", name = "男,女")
    public int sexEnum;

    @Comment("联系电话")
    public String phone;

    @Comment("身份证")
    public String cardNumber;

    @Comment("email")
    public String email;

    @Comment("地址")
    public String address;

    @Comment("出生")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    public Date birth;

    @Comment("密码")
    public String password;

    @Comment("创建时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date createdAt;

    @Comment("状态")
    @EnumMap(value = "0,1,2", name = "有效,到期,关闭")
    public int status = 0;     // 0-正常, 1-冻结

    @Comment("等级")
    @EnumMap(value = "0,1", name = "普通用户,高级用户")
    public int userRoleEnum = 0; // 状态: 0普通用户, 1管理员, 2超级管理员

    @Comment("身份证图")
    @Lob
    public String images;

    // 合同部分
    @Comment("小区")
    public String houseName;

    @Comment("栋")
    public String building;

    @Comment("单元")
    public String unit;

    @Comment("房号")
    public String room;

    @Comment("月租金")
    public int amount;

    @Comment("合同总金额")
    public int totalAmount;

    @Comment("合同时间")
    public String contractLength;

    @Comment("开始日期")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    public Date contractStartDate;

    @Comment("到期日期")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    public Date contractEndDate;

    @Comment("修改时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date lastUpdateTime;

    @Lob
    @Comment("备注")
    public String comment;

    @Comment("所属房东")
    @JsonIgnore
    @ManyToMany(targetEntity = models.Host.class)
    public List<Host> hosts;

    @Comment("我的房租记录")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "guest")
    public List<RentRecord> rentRecords;

    public Guest() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, Guest> find = new Finder(Long.class, Guest.class);

    @Override
    public String toString() {
        return "租客 [name:" + name + "]";
    }
}
