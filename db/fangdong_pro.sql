# Host: localhost  (Version: 5.1.62-community)
# Date: 2020-03-27 16:43:07
# Generator: MySQL-Front 5.3  (Build 4.120)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "admin"
#

DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `descriptions` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_login_ip` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_login_time` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `last_login_ip_area` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `user_role_enum` int(11) DEFAULT NULL,
  `comment` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "admin"
#

INSERT INTO `admin` VALUES (1,'admin_1','e10adc3949ba59abbe56e057f20f883e','0','2020-03-27 16:39:26','0',NULL,NULL,'0',0,0,'0'),(2,'admin_2','e10adc3949ba59abbe56e057f20f883e','1','2020-03-27 16:39:26','1',NULL,NULL,'1',0,1,'1'),(3,'admin_3','e10adc3949ba59abbe56e057f20f883e','2','2020-03-27 16:39:26','2',NULL,NULL,'2',0,2,'2');

#
# Structure for table "admin_journal"
#

DROP TABLE IF EXISTS `admin_journal`;
CREATE TABLE `admin_journal` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `actor` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `actor_level` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "admin_journal"
#


#
# Structure for table "config"
#

DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `content` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type_enum` int(11) NOT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "config"
#

INSERT INTO `config` VALUES (1,'is.prod','no',3,NULL,'2020-03-27 16:39:26','是否生产模式(yes/no)'),(2,'admin.login','yes',3,NULL,'2020-03-27 16:39:26','是否启用管理员权限(yes/no), 若不启用则后台不需要管理员登陆'),(3,'websocket','no',3,NULL,'2020-03-27 16:39:26','是否启用即时通讯'),(4,'app.name','租金所',0,NULL,'2020-03-27 16:39:26','网站名称'),(5,'sms.server','sms.todaynic.com',0,NULL,'2020-03-27 16:39:26','第三方短信验证码服务器'),(6,'sms.port','20002',0,NULL,'2020-03-27 16:39:26','第三方短信验证码端口'),(7,'sms.uid','ms1614',0,NULL,'2020-03-27 16:39:26','第三方短信验证码用户名'),(8,'sms.psw','mtod',0,NULL,'2020-03-27 16:39:26','第三方短信验证码密码'),(9,'weixin.appid','wx72a592fac58f16',0,NULL,'2020-03-27 16:39:26','微信公众号appid'),(10,'weixin.secret','c4769db99d42940c18bb63e498652e',0,NULL,'2020-03-27 16:39:26','微信公众号secret'),(11,'weixin.token','fangdgle',0,NULL,'2020-03-27 16:39:26','微信公众号token'),(12,'weixin.aes','YgVEG3AfIcq0ydGB5zgAtSwpF6XWZ7eaQhV1FXmz8',0,NULL,'2020-03-27 16:39:26','微信公众号aes'),(13,'protocol','http',0,NULL,'2020-03-27 16:39:26','协议(http或https)'),(14,'domain.name','fangdl.woyik.com',0,NULL,'2020-03-27 16:39:26','域名 (若本地则localhost:9000, 带端口号), 不带http头'),(15,'company.name','珠海横琴金融服务有限公司',0,NULL,'2020-03-27 16:39:26','公司名称'),(16,'user.timeout.minute','30',1,NULL,'2020-03-27 16:39:26','用户登陆过期时间(分钟), 超过此时间需重新登陆'),(17,'admin.timeout.minute','30',1,NULL,'2020-03-27 16:39:26','管理员登陆过期时间(分钟), 超过此时间需重新登陆'),(18,'forget.password.email.timeout.minute','30',1,NULL,'2020-03-27 16:39:26','重置密码邮件验证的过期时间(分钟), 超过此时间需要重新申请'),(19,'email.send.protect.second','20',1,NULL,'2020-03-27 16:39:26','邮件发送频率保护时间(秒)'),(20,'dbbak.receive.email','db_bak@126.com',0,NULL,'2020-03-27 16:39:26','接收数据库备份文件的邮箱地址'),(21,'smtp.host','smtp.126.com',0,NULL,'2020-03-27 16:39:26','发件邮箱SMTP地址, 如smtp.126.com'),(22,'smtp.user','db_bak@126.com',0,NULL,'2020-03-27 16:39:26','发件邮箱用户名'),(23,'smtp.password','emuml7080',0,NULL,'2020-03-27 16:39:26','发件邮箱密码'),(24,'pic.thumb.size','200',2,NULL,'2020-03-27 16:39:26','图片缩略图尺寸(如200)'),(25,'pic.mid.thumb.size','500',2,NULL,'2020-03-27 16:39:26','图片中等缩略图尺寸(如500)');

#
# Structure for table "guest"
#

DROP TABLE IF EXISTS `guest`;
CREATE TABLE `guest` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `login_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `wx_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sex_enum` int(11) DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `card_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `birth` datetime DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `user_role_enum` int(11) DEFAULT NULL,
  `images` longtext COLLATE utf8_unicode_ci,
  `house_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `building` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `unit` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `room` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `total_amount` int(11) DEFAULT NULL,
  `contract_length` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contract_start_date` datetime DEFAULT NULL,
  `contract_end_date` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `comment` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "guest"
#

INSERT INTO `guest` VALUES (1,'guest_1','0','0',0,'0','0','0','0',NULL,'e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:26',0,0,'0','0','0','0','0',0,0,'0',NULL,NULL,NULL,'0'),(2,'guest_2','1','1',1,'1','1','1','1',NULL,'e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:26',1,1,'1','1','1','1','1',1,1,'1',NULL,NULL,NULL,'1'),(3,'guest_3','2','2',2,'2','2','2','2',NULL,'e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:26',2,2,'2','2','2','2','2',2,2,'2',NULL,NULL,NULL,'2');

#
# Structure for table "info"
#

DROP TABLE IF EXISTS `info`;
CREATE TABLE `info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `classify` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `english_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `visible` tinyint(1) DEFAULT '0',
  `status` int(11) DEFAULT NULL,
  `images` longtext COLLATE utf8_unicode_ci,
  `small_images` longtext COLLATE utf8_unicode_ci,
  `last_update_time` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `description1` longtext COLLATE utf8_unicode_ci,
  `description2` longtext COLLATE utf8_unicode_ci,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "info"
#

INSERT INTO `info` VALUES (1,'info_1','0','0','0','0',1,0,'0','0',NULL,'2020-03-27 16:39:26','0','0','0'),(2,'info_2','1','1','1','1',0,1,'1','1',NULL,'2020-03-27 16:39:26','1','1','1'),(3,'info_3','2','2','2','2',1,2,'2','2',NULL,'2020-03-27 16:39:26','2','2','2');

#
# Structure for table "partner"
#

DROP TABLE IF EXISTS `partner`;
CREATE TABLE `partner` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `area` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `images` longtext COLLATE utf8_unicode_ci,
  `status` int(11) DEFAULT NULL,
  `credit` bigint(20) DEFAULT NULL,
  `level_enum` int(11) DEFAULT NULL,
  `comment` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "partner"
#

INSERT INTO `partner` VALUES (1,'partner_1','0','0','0','e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:26',NULL,'0',0,0,0,'0'),(2,'partner_2','1','1','1','e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:26',NULL,'1',1,100,1,'1'),(3,'partner_3','2','2','2','e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:26',NULL,'2',2,200,2,'2');

#
# Structure for table "host"
#

DROP TABLE IF EXISTS `host`;
CREATE TABLE `host` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `login_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `wx_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sex_enum` int(11) DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `card_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `birth` datetime DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `head_images` longtext COLLATE utf8_unicode_ci,
  `images` longtext COLLATE utf8_unicode_ci,
  `last_login_ip` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_login_time` datetime DEFAULT NULL,
  `last_login_ip_area` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `credit` bigint(20) DEFAULT NULL,
  `user_role_enum` int(11) DEFAULT NULL,
  `comment` longtext COLLATE utf8_unicode_ci,
  `ref_partner_id` bigint(20) DEFAULT NULL,
  `partner_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_host_partner_7` (`partner_id`),
  CONSTRAINT `fk_host_partner_7` FOREIGN KEY (`partner_id`) REFERENCES `partner` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "host"
