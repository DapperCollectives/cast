CREATE TYPE community_type AS enum ('dao', 'social', 'protocol', 'creator', 'service');

CREATE TABLE community_types (
  key community_type primary key,
  name VARCHAR(128) not null,
  description TEXT
);

INSERT INTO community_types (key, name, description)
VALUES ('dao', 'DAO', 'Decentralized Autonomous Organization');

INSERT INTO community_types (key, name, description)
VALUES ('social', 'Social', 'Social Community');

INSERT INTO community_types (key, name, description)
VALUES ('protocol', 'Protocol', 'Protocol Community');

INSERT INTO community_types (key, name, description)
VALUES ('creator', 'Creator', 'Creator Community');

INSERT INTO community_types (key, name, description)
VALUES ('service', 'Service', 'Service Community');

ALTER TABLE communities ADD COLUMN category community_type;
ALTER TABLE communities ADD COLUMN terms_and_conditions_url VARCHAR(256);
ALTER TABLE communities ADD COLUMN contract_name VARCHAR(100);
ALTER TABLE communities ADD COLUMN contract_address VARCHAR(18);
ALTER TABLE communities ADD COLUMN storage_path VARCHAR(100);
ALTER TABLE communities ADD COLUMN vault_uuid VARCHAR(46);
ALTER TABLE communities ADD COLUMN only_authors_to_submit BOOLEAN DEFAULT FALSE;
