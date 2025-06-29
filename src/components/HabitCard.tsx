
import React, { useState } from 'react';
import { Check, Trash2, Calendar, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Habit } from '@/pages/Index';

interface HabitCardProps {
  habit: Habit;
  onToggleCompletion: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
  today: string;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggleCompletion,
  onDelete,
  today
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const isCompletedToday = habit.completedDates.includes(today);
  const completionRate = habit.completedDates.length > 0 
    ? Math.round((habit.completedDates.length / Math.max(1, Math.ceil((Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)))) * 100)
    : 0;

  // Get last 7 days for mini calendar
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(habit.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md hover:scale-105 transform">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-800">
                {habit.name}
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">{habit.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className={`opacity-0 group-hover:opacity-100 transition-opacity ${
              showDeleteConfirm ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:text-red-500'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <Badge variant="secondary" className="w-fit text-xs">
          {habit.category}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Today's Completion */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Today</span>
          <Button
            variant={isCompletedToday ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleCompletion(habit.id, today)}
            className={isCompletedToday 
              ? "bg-green-500 hover:bg-green-600 text-white shadow-md" 
              : "border-slate-200 hover:border-green-300 hover:bg-green-50"
            }
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>

        {/* Mini Calendar - Last 7 Days */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-600">Last 7 Days</span>
          <div className="flex gap-1">
            {last7Days.map((date, index) => {
              const isCompleted = habit.completedDates.includes(date);
              const isToday = date === today;
              
              return (
                <div
                  key={date}
                  className={`w-8 h-8 rounded-md border-2 flex items-center justify-center text-xs font-medium transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white shadow-sm'
                      : isToday
                      ? 'border-slate-300 bg-slate-50 text-slate-400'
                      : 'border-slate-200 bg-white text-slate-300 hover:border-slate-300'
                  }`}
                  onClick={() => onToggleCompletion(habit.id, date)}
                >
                  {new Date(date).getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              <span className="text-xs text-slate-500">Current</span>
            </div>
            <span className="text-lg font-bold text-orange-600">{habit.currentStreak}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-slate-500">Best</span>
            </div>
            <span className="text-lg font-bold text-blue-600">{habit.longestStreak}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-purple-500" />
              <span className="text-xs text-slate-500">Rate</span>
            </div>
            <span className="text-lg font-bold text-purple-600">{completionRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
