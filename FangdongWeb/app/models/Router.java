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
@Table(name = "router")
@TableComment("路由器")
public class Router extends Model implements IConst {

    @Id
    public Long id;

    @Comment("MAC地址")
    @NotNull
    @SearchField
    public String name;

    @Comment("APPID")
    public String appId;// 分类

    @Comment("密钥")
    public String secret;

    @Comment("小极账号绑定手机")
    public String bindPhone;

    @Comment("状态")
    @EnumMap(value = "0,1,2", name = "使用中,已停用,已删除")
    public int status;

    @Comment("创建日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date createdAt; // 创建日期

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

    public Router() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, Router> find = new Finder(Long.class, Router.class);

    @Override
    public String toString() {
        return "房源 [name:" + name + "]";
    }
}