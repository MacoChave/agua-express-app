export type Database = {
	public: {
		Tables: {
			companies: {
				Row: import('@/types/database').Company;
				Insert: Omit<
					import('@/types/database').Company,
					'id' | 'created_at'
				> & { id?: number; created_at?: string };
				Update: Partial<import('@/types/database').Company>;
			};
			warehouses: {
				Row: import('@/types/database').Warehouse;
				Insert: Omit<
					import('@/types/database').Warehouse,
					'created_at'
				> & { created_at?: string };
				Update: Partial<import('@/types/database').Warehouse>;
			};
			inventory_movements: {
				Row: import('@/types/database').InventoryMovement;
				Insert: Omit<
					import('@/types/database').InventoryMovement,
					'created_at' | 'serial_number'
				> & { created_at?: string; serial_number?: number };
				Update: Partial<import('@/types/database').InventoryMovement>;
			};
			maintenance_schedules: {
				Row: import('@/types/database').MaintenanceSchedule;
				Insert: Omit<
					import('@/types/database').MaintenanceSchedule,
					'created_at'
				> & { created_at?: string };
				Update: Partial<import('@/types/database').MaintenanceSchedule>;
			};
			maintenance_tasks: {
				Row: import('@/types/database').MaintenanceTask;
				Insert: Omit<
					import('@/types/database').MaintenanceTask,
					'created_at' | 'serial_number'
				> & { created_at?: string; serial_number?: number };
				Update: Partial<import('@/types/database').MaintenanceTask>;
			};
			profiles: {
				Row: {
					id: string;
					company_id: number | null;
					full_name: string | null;
					email: string | null;
					role: import('@/types/database').UserRole;
					avatar_url: string | null;
					created_at: string;
				};
				Insert: {
					id: string;
					company_id?: number | null;
					full_name?: string | null;
					email?: string | null;
					role?: import('@/types/database').UserRole;
					avatar_url?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					company_id?: number | null;
					full_name?: string | null;
					email?: string | null;
					role?: import('@/types/database').UserRole;
					avatar_url?: string | null;
					created_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			get_my_company_id: {
				Args: Record<string, never>;
				Returns: number;
			};
		};
		Enums: {
			order_status: import('@/types/database').OrderStatus;
			maintenance_status: import('@/types/database').MaintenanceStatus;
			user_role: import('@/types/database').UserRole;
			period_type: import('@/types/database').PeriodType;
		};
	};
};
