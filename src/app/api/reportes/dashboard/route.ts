import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
    const companyId = (profile as any)?.company_id;

    if (!companyId) {
      return NextResponse.json({ error: 'No company found' }, { status: 400 });
    }

    // Date references
    const today = new Date();
    today.setHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Fetch all movements for the company
    // For large datasets, doing this in-memory is bad, but for a small app it's fine.
    // We'll fetch today's and yesterday's movements specifically, and some for history.
    const { data: dailyMovements } = await supabase
      .from('inventory_movements')
      .select('move_type, price, move_date, expense_type_id')
      .eq('company_id', companyId)
      .gte('move_date', yesterday.toISOString().split('T')[0])
      .lte('move_date', today.toISOString().split('T')[0]);
      
    let todayIncome = 0;
    let todayExpense = 0;
    let yesterdayIncome = 0;
    let yesterdayExpense = 0;

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    (dailyMovements || []).forEach(m: any => {
        const val = Number(m.price || 0);
        if (m.move_date === todayStr) {
            if (m.move_type === 'VENTA') todayIncome += val;
            if (m.move_type === 'COMPRA') todayExpense += val;
        } else if (m.move_date === yesterdayStr) {
            if (m.move_type === 'VENTA') yesterdayIncome += val;
            if (m.move_type === 'COMPRA') yesterdayExpense += val;
        }
    });

    const incomeIncrease = yesterdayIncome > 0 ? ((todayIncome - yesterdayIncome) / yesterdayIncome) * 100 : (todayIncome > 0 ? 100 : 0);
    const expenseIncrease = yesterdayExpense > 0 ? ((todayExpense - yesterdayExpense) / yesterdayExpense) * 100 : (todayExpense > 0 ? 100 : 0);

    const netProfit = todayIncome - todayExpense;
    const profitMargin = todayIncome > 0 ? (netProfit / todayIncome) * 100 : 0;

    // Last 5 months
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const barData = [];
    
    // Calculate last 5 months
    const fiveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 4, 1);
    const { data: monthlyMovements } = await supabase
      .from('inventory_movements')
      .select('move_type, price, move_date')
      .eq('company_id', companyId)
      .gte('move_date', fiveMonthsAgo.toISOString().split('T')[0])
      .eq('move_type', 'VENTA');
      
    // Group by month
    const monthlyTotals = new Map<number, number>();
    (monthlyMovements || []).forEach(m: any => {
        const d = new Date(m.move_date);
        const mKey = d.getMonth();
        monthlyTotals.set(mKey, (monthlyTotals.get(mKey) || 0) + Number(m.price || 0));
    });

    for (let i = 4; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const mIdx = d.getMonth();
        const total = monthlyTotals.get(mIdx) || 0;
        barData.push([monthNames[mIdx], total, i === 0]);
    }
    
    // Scale barData heights (0 to 100%)
    const maxVal = Math.max(...barData.map(b => b[1] as number));
    const scaledBarData = barData.map(b => [b[0], maxVal > 0 ? `${Math.round(((b[1] as number) / maxVal) * 100)}%` : '0%', b[2], b[1]]);

    // Expense Distribution (all time or this month)
    const { data: expenses } = await supabase
      .from('inventory_movements')
      .select('price, expense_type_id')
      .eq('company_id', companyId)
      .eq('move_type', 'COMPRA')
      .gte('move_date', firstDayOfMonth.toISOString().split('T')[0]);
      
    const expenseMap = new Map<string, number>();
    let totalMonthlyExpenses = 0;
    (expenses || []).forEach(e: any => {
        const cat = e.expense_type_id || 'Otros';
        const val = Number(e.price || 0);
        expenseMap.set(cat, (expenseMap.get(cat) || 0) + val);
        totalMonthlyExpenses += val;
    });

    const colors = ['bg-[var(--color-secondary)]', 'bg-[var(--color-secondary-container)]', 'bg-[var(--color-surface-variant)]'];
    const distribution = Array.from(expenseMap.entries())
        .sort((a,b) => b[1] - a[1])
        .slice(0, 3)
        .map((entry, index) => ({
            label: entry[0],
            pct: totalMonthlyExpenses > 0 ? `${Math.round((entry[1] / totalMonthlyExpenses) * 100)}%` : '0%',
            dot: colors[index % colors.length],
            value: entry[1]
        }));
        
    // If empty, provide mock distribution
    if (distribution.length === 0) {
        distribution.push(
            { label: 'Sin gastos', pct: '0%', dot: colors[0], value: 0 }
        );
    }

    // Last 5 movements
    const { data: lastMovements } = await supabase
      .from('inventory_movements')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(5);
      
    // Cambiamos "m as any" por "m: any"
    const formattedMovements = (lastMovements || []).map((m: any) => ({
      id: `${m.move_type}-${m.serial_number}`,
      concept: m.move_type === 'VENTA' ? 'Venta de producto' : 'Gasto registrado',
      category: m.expense_type_id || (m.move_type === 'VENTA' ? 'Ingreso' : 'Gasto General'),
      time: new Date(m.created_at).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
      amount: m.move_type === 'VENTA' ? Number(m.price || 0) : -Number(m.price || 0),
      icon: m.move_type === 'VENTA' ? 'payments' : 'shopping_cart'
    }));

    return NextResponse.json({
      daily: {
          income: todayIncome,
          incomeIncrease,
          expense: todayExpense,
          expenseIncrease,
          netProfit,
          profitMargin
      },
      barData: scaledBarData,
      distribution,
      lastMovements: formattedMovements
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
