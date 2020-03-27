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
@Table(name = "credit_record")
@TableComment("额度记录")
public class CreditRecord extends Model implements IConst {

    @Id
    public Long id;

    @Comment("标题")
    @SearchField
    public String name;

    @Comment("额度变动")
    public long creditRaise;

    @Comment("状态")
    @EnumMap(value = "0,1", name = "正常,删除")
    public int status; // test using

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

    public CreditRecord() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, CreditRecord> find = new Finder(Long.class, CreditRecord.class);

    @Override
    public String toString() {
        return "额度记录 [name:" + name + "]";
    }
}