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
@Table(name = "rent_contract")
@TableComment("租赁合同")
public class RentContract extends Model implements IConst {

    @Id
    public Long id;

    @Comment("合同名称")
    @NotNull
    @SearchField
    public String name;

    @Comment("房租金额")
    public int rent;

    @Comment("合同图片")
    @Lob
    public String images;

    @Comment("状态")
    @EnumMap(value = "0,1,2,3,4", name = "申请中,已签约,已到期,已冻结,已删除")
    public int status = 1;

    @Comment("每月交租日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date rentPayTime;

    @Comment("创建日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date createdAt;

    @Comment("合同到期日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date contractEndTime;

    @Comment("修改时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date lastUpdateTime;

    @Comment("备注")
    public String comment;

    @Comment("所属房源ID")
    public Long refHouseId;

    @Comment("所属房源")
    @JsonIgnore
    @ManyToOne
    public House house;


    public RentContract() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, RentContract> find = new Finder(Long.class, RentContract.class);

    @Override
    public String toString() {
        return "租赁合同 [name:" + name + "]";
    }
}