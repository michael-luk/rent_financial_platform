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
@Table(name = "host")
@TableComment("房东")
public class Host extends Model implements IConst {

    @Id
    public Long id;

    @NotNull
    @SearchField
    @Comment("姓名")
    public String name;

    @Comment("真实姓名")
    public String loginName;

    @Comment("微信ID")
    public String wxId;

    @Comment("性别")
    @EnumMap(value = "0,1,2", name = "未设定,男,女")
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

    @Comment("修改时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date lastUpdateTime;

    @Comment("头像图片")
    @Lob
    public String headImages; // 图片(多个图片逗号分隔)

    @Comment("图片")
    @Lob
    public String images; // 图片(多个图片逗号分隔)

    @Comment("最后登录IP")
    public String lastLoginIp;// 最后一次登录的IP(只是管理员登录才会记录)

    @Comment("最后登录时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date lastLoginTime;

    @Comment("授信比例")
    public String lastLoginIpArea = "0.8"; // IP所在区域

    @Comment("状态")
    @EnumMap(value = "0,1,2,3,4,5,6", name = "未认证,身份认证中,身份认证失败,身份已认证,运营商认证中,授信失败,已授信")
    public int status;

    @Comment("我的额度")
    public long credit;

    @Comment("等级")
    @EnumMap(value = "0,1", name = "普通用户,高级用户")
    public int userRoleEnum;

    @Lob
    @Comment("备注")
    public String comment;

    @Comment("我的房源")
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "host")
    public List<House> houses;

    @Comment("我的金融产品购买记录")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "host")
    public List<ProductRecord> productRecords;

    @Comment("我的金融产品还款记录")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "host")
    public List<FundBackRecord> fundBackRecords;

    @Comment("我的额度变动记录")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "host")
    public List<CreditRecord> creditRecords;

    @Comment("我的电子合约签约记录")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "host")
    public List<ContractRecord> contractRecords;

    @Comment("我的房租记录")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "host")
    public List<RentRecord> rentRecords;

    @Comment("我的银行卡")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "host")
    public List<BankCard> bankCards;

    @Comment("我的租客")
    @ManyToMany(targetEntity = models.Guest.class)
    public List<Guest> guests;

    @Comment("所属运营商ID")
    public Long refPartnerId;

    @Comment("所属运营商")
    @JsonIgnore
    @ManyToOne
    public Partner partner;

    public Host() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, Host> find = new Finder(Long.class, Host.class);

    @Override
    public String toString() {
        return "房东 [name:" + name + "]";
    }
}
