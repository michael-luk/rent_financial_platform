package models;

import LyLib.Interfaces.IConst;
import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.annotation.JsonFormat;
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
@Table(name = "partner")
@TableComment("还款人")
public class Partner extends Model implements IConst {

    @Id
    public Long id;

    @NotNull
    @SearchField
    @Comment("名称")
    public String name;

    @Comment("地区")
    public String area;

    @Comment("电话")
    public String phone;

    @Comment("地址")
    public String address;

    @Comment("密码")
    public String password;

    @Comment("创建时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date createdAt;

    @Comment("修改时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date lastUpdateTime;

    @Comment("图片")
    @Lob
    public String images; // 图片(多个图片逗号分隔)

    @Comment("状态")
    @EnumMap(value = "0,1", name = "正常,已删除")
    public int status;

    @Comment("我的额度")
    public long credit;

    @Comment("等级")
    @EnumMap(value = "0,1", name = "普通运营商,高级运营商")
    public int levelEnum;

    @Lob
    @Comment("邀请码")
    public String comment;

    @Comment("我的房源")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "partner")
    public List<House> houses;

    @Comment("签约房东")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "partner")
    public List<Host> hosts;

    public Partner() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, Partner> find = new Finder(Long.class, Partner.class);

    @Override
    public String toString() {
        return "运营商 [name:" + name + "]";
    }
}
