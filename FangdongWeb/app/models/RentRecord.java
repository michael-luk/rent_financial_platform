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
import java.util.Date;

@Entity
@Table(name = "rent_record")
@TableComment("租金记录")
public class RentRecord extends Model implements IConst {

    @Id
    public Long id;

    @SearchField
    @Comment("标题")
    public String name;

    @Comment("金额")
    public int rent;

    @Comment("创建时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date createdAt;

    @Comment("修改时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date lastUpdateTime;

    @Comment("状态")
    @EnumMap(value = "0,1", name = "正常,隐藏")
    public int status = 0;

    @Comment("交租日期")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    public Date payDate;

    @Comment("备注")
    public String comment;

    @Comment("所属房东ID")
    public Long refHostId;

    @Comment("所属房东")
    @JsonIgnore
    @ManyToOne
    public Host host;

    @Comment("所属租客ID")
    public Long refGuestId;

    @Comment("所属租客")
    @JsonIgnore
    @ManyToOne
    public Guest guest;

    public RentRecord() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, RentRecord> find = new Finder(Long.class, RentRecord.class);

    @Override
    public String toString() {
        return "租金记录 [name:" + name + "]";
    }
}
