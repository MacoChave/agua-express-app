
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom enumerated types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'agua_express')) THEN
        CREATE TYPE "public".order_status AS ENUM ('on-the-way', 'delivered', 'pending');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'maintenance_status' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'agua_express')) THEN
        CREATE TYPE "public".maintenance_status AS ENUM ('completed', 'pending', 'in-progress');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'agua_express')) THEN
        CREATE TYPE "public".user_role AS ENUM ('admin', 'operator', 'supervisor');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'period_type' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'agua_express')) THEN
        CREATE TYPE "public".period_type AS ENUM ('daily', 'weekly', 'monthly');
    END IF;
END $$;

-- =============================================
-- COMPANIES
-- =============================================
CREATE TABLE IF NOT EXISTS "public".companies (
    id            SERIAL          PRIMARY KEY,
    name          VARCHAR(150)    NOT NULL,
    logo          TEXT,
    tax_id        VARCHAR(20)     NOT NULL UNIQUE, -- NIT
    legal_name    VARCHAR(200)    NOT NULL,        -- razon_social
    currency      CHAR(3)         NOT NULL DEFAULT 'USD',
    created_at    TIMESTAMPTZ     DEFAULT NOW()
);

-- =============================================
-- WAREHOUSES
-- =============================================
CREATE TABLE IF NOT EXISTS "public".warehouses (
    id              SERIAL,
    company_id      INTEGER         NOT NULL REFERENCES "public".companies(id) ON DELETE CASCADE,
    name            VARCHAR(150)    NOT NULL,
    address         VARCHAR(250),
    created_at      TIMESTAMPTZ     DEFAULT NOW(),
	primary key (id, company_id)
);

-- =============================================
-- MOVEMENT TYPES
-- =============================================
CREATE TABLE IF NOT EXISTS "public".movement_types (
    move_type           TEXT			not NULL,
    company_id			INTEGER			not null,
    warehouse_id		INTEGER			not null,
    name                VARCHAR(100)    NOT NULL,
    adds_to_inventory   BOOLEAN         NOT NULL,  -- TRUE = inflow, FALSE = outflow
    description         TEXT,
    created_at          TIMESTAMPTZ     DEFAULT NOW(),
    PRIMARY KEY (move_type, company_id, warehouse_id),
    FOREIGN KEY (company_id, warehouse_id) REFERENCES "public".warehouses(company_id, id) ON DELETE CASCADE
);

-- =============================================
-- EXPENSE TYPES
-- =============================================
CREATE TABLE IF NOT EXISTS "public".expense_types (
    expense_type TEXT NOT NULL,
    company_id	INTEGER NOT NULL,
    warehouse_id INTEGER NOT NULL,
    name        VARCHAR(100)    NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ     DEFAULT NOW(),
    PRIMARY KEY (expense_type, company_id, warehouse_id),
    FOREIGN KEY (company_id, warehouse_id) REFERENCES "public".warehouses(company_id, id) ON DELETE CASCADE
);

-- =============================================
-- EQUIPMENT
-- =============================================
CREATE TABLE IF NOT EXISTS "public".equipment (
    id          SERIAL,
    company_id  INTEGER     NOT NULL,
    warehouse_id INTEGER    NOT NULL,
    name        VARCHAR(150) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ  DEFAULT NOW(),
    PRIMARY KEY (id, company_id, warehouse_id),
    FOREIGN KEY (company_id, warehouse_id) REFERENCES "public".warehouses(company_id, id)
);

-- =============================================
-- MAINTENANCE TYPES
-- =============================================
CREATE TABLE IF NOT EXISTS "public".maintenance_types (
    id           SERIAL,
    company_id   INTEGER      NOT NULL,
    warehouse_id INTEGER      NOT NULL,
    name         VARCHAR(100) NOT NULL,
    description  TEXT,
    created_at   TIMESTAMPTZ   DEFAULT NOW(),
    PRIMARY KEY (id, company_id, warehouse_id),
    FOREIGN KEY (company_id, warehouse_id) REFERENCES "public".warehouses(company_id, id)
);

-- =============================================
-- INVENTORY MOVEMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS "public".inventory_movements (
    company_id          INTEGER         NOT NULL,
    warehouse_id        INTEGER         NOT NULL,
    move_type           TEXT 			NOT NULL,
    serial_number       INTEGER         NOT NULL,
    move_date           DATE            NOT NULL DEFAULT CURRENT_DATE,
    quantity            NUMERIC(14,4)   NOT NULL,
    price               NUMERIC(14,2)   NOT NULL,
    expense_type_id     TEXT,
    evidence            TEXT,
    notes               TEXT,
    created_at          TIMESTAMPTZ     DEFAULT NOW(),
    PRIMARY KEY (company_id, warehouse_id, move_type, serial_number),
    FOREIGN KEY (company_id, warehouse_id) REFERENCES "public".warehouses(company_id, id),
    FOREIGN KEY (company_id, warehouse_id, move_type) REFERENCES "public".movement_types(company_id, warehouse_id, move_type) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (company_id, warehouse_id, expense_type_id) REFERENCES "public".expense_types(company_id, warehouse_id, expense_type) ON UPDATE CASCADE ON DELETE SET NULL
);

