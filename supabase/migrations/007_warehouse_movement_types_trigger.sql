-- Function to automatically create default movement types when a warehouse is created
CREATE OR REPLACE FUNCTION public.create_default_movement_types_for_warehouse()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.movement_types (move_type, company_id, warehouse_id, name, adds_to_inventory, description)
    VALUES
        ('VENTA', NEW.company_id, NEW.id, 'Venta', FALSE, 'Movimiento de venta o salida de inventario'),
        ('COMPRA', NEW.company_id, NEW.id, 'Compra', TRUE, 'Movimiento de compra o ingreso de inventario');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function after a new warehouse is inserted
DROP TRIGGER IF EXISTS on_warehouse_created ON public.warehouses;
CREATE TRIGGER on_warehouse_created
    AFTER INSERT ON public.warehouses
    FOR EACH ROW
    EXECUTE FUNCTION public.create_default_movement_types_for_warehouse();