#

INSERT INTO `host` VALUES (1,'host_1','0','0',0,'0','0','0','0',NULL,'e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:26',NULL,'0','0','0',NULL,'0',0,0,0,'0',NULL,NULL),(2,'host_2','1','1',1,'1','1','1','1',NULL,'e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:26',NULL,'1','1','1',NULL,'1',1,100,1,'1',NULL,NULL),(3,'host_3','2','2',2,'2','2','2','2',NULL,'e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:26',NULL,'2','2','2',NULL,'2',2,200,2,'2',NULL,NULL);

#
# Structure for table "house"
#

DROP TABLE IF EXISTS `house`;
CREATE TABLE `house` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `classify` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `province` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `zone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `size` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `structure` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `rent` int(11) DEFAULT NULL,
  `credit` int(11) DEFAULT NULL,
  `visible` tinyint(1) DEFAULT '0',
  `status` int(11) DEFAULT NULL,
  `images` longtext COLLATE utf8_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `description` longtext COLLATE utf8_unicode_ci,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ref_host_id` bigint(20) DEFAULT NULL,
  `host_id` bigint(20) DEFAULT NULL,
  `ref_partner_id` bigint(20) DEFAULT NULL,
  `partner_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_house_host_8` (`host_id`),
  KEY `ix_house_partner_9` (`partner_id`),
  CONSTRAINT `fk_house_host_8` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`),
  CONSTRAINT `fk_house_partner_9` FOREIGN KEY (`partner_id`) REFERENCES `partner` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "house"
#

INSERT INTO `house` VALUES (1,'house_1','0','0','0','0','0',0,'0','0',0,0,1,0,'0','2020-03-27 16:39:26',NULL,'0','0',NULL,NULL,NULL,NULL),(2,'house_2','1','1','1','1','1',1,'1','1',1,1,0,1,'1','2020-03-27 16:39:26',NULL,'1','1',NULL,NULL,NULL,NULL),(3,'house_3','2','2','2','2','2',2,'2','2',2,2,1,2,'2','2020-03-27 16:39:26',NULL,'2','2',NULL,NULL,NULL,NULL);

#
# Structure for table "host_guest"
#

DROP TABLE IF EXISTS `host_guest`;
CREATE TABLE `host_guest` (
  `host_id` bigint(20) NOT NULL,
  `guest_id` bigint(20) NOT NULL,
  PRIMARY KEY (`host_id`,`guest_id`),
  KEY `fk_host_guest_guest_02` (`guest_id`),
  CONSTRAINT `fk_host_guest_guest_02` FOREIGN KEY (`guest_id`) REFERENCES `guest` (`id`),
  CONSTRAINT `fk_host_guest_host_01` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "host_guest"
#


#
# Structure for table "bank_card"
#

DROP TABLE IF EXISTS `bank_card`;
CREATE TABLE `bank_card` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `bank` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `images` longtext COLLATE utf8_unicode_ci,
  `status` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ref_host_id` bigint(20) DEFAULT NULL,
  `host_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_bank_card_host_1` (`host_id`),
  CONSTRAINT `fk_bank_card_host_1` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "bank_card"