-- =============================================
-- EQUIPMENT MAINTENANCE SCHEDULES
-- =============================================
CREATE TABLE IF NOT EXISTS "public".maintenance_schedules (
    company_id           INTEGER                      NOT NULL,
    warehouse_id         INTEGER                      NOT NULL,
    equipment_id         INTEGER                      NOT NULL,
    maintenance_type_id  INTEGER                      NOT NULL,
    frequency            INTEGER                      NOT NULL CHECK (frequency > 0),
    period_type          "public".period_type   NOT NULL,
    created_at           TIMESTAMPTZ                  DEFAULT NOW(),
    PRIMARY KEY (company_id, warehouse_id, equipment_id, maintenance_type_id),
    FOREIGN KEY (company_id, warehouse_id, equipment_id) REFERENCES "public".equipment(company_id, warehouse_id, id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (company_id, warehouse_id, maintenance_type_id) REFERENCES "public".maintenance_types(company_id, warehouse_id, id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- =============================================
-- MAINTENANCE LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS "public".maintenance_tasks (
    company_id           INTEGER      NOT NULL,
    warehouse_id         INTEGER      NOT NULL,
    equipment_id         INTEGER      NOT NULL,
    maintenance_type_id  INTEGER      NOT NULL,
    serial_number        INTEGER      NOT NULL,
    date                 DATE         NOT NULL DEFAULT CURRENT_DATE,
    evidence             TEXT,
    notes                TEXT,
    created_at           TIMESTAMPTZ   DEFAULT NOW(),
    PRIMARY KEY (company_id, warehouse_id, equipment_id, maintenance_type_id, serial_number),
    FOREIGN KEY (company_id, warehouse_id, equipment_id, maintenance_type_id) REFERENCES "public".maintenance_schedules(company_id, warehouse_id, equipment_id, maintenance_type_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- =============================================
-- CUSTOMERS & ORDERS
-- =============================================
CREATE TABLE IF NOT EXISTS "public".customers (
    id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id  INTEGER         NOT NULL REFERENCES "public".companies(id) ON DELETE CASCADE,
    name        TEXT            NOT NULL,
    initials    TEXT,
    address     TEXT,
    created_at  TIMESTAMPTZ     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "public".orders (
    id              TEXT            PRIMARY KEY,
    company_id      INTEGER         NOT NULL REFERENCES "public".companies(id) ON DELETE CASCADE,
    customer_id     UUID            REFERENCES "public".customers(id) ON DELETE SET NULL,
    bottle_count    INTEGER         NOT NULL DEFAULT 0,
    total           NUMERIC(10, 2)  NOT NULL DEFAULT 0,
    status          "public".order_status DEFAULT 'pending',
    created_at      TIMESTAMPTZ     DEFAULT NOW()
);

-- =============================================
-- PROFILES (Extending auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS "public".profiles (
    id          UUID            PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id  INTEGER,
    warehouse_id INTEGER,
    full_name   TEXT,
    email       TEXT,
    role        "public".user_role DEFAULT 'operator',
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ     DEFAULT NOW(),
    FOREIGN KEY (company_id, warehouse_id) REFERENCES "public".warehouses(company_id, id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_warehouses_company             ON "public".warehouses(company_id);
CREATE INDEX idx_equipment_company_warehouse    ON "public".equipment(company_id, warehouse_id);
CREATE INDEX idx_inv_movements_company_warehouse ON "public".inventory_movements(company_id, warehouse_id);
CREATE INDEX idx_inv_movements_date             ON "public".inventory_movements(move_date);
CREATE INDEX idx_maint_logs_equipment           ON "public".maintenance_tasks(equipment_id);
CREATE INDEX idx_maint_logs_date                ON "public".maintenance_tasks(date);
CREATE INDEX idx_maint_schedules_equipment       ON "public".maintenance_schedules(equipment_id);
CREATE INDEX idx_orders_company                 ON "public".orders(company_id);
CREATE INDEX idx_customers_company              ON "public".customers(company_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS for all tables
ALTER TABLE "public".companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public".warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public".movement_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public".expense_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public".equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public".maintenance_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public".inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public".maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public".maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public".customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public".orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public".profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's company_id
CREATE OR REPLACE FUNCTION public.get_my_company_id()
RETURNS INTEGER AS $$
    SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function to get current user's warehouse_id
CREATE OR REPLACE FUNCTION public.get_my_warehouse_id()
RETURNS INTEGER AS $$
    SELECT warehouse_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- POLICIES

-- Companies: Users can only see their own company
CREATE POLICY "Users can view their own company" ON "public".companies
    FOR SELECT USING (id = public.get_my_company_id());

-- Profiles: Users can view their own profile, and admins can view all profiles in their company
CREATE POLICY "Users can view their own profile" ON "public".profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admins can view company profiles" ON "public".profiles
    FOR SELECT USING (company_id = public.get_my_company_id() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- General rule for multi-tenant tables: Access restricted by company_id and warehouse_id
DO $$ 
DECLARE 
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND column_name = 'company_id' 
        AND table_name NOT IN ('companies', 'profiles')
    LOOP
        EXECUTE format('CREATE POLICY "Company access for %I" ON "public".%I FOR ALL USING (company_id = public.get_my_company_id())', t, t);
    END LOOP;
END $$;

-- Global tables (types) are viewable by all authenticated users but editable only by admins
CREATE POLICY "Authenticated users can view movement types" ON "public".movement_types FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view expense types" ON "public".expense_types FOR SELECT USING (auth.role() = 'authenticated');

-- Note: In Supabase, remember to add "public" to the search path:
-- ALTER DATABASE postgres SET search_path TO "$user", public, agua_express;
