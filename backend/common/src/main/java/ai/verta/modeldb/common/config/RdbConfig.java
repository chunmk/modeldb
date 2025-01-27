package ai.verta.modeldb.common.config;

public class RdbConfig {
  public String RdbDatabaseName;
  // TODO: replace driver with "io.opentracing.contrib.jdbc.TracingDriver" if tracing is enabled
  public String RdbDriver;
  public String RdbDialect;
  public String RdbUrl;
  public String RdbUsername;
  public String RdbPassword;

  public void Validate(String base) throws InvalidConfigException {
    if (RdbDatabaseName == null || RdbDatabaseName.isEmpty())
      throw new InvalidConfigException(base + ".RdbDatabaseName", Config.MISSING_REQUIRED);
    if (RdbDriver == null || RdbDriver.isEmpty())
      throw new InvalidConfigException(base + ".RdbDriver", Config.MISSING_REQUIRED);
    if (RdbDialect == null || RdbDialect.isEmpty())
      throw new InvalidConfigException(base + ".RdbDialect", Config.MISSING_REQUIRED);
    if (RdbUrl == null || RdbUrl.isEmpty())
      throw new InvalidConfigException(base + ".RdbUrl", Config.MISSING_REQUIRED);
    if (RdbUsername == null || RdbUsername.isEmpty())
      throw new InvalidConfigException(base + ".RdbUsername", Config.MISSING_REQUIRED);
  }

  public boolean isPostgres() {
    return RdbDialect.equals("org.hibernate.dialect.PostgreSQLDialect");
  }
}
