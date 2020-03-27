
package util;

import LyLib.Interfaces.IConst;
import com.avaje.ebean.Ebean;
import models.Admin;
import models.BankCard;
import models.Config;
import models.ContractRecord;
import models.CreditRecord;
import models.FundBackRecord;
import models.Guest;
import models.Host;
import models.House;
import models.Info;
import models.Partner;
import models.Product;
import models.ProductRecord;
import models.RentContract;
import models.RentRecord;
import models.Router;
import models.SmsInfo;
import models.User;
import play.libs.Yaml;

import java.util.List;
import java.util.Map;

public class DummyDataImport implements IConst {
    public static void insert() {
        play.Logger.info("start load dummy data");

        if (Ebean.find(Admin.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("admin");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default Admin %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default Admin done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(BankCard.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("bankCard");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default BankCard %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default BankCard done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(Config.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("config");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default Config %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default Config done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(ContractRecord.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("contractRecord");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default ContractRecord %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default ContractRecord done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(CreditRecord.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("creditRecord");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default CreditRecord %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default CreditRecord done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(FundBackRecord.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("fundBackRecord");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default FundBackRecord %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default FundBackRecord done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(Guest.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("guest");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default Guest %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default Guest done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(Host.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("host");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default Host %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default Host done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(House.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("house");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default House %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default House done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(Info.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("info");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default Info %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default Info done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(Partner.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("partner");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default Partner %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default Partner done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(Product.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("product");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default Product %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default Product done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(ProductRecord.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("productRecord");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default ProductRecord %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default ProductRecord done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(RentContract.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("rentContract");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default RentContract %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default RentContract done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(RentRecord.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("rentRecord");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default RentRecord %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default RentRecord done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(Router.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("router");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default Router %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default Router done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(SmsInfo.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("smsInfo");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default SmsInfo %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default SmsInfo done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

        if (Ebean.find(User.class).findRowCount() == 0) {
            try {
                Map<String, List<Object>> initData = (Map<String, List<Object>>) Yaml.load("initial-data.yml");
                List<Object> defaultObjs = initData.get("user");
                if (defaultObjs != null) {
                    if (defaultObjs.size() > 0) {
                        Ebean.save(defaultObjs);
                        play.Logger.info(String.format("load dummy default User %s", defaultObjs.size()));
                    }
                }
                play.Logger.info("load dummy default User done");
            } catch (Exception ex) {
                play.Logger.error(CONFIG_FILE_ISSUE + ": " + ex.getMessage());
            }
        }

    }
}
