package models;

import LyLib.Interfaces.IConst;
import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.annotation.JsonFormat;
import play.db.ebean.Model;
import util.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "user")
@TableComment("用户")
@OnlyAdminGet
public class User extends Model implements IConst {

    @Id
    public Long id;

    @Comment("昵称")
    public String name;

    @NotNull
    @SearchField
    @Comment("登录名")
    public String loginName;

    @Comment("email")
    public String email;        //用于找回密码, 如果loginName约定是email, 则此字段可以不要

    @Comment("email已验证")
    public boolean isEmailVerified;

    @Comment("email临时key")
    public String emailKey;     //找回密码, 或验证邮箱时暂存的key

    @Comment("email超时")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date emailOverTime;  //找回密码, 或验证邮箱时暂存的过期时间

    @Comment("修改时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date lastUpdateTime;

    @NotNull
    @Comment("密码")
    public String password;

    @Comment("创建时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date createdAt;

    @Comment("最后登录IP")
    public String lastLoginIp;// 最后一次登录的IP(只是管理员登录才会记录)

    @Comment("最后登录时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date lastLoginTime;

    @Comment("最后登录IP区域")
    public String lastLoginIpArea; // IP所在区域

    @Comment("状态")
    @EnumMap(value = "0,1", name = "正常,冻结")
    public int status = 0;     // 0-正常, 1-冻结

    @Comment("等级")
    @EnumMap(value = "0,1", name = "普通用户,高级用户")
    public int userRoleEnum = 1; // 状态: 0普通用户, 1管理员, 2超级管理员

    @Lob
    @Comment("备注")
    public String comment;

    public User() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, User> find = new Finder(Long.class, User.class);

    @Override
    public String toString() {
        return "user [name:" + name + "]";
    }
}
