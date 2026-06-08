export type OrderStatus = 'on-the-way' | 'delivered' | 'pending';
export type MaintenanceStatus = 'completed' | 'pending' | 'in-progress';
export type UserRole = 'admin' | 'operator' | 'supervisor';
export type PeriodType = 'daily' | 'weekly' | 'monthly';

export interface Company {
	id: number;
	name: string;
	logo?: string;
	tax_id: string;
	legal_name: string;
	currency: string;
	created_at: string;
}

export interface Warehouse {
	id: number;
	company_id: number;
	name: string;
	address?: string;
	created_at: string;
}

export interface MovementType {
	move_type: string;
	company_id: number;
	warehouse_id: number;
	name: string;
	adds_to_inventory: boolean;
	description?: string;
	created_at: string;
}

export interface ExpenseType {
	expense_type: string;
	company_id: number;
	warehouse_id: number;
	name: string;
	description?: string;
	created_at: string;
}

export interface Equipment {
	id: number;
	company_id: number;
	warehouse_id: number;
	name: string;
	description?: string;
	created_at: string;
}

export interface MaintenanceType {
	id: number;
	company_id: number;
	warehouse_id: number;
	name: string;
	description?: string;
	created_at: string;
}

export interface InventoryMovement {
	company_id: number;
	warehouse_id: number;
	move_type: string;
	serial_number: number;
	move_date: string;
	quantity: number;
	price: number;
	expense_type_id?: string;
	evidence?: string;
	notes?: string;
	created_at: string;
}

export interface MaintenanceSchedule {
	company_id: number;
	warehouse_id: number;
	equipment_id: number;
	maintenance_type_id: number;
	frequency: number;
	period_type: PeriodType;
	created_at: string;
}

export interface MaintenanceTask {
	company_id: number;
	warehouse_id: number;
	equipment_id: number;
	maintenance_type_id: number;
	serial_number: number;
	date: string;
	evidence?: string;
	notes?: string;
	created_at: string;
}
