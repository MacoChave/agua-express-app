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
    const companyId = (profile as any)?.company_id ?? null;

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

    // Calculate week bounds
    const currentWeekStart = new Date(today);
    const day = currentWeekStart.getDay();
    const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1);
    currentWeekStart.setDate(diff);
    currentWeekStart.setHours(0,0,0,0);
    
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    const lastWeekEnd = new Date(currentWeekStart);
    lastWeekEnd.setHours(0,0,0,0); // Up to start of this week

    const { data: currentWeekOrders } = await supabase
      .from('orders')
      .select('total')
      .eq('company_id', companyId)
      .gte('created_at', currentWeekStart.toISOString())
      .lt('created_at', tomorrow.toISOString());

    const { data: lastWeekOrders } = await supabase
      .from('orders')
      .select('total')
      .eq('company_id', companyId)
      .gte('created_at', lastWeekStart.toISOString())
      .lt('created_at', lastWeekEnd.toISOString());

    const currentWeekTotal = currentWeekOrders?.reduce((acc, order: any) => acc + Number(order.total), 0) || 0;
    const lastWeekTotal = lastWeekOrders?.reduce((acc, order: any) => acc + Number(order.total), 0) || 0;
    const weeklyIncrease = lastWeekTotal > 0 ? ((currentWeekTotal - lastWeekTotal) / lastWeekTotal) * 100 : (currentWeekTotal > 0 ? 100 : 0);

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
      daily: {
        income: todayTotal,
        incomeIncrease: salesIncrease,
      },
      weekly: {
        currentIncome: currentWeekTotal,
        increase: weeklyIncrease,
        lastIncome: lastWeekTotal,
      },
      sales: {
        total: todayTotal,
        increase: salesIncrease,
      },
      maintenance: nextMaintenance ? {
        equipmentName: `Equipo #${(nextMaintenance as any).equipment_id}`,
        date: (nextMaintenance as any).date,
      } : null,
      systemHealth,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
