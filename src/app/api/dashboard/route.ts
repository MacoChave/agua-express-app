import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's company
    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
    const companyId = (profile as any)?.company_id;

    if (!companyId) {
      return NextResponse.json({ error: 'No company found' }, { status: 400 });
    }

    // 1. Ventas Totales
    const today = new Date();
    today.setHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: todayOrders } = await supabase
      .from('orders')
      .select('total')
      .eq('company_id', companyId)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    const { data: yesterdayOrders } = await supabase
      .from('orders')
      .select('total')
      .eq('company_id', companyId)
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString());

    const todayTotal = todayOrders?.reduce((acc, order: any) => acc + Number(order.total), 0) || 0;
    const yesterdayTotal = yesterdayOrders?.reduce((acc, order: any) => acc + Number(order.total), 0) || 0;
    const salesIncrease = yesterdayTotal > 0 ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100 : (todayTotal > 0 ? 100 : 0);

    // 2. Próximo mantenimiento
    const { data: nextMaintenance } = await supabase
      .from('maintenance_tasks')
      .select('*')
      .eq('company_id', companyId)
      .gte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(1)
      .single();

    // 3. Salud del sistema (optional)
    const { count: equipmentCount } = await supabase
      .from('equipment')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    let systemHealth = null;
    if (equipmentCount && equipmentCount > 0) {
      systemHealth = [
        { label: 'Capacidad del Tanque A', value: '82%', tone: 'bg-secondary-container' },
        { label: 'Presión de Bombeo', value: '95%', tone: 'bg-green-500' }
      ];
    }

    return NextResponse.json({
      sales: {
        total: todayTotal,
        increase: salesIncrease,
      },
      maintenance: nextMaintenance ? {
        equipmentName: `Equipo #${nextMaintenance.equipment_id}`,
        date: nextMaintenance.date,
      } : null,
      systemHealth,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
