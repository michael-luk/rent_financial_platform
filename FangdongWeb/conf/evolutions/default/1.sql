# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table admin (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  password                  varchar(255) not null,
  descriptions              varchar(255),
  created_at                datetime,
  last_login_ip             varchar(255),
  last_login_time           datetime,
  last_update_time          datetime,
  last_login_ip_area        varchar(255),
  status                    integer,
  user_role_enum            integer,
  comment                   longtext,
  constraint pk_admin primary key (id))
;

create table admin_journal (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  actor                     varchar(255),
  actor_level               varchar(255),
  created_at                datetime,
  constraint pk_admin_journal primary key (id))
;

create table bank_card (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  bank                      varchar(255),
  images                    longtext,
  status                    integer,
  created_at                datetime,
  last_update_time          datetime,
  comment                   varchar(255),
  ref_host_id               bigint,
  host_id                   bigint,
  constraint pk_bank_card primary key (id))
;

create table config (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  content                   varchar(255) not null,
  type_enum                 integer not null,
  last_update_time          datetime,
  created_at                datetime,
  comment                   varchar(255),
  constraint pk_config primary key (id))
;

create table contract_record (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  status                    integer,
  contract_time             datetime,
  created_at                datetime,
  last_update_time          datetime,
  comment                   varchar(255),
  ref_host_id               bigint,
  host_id                   bigint,
  ref_product_id            bigint,
  product_id                bigint,
  constraint pk_contract_record primary key (id))
;

create table credit_record (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  credit_raise              bigint,
  status                    integer,
  created_at                datetime,
  last_update_time          datetime,
  comment                   varchar(255),
  ref_host_id               bigint,
  host_id                   bigint,
  constraint pk_credit_record primary key (id))
;

create table fund_back_record (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  amount                    bigint,
  status                    integer,
  created_at                datetime,
  last_update_time          datetime,
  comment                   varchar(255),
  ref_host_id               bigint,
  host_id                   bigint,
  ref_product_id            bigint,
  product_id                bigint,
  constraint pk_fund_back_record primary key (id))
;

create table guest (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  login_name                varchar(255),
  wx_id                     varchar(255),
  sex_enum                  integer,
  phone                     varchar(255),
  card_number               varchar(255),
  email                     varchar(255),
  address                   varchar(255),
  birth                     datetime,
  password                  varchar(255),
  created_at                datetime,
  status                    integer,
  user_role_enum            integer,
  images                    longtext,
  house_name                varchar(255),
  building                  varchar(255),
  unit                      varchar(255),
  room                      varchar(255),
  amount                    integer,
  total_amount              integer,
  contract_length           varchar(255),
  contract_start_date       datetime,
  contract_end_date         datetime,
  last_update_time          datetime,
  comment                   longtext,
  constraint pk_guest primary key (id))
;

create table host (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  login_name                varchar(255),
  wx_id                     varchar(255),
  sex_enum                  integer,
  phone                     varchar(255),
  card_number               varchar(255),
  email                     varchar(255),
  address                   varchar(255),
  birth                     datetime,
  password                  varchar(255),
  created_at                datetime,
  last_update_time          datetime,
  head_images               longtext,
  images                    longtext,
  last_login_ip             varchar(255),
  last_login_time           datetime,
  last_login_ip_area        varchar(255),
  status                    integer,
  credit                    bigint,
  user_role_enum            integer,
  comment                   longtext,
  ref_partner_id            bigint,
  partner_id                bigint,
  constraint pk_host primary key (id))
;

create table house (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  classify                  varchar(255),
  province                  varchar(255),
  city                      varchar(255),
  zone                      varchar(255),
  address                   varchar(255),
  age                       integer,
  size                      varchar(255),
  structure                 varchar(255),
  rent                      integer,
  credit                    integer,
  visible                   tinyint(1) default 0,
  status                    integer,
  images                    longtext,
  created_at                datetime,
  last_update_time          datetime,
  description               longtext,
  comment                   varchar(255),
  ref_host_id               bigint,
  host_id                   bigint,
  ref_partner_id            bigint,
  partner_id                bigint,
  constraint pk_house primary key (id))
