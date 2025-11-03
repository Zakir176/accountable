import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2, Trophy, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

const FinancialGoals = () => {
  const { expenses, getTotals } = useApp();
  const [goals, setGoals] = useState([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    category: 'savings'
  });

  const totals = getTotals();
  const totalSavings = totals.balance > 0 ? totals.balance : 0;

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) return;

    const goal = {
      ...newGoal,
      id: Date.now().toString(),
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount),
      createdAt: new Date().toISOString(),
      progress: (parseFloat(newGoal.currentAmount) / parseFloat(newGoal.targetAmount)) * 100
    };

    setGoals([...goals, goal]);
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      deadline: '',
      category: 'savings'
    });
    setIsAddingGoal(false);
  };

  const updateGoalProgress = (goalId, amount) => {
    setGoals(prev =>
      prev.map(goal => {
        if (goal.id === goalId) {
          const newAmount = goal.currentAmount + amount;
          const progress = (newAmount / goal.targetAmount) * 100;
          return { ...goal, currentAmount: newAmount, progress };
        }
        return goal;
      })
    );
  };

  const deleteGoal = goalId => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const getDaysUntilDeadline = deadline => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-futuristic p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="heading-2 mb-2">Financial Goals</h2>
          <p className="body-text-light">Track your savings targets and milestones</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingGoal(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </motion.button>
      </div>

      {/* Savings Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#2C3E50] rounded-futuristic p-4 text-center">
          <p className="body-text-light text-sm">Total Savings</p>
          <p className="text-success heading-3">${totalSavings.toFixed(2)}</p>
        </div>
        <div className="bg-[#2C3E50] rounded-futuristic p-4 text-center">
          <p className="body-text-light text-sm">Active Goals</p>
          <p className="text-accent heading-3">{goals.length}</p>
        </div>
        <div className="bg-[#2C3E50] rounded-futuristic p-4 text-center">
          <p className="body-text-light text-sm">Completed</p>
          <p className="text-success heading-3">{goals.filter(g => g.progress >= 100).length}</p>
        </div>
      </div>

      {/* Add Goal Form */}
      {isAddingGoal && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-[#2C3E50] rounded-futuristic space-y-4">
          <h3 className="heading-3">Create New Goal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Goal name (e.g., New Car, Vacation)"
              value={newGoal.name}
              onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
              className="glass-input px-4 py-3 col-span-2"
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BDC3C7]">$</span>
              <input
                type="number"
                placeholder="Target amount"
                value={newGoal.targetAmount}
                onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                className="w-full glass-input pl-8 pr-4 py-3"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BDC3C7]">$</span>
              <input
                type="number"
                placeholder="Current amount"
                value={newGoal.currentAmount}
                onChange={e => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                className="w-full glass-input pl-8 pr-4 py-3"
              />
            </div>
            <div className="relative col-span-2 sm:col-span-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BDC3C7] w-4 h-4" />
              <input
                type="date"
                value={newGoal.deadline}
                onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-3"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addGoal} className="btn-primary flex-1 py-3" disabled={!newGoal.name || !newGoal.targetAmount}>
              Create Goal
            </button>
            <button onClick={() => setIsAddingGoal(false)} className="btn-secondary px-6 py-3">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const daysLeft = getDaysUntilDeadline(goal.deadline);
          const isCompleted = goal.progress >= 100;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-futuristic border-2 transition-all ${
                isCompleted ? 'bg-[#39FF14]/10 border-[#39FF14]/30' : 'bg-[#2C3E50] border-[#2C3E50] hover:border-[#00D1FF]/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-full ${isCompleted ? 'bg-[#39FF14]' : 'bg-[#00D1FF]'}`}>
                    {isCompleted ? <Trophy className="w-5 h-5 text-[#1A1A1A]" /> : <Target className="w-5 h-5 text-[#1A1A1A]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="body-text font-semibold truncate">{goal.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1">
                      <p className="body-text-light text-sm">
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </p>
                      {daysLeft && (
                        <p className="body-text-light text-sm">{daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${isCompleted ? 'text-success' : 'text-accent'}`}>{goal.progress.toFixed(1)}%</p>
                    <p className="body-text-light text-xs">{isCompleted ? 'Completed! 🎉' : 'Progress'}</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteGoal(goal.id)} className="text-[#BDC3C7] hover:text-[#FF4500] p-2 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-[#2C3E50] rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(goal.progress, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-2 rounded-full ${isCompleted ? 'bg-success' : 'bg-accent'}`}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              {!isCompleted && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => updateGoalProgress(goal.id, 100)} className="text-xs bg-[#00D1FF] text-[#1A1A1A] px-3 py-1 rounded-full font-semibold hover:bg-[#009ACD] transition-colors">
                    +$100
                  </button>
                  <button onClick={() => updateGoalProgress(goal.id, 500)} className="text-xs bg-[#39FF14] text-[#1A1A1A] px-3 py-1 rounded-full font-semibold hover:bg-[#2CD100] transition-colors">
                    +$500
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}

        {goals.length === 0 && !isAddingGoal && (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-[#BDC3C7] mx-auto mb-3" />
            <p className="body-text-light">No financial goals yet</p>
            <p className="body-text-light text-sm">Set your first savings target to stay motivated</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FinancialGoals;
