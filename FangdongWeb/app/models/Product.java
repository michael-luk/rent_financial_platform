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
@Table(name = "product")
@TableComment("金融产品")
public class Product extends Model implements IConst {

    @Id
    public Long id;

    @Comment("名称")
    @NotNull
    @SearchField
    public String name;

    @Comment("顺序")
    public int indexNum;

    @Comment("推荐产品")
    public boolean promote;

    @Comment("产品周期(月)")
    public int length;

    @Comment("要求额度")
    public long requireCredit;

    @Comment("最小贷款金额")
    public long minInvestAmount;

    @Comment("最大贷款金额")
    public long maxInvestAmount;

    @Comment("利息")
    @Column(columnDefinition = "Decimal(8,6)")
    public double interest = 0.0005;

    @Comment("可见")
    public boolean visible = true; // test using

    @Comment("状态")
    @EnumMap(value = "0,1,2", name = "正常,下架,删除")
    public int status; // test using

    @Comment("图片")
    @Lob
    public String images; // 图片(多个图片逗号分隔)

    @Comment("详情图")
    @Lob
    public String smallImages; // 小图片

    @Comment("创建日期")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date createdAt; // 创建日期

    @Comment("修改时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date lastUpdateTime;

    @Lob
    @Comment("产品描述")
    public String description;

    @Lob
    @Comment("附加描述")
    public String description2;

    @Comment("备注")
    public String comment;

    @Comment("金融产品卖出记录")
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product")
    public List<ProductRecord> productRecords;

    @Comment("金融产品还款记录")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product")
    public List<FundBackRecord> fundBackRecords;

    // 电子合约
    @Comment("电子合约标题")
    public String contractTitle;

    @Lob
    @Comment("电子合约正文")
    public String contractContent;

    @Comment("电子合约签约记录")
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product")
    public List<ContractRecord> contractRecords;


    public Product() {
        createdAt = new Date();
    }

    public void save() {
        lastUpdateTime = new Date();
        Ebean.save(this);
    }

    public static Finder<Long, Product> find = new Finder(Long.class, Product.class);

    @Override
    public String toString() {
        return "金融产品 [name:" + name + "]";
    }
}