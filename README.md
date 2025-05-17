Here is what we need in order to make the app production grade.

1. Security
   Use tls/ssl
   secure http headers like helmet
   input validation and sanitization
   auth and authz with rbac
   rate limit
   prevent sql injection
   secret management
   graceful shutdown
   error handling
   health checks
   logging and observability
   monitoring
   versioning
   backup and disaster recovery
   database replication

packages we use.
express
pg
pg-format
joi
validator
dotenv
cors
helmet
jsonwebtoken
swagger
swagger-ui-express
winston
