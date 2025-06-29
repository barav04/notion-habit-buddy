
import React, { useState, useEffect } from 'react';
import { Plus, Target, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HabitCard from '@/components/HabitCard';
import AddHabitDialog from '@/components/AddHabitDialog';
import StatsOverview from '@/components/StatsOverview';

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  completedDates: string[];
  currentStreak: number;
  longestStreak: number;
  targetFrequency: number;
  createdAt: string;
}

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('notion-habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage whenever habits array changes
  useEffect(() => {
    localStorage.setItem('notion-habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'completedDates' | 'currentStreak' | 'longestStreak' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
    setIsAddDialogOpen(false);
  };

  const updateHabit = (habitId: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const completedDates = [...habit.completedDates];
        const dateIndex = completedDates.indexOf(date);
        
        if (dateIndex > -1) {
          // Remove date if already completed
          completedDates.splice(dateIndex, 1);
        } else {
          // Add date if not completed
          completedDates.push(date);
        }
        
        // Calculate streaks
        const sortedDates = completedDates.sort();
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        
        // Simple streak calculation
        const today = new Date().toISOString().split('T')[0];
        if (sortedDates.includes(today)) {
          currentStreak = 1;
          // Calculate consecutive days backwards from today
          for (let i = 1; i < 30; i++) {
            const checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];
            if (sortedDates.includes(dateStr)) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
        
        // Calculate longest streak
        for (const date of sortedDates) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        }
        
        return {
          ...habit,
          completedDates,
          currentStreak,
          longestStreak: Math.max(longestStreak, currentStreak)
        };
      }
      return habit;
    }));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Habit Tracker
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Build better habits, one day at a time. Track your progress and celebrate your wins.
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview habits={habits} />

        {/* Add Habit Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Habit
          </Button>
        </div>

        {/* Habits Grid */}
        {habits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleCompletion={toggleHabitCompletion}
                onDelete={deleteHabit}
                today={today}
              />
            ))}
          </div>
        ) : (
          <Card className="max-w-md mx-auto border-dashed border-2 border-slate-300">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Calendar className="w-12 h-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No habits yet</h3>
              <p className="text-slate-500 mb-4">Start building better habits by adding your first one!</p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Habit
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Habit Dialog */}
        <AddHabitDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddHabit={addHabit}
        />
      </div>
    </div>
  );
};

export default Index;