#

INSERT INTO `bank_card` VALUES (1,'bankCard_1','0','0',0,'2020-03-27 16:39:26',NULL,'0',NULL,NULL),(2,'bankCard_2','1','1',1,'2020-03-27 16:39:26',NULL,'1',NULL,NULL),(3,'bankCard_3','2','2',2,'2020-03-27 16:39:26',NULL,'2',NULL,NULL);

#
# Structure for table "credit_record"
#

DROP TABLE IF EXISTS `credit_record`;
CREATE TABLE `credit_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `credit_raise` bigint(20) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ref_host_id` bigint(20) DEFAULT NULL,
  `host_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_credit_record_host_4` (`host_id`),
  CONSTRAINT `fk_credit_record_host_4` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "credit_record"
#

INSERT INTO `credit_record` VALUES (1,'creditRecord_1',0,0,'2020-03-27 16:39:26',NULL,'0',NULL,NULL),(2,'creditRecord_2',100,1,'2020-03-27 16:39:26',NULL,'1',NULL,NULL),(3,'creditRecord_3',200,2,'2020-03-27 16:39:26',NULL,'2',NULL,NULL);

#
# Structure for table "guest_host"
#

DROP TABLE IF EXISTS `guest_host`;
CREATE TABLE `guest_host` (
  `guest_id` bigint(20) NOT NULL,
  `host_id` bigint(20) NOT NULL,
  PRIMARY KEY (`guest_id`,`host_id`),
  KEY `fk_guest_host_host_02` (`host_id`),
  CONSTRAINT `fk_guest_host_host_02` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`),
  CONSTRAINT `fk_guest_host_guest_01` FOREIGN KEY (`guest_id`) REFERENCES `guest` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "guest_host"
#


#
# Structure for table "play_evolutions"
#

DROP TABLE IF EXISTS `play_evolutions`;
CREATE TABLE `play_evolutions` (
  `id` int(11) NOT NULL,
  `hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `apply_script` text COLLATE utf8_unicode_ci,
  `revert_script` text COLLATE utf8_unicode_ci,
  `state` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_problem` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "play_evolutions"
#

INSERT INTO `play_evolutions` VALUES (1,'c281c5f431f7842500e368dea34de4dc1aa0839f','2020-03-27 16:39:25','create table admin (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\npassword                  varchar(255) not null,\ndescriptions              varchar(255),\ncreated_at                datetime,\nlast_login_ip             varchar(255),\nlast_login_time           datetime,\nlast_update_time          datetime,\nlast_login_ip_area        varchar(255),\nstatus                    integer,\nuser_role_enum            integer,\ncomment                   longtext,\nconstraint pk_admin primary key (id))\n;\n\ncreate table admin_journal (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\nactor                     varchar(255),\nactor_level               varchar(255),\ncreated_at                datetime,\nconstraint pk_admin_journal primary key (id))\n;\n\ncreate table bank_card (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\nbank                      varchar(255),\nimages                    longtext,\nstatus                    integer,\ncreated_at                datetime,\nlast_update_time          datetime,\ncomment                   varchar(255),\nref_host_id               bigint,\nhost_id                   bigint,\nconstraint pk_bank_card primary key (id))\n;\n\ncreate table config (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\ncontent                   varchar(255) not null,\ntype_enum                 integer not null,\nlast_update_time          datetime,\ncreated_at                datetime,\ncomment                   varchar(255),\nconstraint pk_config primary key (id))\n;\n\ncreate table contract_record (\nid                        bigint auto_increment not null,\nname                      varchar(255),\nstatus                    integer,\ncontract_time             datetime,\ncreated_at                datetime,\nlast_update_time          datetime,\ncomment                   varchar(255),\nref_host_id               bigint,\nhost_id                   bigint,\nref_product_id            bigint,\nproduct_id                bigint,\nconstraint pk_contract_record primary key (id))\n;\n\ncreate table credit_record (\nid                        bigint auto_increment not null,\nname                      varchar(255),\ncredit_raise              bigint,\nstatus                    integer,\ncreated_at                datetime,\nlast_update_time          datetime,\ncomment                   varchar(255),\nref_host_id               bigint,\nhost_id                   bigint,\nconstraint pk_credit_record primary key (id))\n;\n\ncreate table fund_back_record (\nid                        bigint auto_increment not null,\nname                      varchar(255),\namount                    bigint,\nstatus                    integer,\ncreated_at                datetime,\nlast_update_time          datetime,\ncomment                   varchar(255),\nref_host_id               bigint,\nhost_id                   bigint,\nref_product_id            bigint,\nproduct_id                bigint,\nconstraint pk_fund_back_record primary key (id))\n;\n\ncreate table guest (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\nlogin_name                varchar(255),\nwx_id                     varchar(255),\nsex_enum                  integer,\nphone                     varchar(255),\ncard_number               varchar(255),\nemail                     varchar(255),\naddress                   varchar(255),\nbirth                     datetime,\npassword                  varchar(255),\ncreated_at                datetime,\nstatus                    integer,\nuser_role_enum            integer,\nimages                    longtext,\nhouse_name                varchar(255),\nbuilding                  varchar(255),\nunit                      varchar(255),\nroom                      varchar(255),\namount                    integer,\ntotal_amount              integer,\ncontract_length           varchar(255),\ncontract_start_date       datetime,\ncontract_end_date         datetime,\nlast_update_time          datetime,\ncomment                   longtext,\nconstraint pk_guest primary key (id))\n;\n\ncreate table host (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\nlogin_name                varchar(255),\nwx_id                     varchar(255),\nsex_enum                  integer,\nphone                     varchar(255),\ncard_number               varchar(255),\nemail                     varchar(255),\naddress                   varchar(255),\nbirth                     datetime,\npassword                  varchar(255),\ncreated_at                datetime,\nlast_update_time          datetime,\nhead_images               longtext,\nimages                    longtext,\nlast_login_ip             varchar(255),\nlast_login_time           datetime,\nlast_login_ip_area        varchar(255),\nstatus                    integer,\ncredit                    bigint,\nuser_role_enum            integer,\ncomment                   longtext,\nref_partner_id            bigint,\npartner_id                bigint,\nconstraint pk_host primary key (id))\n;\n\ncreate table house (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\nclassify                  varchar(255),\nprovince                  varchar(255),\ncity                      varchar(255),\nzone                      varchar(255),\naddress                   varchar(255),\nage                       integer,\nsize                      varchar(255),\nstructure                 varchar(255),\nrent                      integer,\ncredit                    integer,\nvisible                   tinyint(1) default 0,\nstatus                    integer,\nimages                    longtext,\ncreated_at                datetime,\nlast_update_time          datetime,\ndescription               longtext,\ncomment                   varchar(255),\nref_host_id               bigint,\nhost_id                   bigint,\nref_partner_id            bigint,\npartner_id                bigint,\nconstraint pk_house primary key (id))\n;\n\ncreate table info (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\nclassify                  varchar(255),\nenglish_name              varchar(255),\nphone                     varchar(255),\nurl                       varchar(255),\nvisible                   tinyint(1) default 0,\nstatus                    integer,\nimages                    longtext,\nsmall_images              longtext,\nlast_update_time          datetime,\ncreated_at                datetime,\ndescription1              longtext,\ndescription2              longtext,\ncomment                   varchar(255),\nconstraint pk_info primary key (id))\n;\n\ncreate table partner (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\narea                      varchar(255),\nphone                     varchar(255),\naddress                   varchar(255),\npassword                  varchar(255),\ncreated_at                datetime,\nlast_update_time          datetime,\nimages                    longtext,\nstatus                    integer,\ncredit                    bigint,\nlevel_enum                integer,\ncomment                   longtext,\nconstraint pk_partner primary key (id))\n;\n\ncreate table product (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\nindex_num                 integer,\npromote                   tinyint(1) default 0,\nlength                    integer,\nrequire_credit            bigint,\nmin_invest_amount         bigint,\nmax_invest_amount         bigint,\ninterest                  Decimal(8,6),\nvisible                   tinyint(1) default 0,\nstatus                    integer,\nimages                    longtext,\nsmall_images              longtext,\ncreated_at                datetime,\nlast_update_time          datetime,\ndescription               longtext,\ndescription2              longtext,\ncomment                   varchar(255),\ncontract_title            varchar(255),\ncontract_content          longtext,\nconstraint pk_product primary key (id))\n;\n\ncreate table product_record (\nid                        bigint auto_increment not null,\nname                      varchar(255),\nin_date                   datetime,\nout_date                  datetime,\nfund_back_date            datetime,\namount                    bigint,\nstatus                    integer,\ncreated_at                datetime,\nlast_update_time          datetime,\ncomment                   varchar(255),\nref_host_id               bigint,\nhost_id                   bigint,\nref_product_id            bigint,\nproduct_id                bigint,\nconstraint pk_product_record primary key (id))\n;\n\ncreate table rent_contract (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\nrent                      integer,\nimages                    longtext,\nstatus                    integer,\nrent_pay_time             datetime,\ncreated_at                datetime,\ncontract_end_time         datetime,\nlast_update_time          datetime,\ncomment                   varchar(255),\nref_house_id              bigint,\nhouse_id                  bigint,\nconstraint pk_rent_contract primary key (id))\n;\n\ncreate table rent_record (\nid                        bigint auto_increment not null,\nname                      varchar(255),\nrent                      integer,\ncreated_at                datetime,\nlast_update_time          datetime,\nstatus                    integer,\npay_date                  datetime,\ncomment                   varchar(255),\nref_host_id               bigint,\nhost_id                   bigint,\nref_guest_id              bigint,\nguest_id                  bigint,\nconstraint pk_rent_record primary key (id))\n;\n\ncreate table router (\nid                        bigint auto_increment not null,\nname                      varchar(255) not null,\napp_id                    varchar(255),\nsecret                    varchar(255),\nbind_phone                varchar(255),\nstatus                    integer,\ncreated_at                datetime,\nlast_update_time          datetime,\ncomment                   varchar(255),\nref_house_id              bigint,\nhouse_id                  bigint,\nconstraint pk_router primary key (id))\n;\n\ncreate table sms_info (\nid                        bigint auto_increment not null,\nname                      varchar(255),\nphone                     varchar(255),\ncheck_code                varchar(255),\nsend_xml                  longtext,\nreturn_table              varchar(255),\nreceive_xml               longtext,\ncode                      varchar(255),\nreturn_msg                varchar(255),\ncreated_at                datetime,\nlast_update_time          datetime,\ncomment                   varchar(255),\nconstraint pk_sms_info primary key (id))\n;\n\ncreate table user (\nid                        bigint auto_increment not null,\nname                      varchar(255),\nlogin_name                varchar(255) not null,\nemail                     varchar(255),\nis_email_verified         tinyint(1) default 0,\nemail_key                 varchar(255),\nemail_over_time           datetime,\nlast_update_time          datetime,\npassword                  varchar(255) not null,\ncreated_at                datetime,\nlast_login_ip             varchar(255),\nlast_login_time           datetime,\nlast_login_ip_area        varchar(255),\nstatus                    integer,\nuser_role_enum            integer,\ncomment                   longtext,\nconstraint pk_user primary key (id))\n;\n\n\ncreate table guest_host (\nguest_id                       bigint not null,\nhost_id                        bigint not null,\nconstraint pk_guest_host primary key (guest_id, host_id))\n;\n\ncreate table host_guest (\nhost_id                        bigint not null,\nguest_id                       bigint not null,\nconstraint pk_host_guest primary key (host_id, guest_id))\n;\nalter table bank_card add constraint fk_bank_card_host_1 foreign key (host_id) references host (id) on delete restrict on update restrict;\ncreate index ix_bank_card_host_1 on bank_card (host_id);\nalter table contract_record add constraint fk_contract_record_host_2 foreign key (host_id) references host (id) on delete restrict on update restrict;\ncreate index ix_contract_record_host_2 on contract_record (host_id);\nalter table contract_record add constraint fk_contract_record_product_3 foreign key (product_id) references product (id) on delete restrict on update restrict;\ncreate index ix_contract_record_product_3 on contract_record (product_id);\nalter table credit_record add constraint fk_credit_record_host_4 foreign key (host_id) references host (id) on delete restrict on update restrict;\ncreate index ix_credit_record_host_4 on credit_record (host_id);\nalter table fund_back_record add constraint fk_fund_back_record_host_5 foreign key (host_id) references host (id) on delete restrict on update restrict;\ncreate index ix_fund_back_record_host_5 on fund_back_record (host_id);\nalter table fund_back_record add constraint fk_fund_back_record_product_6 foreign key (product_id) references product (id) on delete restrict on update restrict;\ncreate index ix_fund_back_record_product_6 on fund_back_record (product_id);\nalter table host add constraint fk_host_partner_7 foreign key (partner_id) references partner (id) on delete restrict on update restrict;\ncreate index ix_host_partner_7 on host (partner_id);\nalter table house add constraint fk_house_host_8 foreign key (host_id) references host (id) on delete restrict on update restrict;\ncreate index ix_house_host_8 on house (host_id);\nalter table house add constraint fk_house_partner_9 foreign key (partner_id) references partner (id) on delete restrict on update restrict;\ncreate index ix_house_partner_9 on house (partner_id);\nalter table product_record add constraint fk_product_record_host_10 foreign key (host_id) references host (id) on delete restrict on update restrict;\ncreate index ix_product_record_host_10 on product_record (host_id);\nalter table product_record add constraint fk_product_record_product_11 foreign key (product_id) references product (id) on delete restrict on update restrict;\ncreate index ix_product_record_product_11 on product_record (product_id);\nalter table rent_contract add constraint fk_rent_contract_house_12 foreign key (house_id) references house (id) on delete restrict on update restrict;\ncreate index ix_rent_contract_house_12 on rent_contract (house_id);\nalter table rent_record add constraint fk_rent_record_host_13 foreign key (host_id) references host (id) on delete restrict on update restrict;\ncreate index ix_rent_record_host_13 on rent_record (host_id);\nalter table rent_record add constraint fk_rent_record_guest_14 foreign key (guest_id) references guest (id) on delete restrict on update restrict;\ncreate index ix_rent_record_guest_14 on rent_record (guest_id);\nalter table router add constraint fk_router_house_15 foreign key (house_id) references house (id) on delete restrict on update restrict;\ncreate index ix_router_house_15 on router (house_id);\n\n\n\nalter table guest_host add constraint fk_guest_host_guest_01 foreign key (guest_id) references guest (id) on delete restrict on update restrict;\n\nalter table guest_host add constraint fk_guest_host_host_02 foreign key (host_id) references host (id) on delete restrict on update restrict;\n\nalter table host_guest add constraint fk_host_guest_host_01 foreign key (host_id) references host (id) on delete restrict on update restrict;\n\nalter table host_guest add constraint fk_host_guest_guest_02 foreign key (guest_id) references guest (id) on delete restrict on update restrict;','SET FOREIGN_KEY_CHECKS=0;\n\ndrop table admin;\n\ndrop table admin_journal;\n\ndrop table bank_card;\n\ndrop table config;\n\ndrop table contract_record;\n\ndrop table credit_record;\n\ndrop table fund_back_record;\n\ndrop table guest;\n\ndrop table guest_host;\n\ndrop table host;\n\ndrop table host_guest;\n\ndrop table house;\n\ndrop table info;\n\ndrop table partner;\n\ndrop table product;\n\ndrop table product_record;\n\ndrop table rent_contract;\n\ndrop table rent_record;\n\ndrop table router;\n\ndrop table sms_info;\n\ndrop table user;\n\nSET FOREIGN_KEY_CHECKS=1;','applied','');

#
# Structure for table "product"
#

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `index_num` int(11) DEFAULT NULL,
  `promote` tinyint(1) DEFAULT '0',
  `length` int(11) DEFAULT NULL,
  `require_credit` bigint(20) DEFAULT NULL,
  `min_invest_amount` bigint(20) DEFAULT NULL,
  `max_invest_amount` bigint(20) DEFAULT NULL,
  `interest` decimal(8,6) DEFAULT NULL,
  `visible` tinyint(1) DEFAULT '0',
  `status` int(11) DEFAULT NULL,
  `images` longtext COLLATE utf8_unicode_ci,
  `small_images` longtext COLLATE utf8_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `description` longtext COLLATE utf8_unicode_ci,
  `description2` longtext COLLATE utf8_unicode_ci,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contract_title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contract_content` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "product"
#

INSERT INTO `product` VALUES (1,'product_1',0,1,0,0,0,0,0.000000,1,0,'0','0','2020-03-27 16:39:26',NULL,'0','0','0','0','0'),(2,'product_2',1,0,1,100,100,100,1.000000,0,1,'1','1','2020-03-27 16:39:26',NULL,'1','1','1','1','1'),(3,'product_3',2,1,2,200,200,200,2.000000,1,2,'2','2','2020-03-27 16:39:26',NULL,'2','2','2','2','2');

#
# Structure for table "fund_back_record"
#

DROP TABLE IF EXISTS `fund_back_record`;
CREATE TABLE `fund_back_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `amount` bigint(20) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ref_host_id` bigint(20) DEFAULT NULL,
  `host_id` bigint(20) DEFAULT NULL,
  `ref_product_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_fund_back_record_host_5` (`host_id`),
  KEY `ix_fund_back_record_product_6` (`product_id`),
  CONSTRAINT `fk_fund_back_record_host_5` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`),
  CONSTRAINT `fk_fund_back_record_product_6` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "fund_back_record"
#

INSERT INTO `fund_back_record` VALUES (1,'fundBackRecord_1',0,0,'2020-03-27 16:39:26',NULL,'0',NULL,NULL,NULL,NULL),(2,'fundBackRecord_2',100,1,'2020-03-27 16:39:26',NULL,'1',NULL,NULL,NULL,NULL),(3,'fundBackRecord_3',200,2,'2020-03-27 16:39:26',NULL,'2',NULL,NULL,NULL,NULL);

#
# Structure for table "contract_record"
#

DROP TABLE IF EXISTS `contract_record`;
CREATE TABLE `contract_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `contract_time` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ref_host_id` bigint(20) DEFAULT NULL,
  `host_id` bigint(20) DEFAULT NULL,
  `ref_product_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_contract_record_host_2` (`host_id`),
  KEY `ix_contract_record_product_3` (`product_id`),
  CONSTRAINT `fk_contract_record_host_2` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`),
  CONSTRAINT `fk_contract_record_product_3` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "contract_record"
