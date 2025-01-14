package ai.verta.modeldb.common.config;

import java.util.HashMap;
import java.util.Map;

public abstract class Config {
  public static String MISSING_REQUIRED = "required field is missing";

  public ServiceConfig authService;
  public Map<String, CronJobConfig> cron_job = new HashMap<>();
  public boolean populateConnectionsBasedOnPrivileges = false;
  public DatabaseConfig database;
  public boolean enableTrace = false;
  public GrpcServerConfig grpcServer;
  public SpringServerConfig springServer;
  public TestConfig test;
  public ServiceUserConfig service_user;

  public void Validate() throws InvalidConfigException {

    if (authService != null) {
      authService.Validate("authService");
    }

    if (cron_job != null) {
      for (Map.Entry<String, CronJobConfig> cronJob : cron_job.entrySet()) {
        cronJob.getValue().Validate("cron_job." + cronJob.getKey());
      }
    }

    if (database == null) throw new InvalidConfigException("database", MISSING_REQUIRED);
    database.Validate("database");

    if (grpcServer == null) throw new InvalidConfigException("grpcServer", MISSING_REQUIRED);
    grpcServer.Validate("grpcServer");

    if (springServer == null) throw new InvalidConfigException("springServer", MISSING_REQUIRED);
    springServer.Validate("springServer");

    if (test != null) {
      test.Validate(this, "test");
    }
  }

  public boolean hasAuth() {
    return authService != null;
  }

  public abstract boolean hasServiceAccount();
}
