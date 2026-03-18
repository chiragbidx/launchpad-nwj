-- Migration for LeadFlow CRM: companies, contacts, activities

CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name varchar(120) NOT NULL,
  website varchar(255),
  industry varchar(100),
  status varchar(32) NOT NULL,
  description text,
  main_contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_team_company_name UNIQUE (team_id, name)
);

CREATE INDEX idx_team_company ON companies(team_id);
CREATE INDEX idx_main_contact ON companies(main_contact_id);

CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  email varchar(255),
  phone varchar(30),
  job_title varchar(80),
  status varchar(32) NOT NULL,
  notes text,
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_team_contact_name ON contacts(team_id, last_name, first_name);
CREATE INDEX idx_email_contact ON contacts(team_id, email);
CREATE INDEX idx_company_contact ON contacts(company_id);

CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  type varchar(32) NOT NULL,
  subject varchar(160) NOT NULL,
  description text,
  datetime timestamptz NOT NULL,
  assigned_user_id uuid REFERENCES users(id),
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_team_activity ON activities(team_id);
CREATE INDEX idx_contact_activity ON activities(contact_id);
CREATE INDEX idx_company_activity ON activities(company_id);
CREATE INDEX idx_activity_datetime ON activities(datetime);