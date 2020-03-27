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

@Entity
@Table(name = "bank_card")
@TableComment("银行卡")
public class BankCard extends Model implements IConst {

    @Id
    public Long id;

    @Comment("卡号")
    @NotNull
    @SearchField
    public String name;

    @Comment("银行")
    public String bank;

    @Comment("银行卡图片")
    @Lob
    public String images;

    @Comment("状态")
    @EnumMap(value = "0,1,2,3", name = "待审核,不通过,已删除,已审核")
    public int status = 3;

    @Comment("创建日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date createdAt;

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

    public BankCard() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, BankCard> find = new Finder(Long.class, BankCard.class);

    @Override
    public String toString() {
        return "银行卡 [name:" + name + "]";
    }
}