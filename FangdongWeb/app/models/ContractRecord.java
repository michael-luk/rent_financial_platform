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
@Table(name = "contract_record")
@TableComment("电子合约签约记录")
public class ContractRecord extends Model implements IConst {

    @Id
    public Long id;

    @Comment("标题")
    @SearchField
    public String name;

    @Comment("状态")
    @EnumMap(value = "0,1,2", name = "签订中,签订失败,已签约")
    public int status = 2; // test using

    @Comment("签约日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date contractTime;

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

    @Comment("签约产品ID")
    public Long refProductId;

    @Comment("签约产品")
    @ManyToOne
    public Product product;

    public ContractRecord() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, ContractRecord> find = new Finder(Long.class, ContractRecord.class);

    @Override
    public String toString() {
        return "电子合约签约记录 [name:" + name + "]";
    }
}