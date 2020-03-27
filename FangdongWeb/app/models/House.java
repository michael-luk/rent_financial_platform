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
@Table(name = "house")
@TableComment("房源")
public class House extends Model implements IConst {

    @Id
    public Long id;

    @Comment("小区/门牌")
    @NotNull
    @SearchField
    public String name;

    @Comment("分类")
    public String classify;// 分类

    @Comment("省")
    public String province;

    @Comment("市")
    public String city;

    @Comment("县/区")
    public String zone;

    @Comment("地址")
    public String address;

    @Comment("房龄")
    public int age;

    @Comment("面积")
    public String size;

    @Comment("房型")
    public String structure;

    @Comment("租金")
    public int rent;

    @Comment("可增额度")
    public int credit;

    @Comment("可见")
    public boolean visible = true;

    @Comment("状态")
    @EnumMap(value = "0,1,2", name = "审核中,已拒审,已审核")
    public int status = 2;

    @Comment("图片")
    @Lob
    public String images; // 图片(多个图片逗号分隔)

    @Comment("创建日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date createdAt; // 创建日期

    @Comment("修改时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date lastUpdateTime;

    @Lob
    @Comment("描述")
    public String description;

    @Comment("备注")
    public String comment;

    @Comment("所属房东ID")
    public Long refHostId;

    @Comment("所属房东")
    @ManyToOne
    public Host host;

    @Comment("所属运营商ID")
    public Long refPartnerId;

    @Comment("所属运营商")
    @JsonIgnore
    @ManyToOne
    public Partner partner;

    @Comment("使用路由器")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "house")
    public List<Router> routers;

    @Comment("租赁合同")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "house")
    public List<RentContract> rentContracts;

    public House() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, House> find = new Finder(Long.class, House.class);

    @Override
    public String toString() {
        return "房源 [name:" + name + "]";
    }
}