#

INSERT INTO `contract_record` VALUES (1,'contractRecord_1',0,NULL,'2020-03-27 16:39:26',NULL,'0',NULL,NULL,NULL,NULL),(2,'contractRecord_2',1,NULL,'2020-03-27 16:39:26',NULL,'1',NULL,NULL,NULL,NULL),(3,'contractRecord_3',2,NULL,'2020-03-27 16:39:26',NULL,'2',NULL,NULL,NULL,NULL);

#
# Structure for table "product_record"
#

DROP TABLE IF EXISTS `product_record`;
CREATE TABLE `product_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `in_date` datetime DEFAULT NULL,
  `out_date` datetime DEFAULT NULL,
  `fund_back_date` datetime DEFAULT NULL,
  `amount` bigint(20) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ref_host_id` bigint(20) DEFAULT NULL,
  `host_id` bigint(20) DEFAULT NULL,
  `ref_product_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_product_record_host_10` (`host_id`),
  KEY `ix_product_record_product_11` (`product_id`),
  CONSTRAINT `fk_product_record_host_10` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`),
  CONSTRAINT `fk_product_record_product_11` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "product_record"
#

INSERT INTO `product_record` VALUES (1,'productRecord_1',NULL,NULL,NULL,0,0,'2020-03-27 16:39:27',NULL,'0',NULL,NULL,NULL,NULL),(2,'productRecord_2',NULL,NULL,NULL,100,1,'2020-03-27 16:39:27',NULL,'1',NULL,NULL,NULL,NULL),(3,'productRecord_3',NULL,NULL,NULL,200,2,'2020-03-27 16:39:27',NULL,'2',NULL,NULL,NULL,NULL);

#
# Structure for table "rent_contract"
#

DROP TABLE IF EXISTS `rent_contract`;
CREATE TABLE `rent_contract` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `rent` int(11) DEFAULT NULL,
  `images` longtext COLLATE utf8_unicode_ci,
  `status` int(11) DEFAULT NULL,
  `rent_pay_time` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `contract_end_time` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ref_house_id` bigint(20) DEFAULT NULL,
  `house_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_rent_contract_house_12` (`house_id`),
  CONSTRAINT `fk_rent_contract_house_12` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "rent_contract"