;

create table info (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  classify                  varchar(255),
  english_name              varchar(255),
  phone                     varchar(255),
  url                       varchar(255),
  visible                   tinyint(1) default 0,
  status                    integer,
  images                    longtext,
  small_images              longtext,
  last_update_time          datetime,
  created_at                datetime,
  description1              longtext,
  description2              longtext,
  comment                   varchar(255),
  constraint pk_info primary key (id))
;

create table partner (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  area                      varchar(255),
  phone                     varchar(255),
  address                   varchar(255),
  password                  varchar(255),
  created_at                datetime,
  last_update_time          datetime,
  images                    longtext,
  status                    integer,
  credit                    bigint,
  level_enum                integer,
  comment                   longtext,
  constraint pk_partner primary key (id))
;

create table product (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  index_num                 integer,
  promote                   tinyint(1) default 0,
  length                    integer,
  require_credit            bigint,
  min_invest_amount         bigint,
  max_invest_amount         bigint,
  interest                  Decimal(8,6),
  visible                   tinyint(1) default 0,
  status                    integer,
  images                    longtext,
  small_images              longtext,
  created_at                datetime,
  last_update_time          datetime,
  description               longtext,
  description2              longtext,
  comment                   varchar(255),
  contract_title            varchar(255),
  contract_content          longtext,
  constraint pk_product primary key (id))
;

create table product_record (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  in_date                   datetime,
  out_date                  datetime,
  fund_back_date            datetime,
  amount                    bigint,
  status                    integer,
  created_at                datetime,
  last_update_time          datetime,
  comment                   varchar(255),
  ref_host_id               bigint,
  host_id                   bigint,
  ref_product_id            bigint,
  product_id                bigint,
  constraint pk_product_record primary key (id))
;

create table rent_contract (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  rent                      integer,
  images                    longtext,
  status                    integer,
  rent_pay_time             datetime,
  created_at                datetime,
  contract_end_time         datetime,
  last_update_time          datetime,
  comment                   varchar(255),
  ref_house_id              bigint,
  house_id                  bigint,
  constraint pk_rent_contract primary key (id))
;

create table rent_record (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  rent                      integer,
  created_at                datetime,
  last_update_time          datetime,
  status                    integer,
  pay_date                  datetime,
  comment                   varchar(255),
  ref_host_id               bigint,
  host_id                   bigint,
  ref_guest_id              bigint,
  guest_id                  bigint,
  constraint pk_rent_record primary key (id))
;

create table router (
  id                        bigint auto_increment not null,
  name                      varchar(255) not null,
  app_id                    varchar(255),
  secret                    varchar(255),
  bind_phone                varchar(255),
  status                    integer,
  created_at                datetime,
  last_update_time          datetime,
  comment                   varchar(255),
  ref_house_id              bigint,
  house_id                  bigint,
  constraint pk_router primary key (id))
;

create table sms_info (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  phone                     varchar(255),
  check_code                varchar(255),
  send_xml                  longtext,
  return_table              varchar(255),
  receive_xml               longtext,
  code                      varchar(255),
  return_msg                varchar(255),
  created_at                datetime,
  last_update_time          datetime,
  comment                   varchar(255),
  constraint pk_sms_info primary key (id))
;

create table user (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  login_name                varchar(255) not null,
  email                     varchar(255),
  is_email_verified         tinyint(1) default 0,
  email_key                 varchar(255),
  email_over_time           datetime,
  last_update_time          datetime,
  password                  varchar(255) not null,
  created_at                datetime,
  last_login_ip             varchar(255),
  last_login_time           datetime,
  last_login_ip_area        varchar(255),
  status                    integer,
  user_role_enum            integer,
  comment                   longtext,
  constraint pk_user primary key (id))
;


create table guest_host (
  guest_id                       bigint not null,
  host_id                        bigint not null,
  constraint pk_guest_host primary key (guest_id, host_id))
