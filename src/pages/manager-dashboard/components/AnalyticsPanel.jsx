import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import { predictNextMonth } from '../../../lib/ai-predictor';

const AnalyticsPanel = ({ analyticsData }) => {
  const {
    monthlySpending,
    categoryBreakdown,
    approvalTrends,
    teamMetrics,
    budgetUtilization
  } = analyticsData;

  const COLORS = ['#1E40AF', '#0EA5E9', '#059669', '#D97706', '#DC2626'];

  const MetricCard = ({ title, value, change, icon, variant = 'default' }) => {
    const isPositive = change > 0;
    const variantClasses = {
      default: 'bg-card',
      success: 'bg-success/5 border-success/20',
      warning: 'bg-warning/5 border-warning/20',
      error: 'bg-error/5 border-error/20'
    };

    return (
      <div className={`p-4 rounded-lg border border-border expense-shadow-sm ${variantClasses?.[variant]}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
              <Icon name={icon} size={16} className="text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          <div className={`flex items-center space-x-1 text-xs ${
            isPositive ? 'text-success' : 'text-error'
          }`}>
            <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={12} />
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </div>
    );
  };

  // Small prediction card
  const PredictionCard = ({ monthlySpending }) => {
    const { prediction, confidence } = predictNextMonth(monthlySpending);
    return (
      <div className="p-4 rounded-lg border border-border expense-shadow-sm bg-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent/10 rounded-md flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-accent" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Predicted Next Month</span>
          </div>
          <div className="text-xs text-muted-foreground">Confidence {confidence}%</div>
        </div>
        <div className="text-2xl font-bold text-foreground">${prediction?.toLocaleString()}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Approvals"
          value={teamMetrics?.pendingApprovals}
          change={-12}
          icon="Clock"
          variant="warning"
        />
        <MetricCard
          title="Monthly Spending"
          value={`$${teamMetrics?.monthlySpending?.toLocaleString()}`}
          change={8}
          icon="DollarSign"
        />
        <MetricCard
          title="Avg Processing Time"
          value={`${teamMetrics?.avgProcessingTime}h`}
          change={-15}
          icon="Timer"
          variant="success"
        />
        <MetricCard
          title="Team Members"
          value={teamMetrics?.teamSize}
          change={5}
          icon="Users"
        />
        <PredictionCard monthlySpending={monthlySpending} />
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Trend */}
        <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Monthly Spending Trend</h3>
            <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px'
                  }}
                  formatter={(value) => [`$${value?.toLocaleString()}`, 'Amount']}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Expense Categories</h3>
            <Icon name="PieChart" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px'
                  }}
                  formatter={(value) => [`$${value?.toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryBreakdown?.map((category, index) => (
              <div key={category?.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                />
                <span className="text-sm text-muted-foreground">{category?.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Trends */}
        <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Approval Trends</h3>
            <Icon name="BarChart3" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={approvalTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="week" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="approved" fill="var(--color-success)" name="Approved" />
                <Bar dataKey="rejected" fill="var(--color-error)" name="Rejected" />
                <Bar dataKey="pending" fill="var(--color-warning)" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Utilization */}
        <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Budget Utilization</h3>
            <Icon name="Target" size={20} className="text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {budgetUtilization?.map((budget) => (
              <div key={budget?.department}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{budget?.department}</span>
                  <span className="text-sm text-muted-foreground">
                    ${budget?.used?.toLocaleString()} / ${budget?.total?.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full expense-transition ${
                      budget?.percentage > 90 ? 'bg-error' :
                      budget?.percentage > 75 ? 'bg-warning': 'bg-success'
                    }`}
                    style={{ width: `${Math.min(budget?.percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{budget?.percentage}% used</span>
                  <span className="text-xs text-muted-foreground">
                    ${(budget?.total - budget?.used)?.toLocaleString()} remaining
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;