#

INSERT INTO `rent_contract` VALUES (1,'rentContract_1',0,'0',0,NULL,'2020-03-27 16:39:27',NULL,NULL,'0',NULL,NULL),(2,'rentContract_2',1,'1',1,NULL,'2020-03-27 16:39:27',NULL,NULL,'1',NULL,NULL),(3,'rentContract_3',2,'2',2,NULL,'2020-03-27 16:39:27',NULL,NULL,'2',NULL,NULL);

#
# Structure for table "rent_record"
#

DROP TABLE IF EXISTS `rent_record`;
CREATE TABLE `rent_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `rent` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `pay_date` datetime DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ref_host_id` bigint(20) DEFAULT NULL,
  `host_id` bigint(20) DEFAULT NULL,
  `ref_guest_id` bigint(20) DEFAULT NULL,
  `guest_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_rent_record_host_13` (`host_id`),
  KEY `ix_rent_record_guest_14` (`guest_id`),
  CONSTRAINT `fk_rent_record_guest_14` FOREIGN KEY (`guest_id`) REFERENCES `guest` (`id`),
  CONSTRAINT `fk_rent_record_host_13` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "rent_record"
#

INSERT INTO `rent_record` VALUES (1,'rentRecord_1',0,'2020-03-27 16:39:27',NULL,0,NULL,'0',NULL,NULL,NULL,NULL),(2,'rentRecord_2',1,'2020-03-27 16:39:27',NULL,1,NULL,'1',NULL,NULL,NULL,NULL),(3,'rentRecord_3',2,'2020-03-27 16:39:27',NULL,2,NULL,'2',NULL,NULL,NULL,NULL);

