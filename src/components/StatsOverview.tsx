
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import { Habit } from '@/pages/Index';

interface StatsOverviewProps {
  habits: Habit[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ habits }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => 
    habit.completedDates.includes(today)
  ).length;
  
  const averageStreak = totalHabits > 0 
    ? Math.round(habits.reduce((sum, habit) => sum + habit.currentStreak, 0) / totalHabits)
    : 0;
  
  const completionRate = totalHabits > 0 
    ? Math.round((completedToday / totalHabits) * 100)
    : 0;

  if (totalHabits === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Calendar className="w-5 h-5" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-800 mb-1">
            {completedToday}/{totalHabits}
          </div>
          <p className="text-sm text-blue-600">
            {completionRate}% completion rate
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <TrendingUp className="w-5 h-5" />
            Average Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-800 mb-1">
            {averageStreak}
          </div>
          <p className="text-sm text-green-600">
            days on average
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Target className="w-5 h-5" />
            Total Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-800 mb-1">
            {totalHabits}
          </div>
          <p className="text-sm text-purple-600">
            habits tracked
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