;

create table host_guest (
  host_id                        bigint not null,
  guest_id                       bigint not null,
  constraint pk_host_guest primary key (host_id, guest_id))
;
alter table bank_card add constraint fk_bank_card_host_1 foreign key (host_id) references host (id) on delete restrict on update restrict;
create index ix_bank_card_host_1 on bank_card (host_id);
alter table contract_record add constraint fk_contract_record_host_2 foreign key (host_id) references host (id) on delete restrict on update restrict;
create index ix_contract_record_host_2 on contract_record (host_id);
alter table contract_record add constraint fk_contract_record_product_3 foreign key (product_id) references product (id) on delete restrict on update restrict;
create index ix_contract_record_product_3 on contract_record (product_id);
alter table credit_record add constraint fk_credit_record_host_4 foreign key (host_id) references host (id) on delete restrict on update restrict;
create index ix_credit_record_host_4 on credit_record (host_id);
alter table fund_back_record add constraint fk_fund_back_record_host_5 foreign key (host_id) references host (id) on delete restrict on update restrict;
create index ix_fund_back_record_host_5 on fund_back_record (host_id);
alter table fund_back_record add constraint fk_fund_back_record_product_6 foreign key (product_id) references product (id) on delete restrict on update restrict;
create index ix_fund_back_record_product_6 on fund_back_record (product_id);
alter table host add constraint fk_host_partner_7 foreign key (partner_id) references partner (id) on delete restrict on update restrict;
create index ix_host_partner_7 on host (partner_id);
alter table house add constraint fk_house_host_8 foreign key (host_id) references host (id) on delete restrict on update restrict;
create index ix_house_host_8 on house (host_id);
alter table house add constraint fk_house_partner_9 foreign key (partner_id) references partner (id) on delete restrict on update restrict;
create index ix_house_partner_9 on house (partner_id);
alter table product_record add constraint fk_product_record_host_10 foreign key (host_id) references host (id) on delete restrict on update restrict;
create index ix_product_record_host_10 on product_record (host_id);
alter table product_record add constraint fk_product_record_product_11 foreign key (product_id) references product (id) on delete restrict on update restrict;
create index ix_product_record_product_11 on product_record (product_id);
alter table rent_contract add constraint fk_rent_contract_house_12 foreign key (house_id) references house (id) on delete restrict on update restrict;
create index ix_rent_contract_house_12 on rent_contract (house_id);
alter table rent_record add constraint fk_rent_record_host_13 foreign key (host_id) references host (id) on delete restrict on update restrict;
create index ix_rent_record_host_13 on rent_record (host_id);
alter table rent_record add constraint fk_rent_record_guest_14 foreign key (guest_id) references guest (id) on delete restrict on update restrict;
create index ix_rent_record_guest_14 on rent_record (guest_id);
alter table router add constraint fk_router_house_15 foreign key (house_id) references house (id) on delete restrict on update restrict;
create index ix_router_house_15 on router (house_id);



alter table guest_host add constraint fk_guest_host_guest_01 foreign key (guest_id) references guest (id) on delete restrict on update restrict;

alter table guest_host add constraint fk_guest_host_host_02 foreign key (host_id) references host (id) on delete restrict on update restrict;

alter table host_guest add constraint fk_host_guest_host_01 foreign key (host_id) references host (id) on delete restrict on update restrict;

alter table host_guest add constraint fk_host_guest_guest_02 foreign key (guest_id) references guest (id) on delete restrict on update restrict;

# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table admin;

drop table admin_journal;

drop table bank_card;

drop table config;

drop table contract_record;

drop table credit_record;

drop table fund_back_record;

drop table guest;

drop table guest_host;

drop table host;

drop table host_guest;

drop table house;

drop table info;

drop table partner;

drop table product;

drop table product_record;

drop table rent_contract;

drop table rent_record;

drop table router;

drop table sms_info;

drop table user;

SET FOREIGN_KEY_CHECKS=1;