#
# Structure for table "router"
#

DROP TABLE IF EXISTS `router`;
CREATE TABLE `router` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `app_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `secret` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bind_phone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ref_house_id` bigint(20) DEFAULT NULL,
  `house_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_router_house_15` (`house_id`),
  CONSTRAINT `fk_router_house_15` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "router"
#

INSERT INTO `router` VALUES (1,'router_1','0','0','0',0,'2020-03-27 16:39:27',NULL,'0',NULL,NULL),(2,'router_2','1','1','1',1,'2020-03-27 16:39:27',NULL,'1',NULL,NULL),(3,'router_3','2','2','2',2,'2020-03-27 16:39:27',NULL,'2',NULL,NULL);

#
# Structure for table "sms_info"
#

DROP TABLE IF EXISTS `sms_info`;
CREATE TABLE `sms_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `check_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `send_xml` longtext COLLATE utf8_unicode_ci,
  `return_table` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `receive_xml` longtext COLLATE utf8_unicode_ci,
  `code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `return_msg` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "sms_info"
#

INSERT INTO `sms_info` VALUES (1,'smsInfo_1','0','0','0','0','0','0','0','2020-03-27 16:39:27',NULL,'0'),(2,'smsInfo_2','1','1','1','1','1','1','1','2020-03-27 16:39:27',NULL,'1'),(3,'smsInfo_3','2','2','2','2','2','2','2','2020-03-27 16:39:27',NULL,'2');

#
# Structure for table "user"
#

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `login_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_email_verified` tinyint(1) DEFAULT '0',
  `email_key` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_over_time` datetime DEFAULT NULL,
  `last_update_time` datetime DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_login_ip` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_login_time` datetime DEFAULT NULL,
  `last_login_ip_area` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `user_role_enum` int(11) DEFAULT NULL,
  `comment` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "user"
#

INSERT INTO `user` VALUES (1,'user_1','0','0',1,'0',NULL,NULL,'e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:27','0',NULL,'0',0,0,'0'),(2,'user_2','1','1',0,'1',NULL,NULL,'e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:27','1',NULL,'1',0,1,'1'),(3,'user_3','2','2',1,'2',NULL,NULL,'e10adc3949ba59abbe56e057f20f883e','2020-03-27 16:39:27','2',NULL,'2',0,2,'2');
