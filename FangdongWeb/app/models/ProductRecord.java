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

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "product_record")
@TableComment("金融产品购买记录")
public class ProductRecord extends Model implements IConst {

    @Id
    public Long id;

    @Comment("购买编号")
    @SearchField
    public String name;

    @Comment("购入日期")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    public Date inDate;

    @Comment("到期日期")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    public Date outDate;

    @Comment("还款日期")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    public Date fundBackDate;

    @Comment("贷款金额")
    public long amount;

    @Comment("状态")
    @EnumMap(value = "0,1,2,3,4", name = "审核中,正常,已还款,超期,已删除")
    public int status = 1; // test using

    @Comment("创建日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date createdAt; // 创建日期

    @Comment("修改时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date lastUpdateTime;

    @Comment("备注")
    public String comment;

    @Comment("所属房东ID")
    public Long refHostId;

    @Comment("所属房东")
    @JsonIgnore
    @ManyToOne
    public Host host;

    @Comment("所买产品ID")
    public Long refProductId;

    @Comment("所买产品")
    @ManyToOne
    public Product product;

    public ProductRecord() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, ProductRecord> find = new Finder(Long.class, ProductRecord.class);

    @Override
    public String toString() {
        return "金融产品购买记录 [name:" + name + "]";
    }
}