import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckSquare, 
  Lightbulb, 
  ArrowRight,
  ListTodo,
  BookOpen,
  Calendar,
  AlarmClock,
  ChevronRight,
  Target,
  BarChart,
  Edit2,
  TrendingUp,
  Award,
  Plus
} from 'lucide-react';
import { useDataMode } from '../context/DataModeContext';
import { format, addDays, isBefore, parseISO, isToday, startOfWeek, endOfWeek } from 'date-fns';
import GoalModal from './dashboard/GoalModal';
import DashboardTile from './dashboard/DashboardTile';
import MiniCalendar from './dashboard/MiniCalendar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { mockTasks, mockEvents } = useDataMode();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [studyGoal, setStudyGoal] = useState({
    type: 'hours' as 'hours' | 'tasks',
    target: 20,
    current: 12
  });

  // Get upcoming deadlines (next 7 days)
  const upcomingDeadlines = mockTasks
    .filter(task => {
      const dueDate = new Date(task.dueDate);
      const sevenDaysFromNow = addDays(new Date(), 7);
      return !task.completed && isBefore(dueDate, sevenDaysFromNow);
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Get today's schedule
  const todayEvents = mockEvents
    .filter(event => isToday(parseISO(event.start.dateTime)))
    .sort((a, b) => 
      parseISO(a.start.dateTime).getTime() - parseISO(b.start.dateTime).getTime()
    );

  const todayTasks = mockTasks
    .filter(task => isToday(new Date(task.dueDate)))
    .sort((a, b) => a.priority === 'high' ? -1 : 1);

  // Calculate weekly stats
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weeklyStats = {
    tasksCompleted: mockTasks.filter(task => 
      task.completed && 
      new Date(task.dueDate) >= weekStart && 
      new Date(task.dueDate) <= weekEnd
    ).length,
    totalTasks: mockTasks.filter(task =>
      new Date(task.dueDate) >= weekStart &&
      new Date(task.dueDate) <= weekEnd
    ).length,
    studyHours: 12,
    upcomingDeadlines: upcomingDeadlines.length
  };

  const handleGoalSave = (newGoal: typeof studyGoal) => {
    setStudyGoal(newGoal);
    setShowGoalModal(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <DashboardTile title="Today's Schedule" icon={Clock}>
          <div className="space-y-3">
            {todayEvents.length === 0 && todayTasks.length === 0 ? (
              <p className="text-gray-500">No events or tasks scheduled for today</p>
            ) : (
              <>
                {todayEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-primary">
                      {format(parseISO(event.start.dateTime), 'h:mm a')}
                    </div>
                    <div className="text-gray-700">{event.summary}</div>
                  </div>
                ))}
                {todayTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <div className="text-gray-700">{task.title}</div>
                  </div>
                ))}
              </>
            )}
            <button
              onClick={() => navigate('/planner')}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors duration-200"
            >
              View Full Schedule
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </DashboardTile>

        {/* Mini Calendar */}
        <DashboardTile title="Calendar" icon={CalendarIcon}>
          <MiniCalendar
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </DashboardTile>

        {/* Upcoming Deadlines */}
        <DashboardTile title="Upcoming Deadlines" icon={Clock}>
          <div className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-gray-500">No upcoming deadlines</p>
            ) : (
              upcomingDeadlines.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{task.title}</div>
                    <div className="text-sm text-gray-500">
                      Due {format(new Date(task.dueDate), 'EEE, MMM d')}
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {task.category}
                  </div>
                </div>
              ))
            )}
          </div>
        </DashboardTile>

        {/* Quick Actions */}
        <DashboardTile title="Quick Actions" icon={ListTodo}>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/planner')}
              className="flex items-center gap-2 p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Plus className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Add Task</div>
                <div className="text-sm text-gray-500">Create a new task</div>
              </div>
            </button>
            <button
              onClick={() => navigate('/planner')}
              className="flex items-center gap-2 p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Study Block</div>
                <div className="text-sm text-gray-500">Schedule study time</div>
              </div>
            </button>
            <button
              onClick={() => navigate('/planner')}
              className="flex items-center gap-2 p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">View Calendar</div>
                <div className="text-sm text-gray-500">See your schedule</div>
              </div>
            </button>
            <button
              onClick={() => navigate('/planner')}
              className="flex items-center gap-2 p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <AlarmClock className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Today's Plan</div>
                <div className="text-sm text-gray-500">View daily tasks</div>
              </div>
            </button>
          </div>
        </DashboardTile>

        {/* Study Goals */}
        <DashboardTile title="Study Goals" icon={Target}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Weekly Goal</div>
                <div className="font-medium">
                  {studyGoal.current} / {studyGoal.target} {studyGoal.type}
                </div>
              </div>
              <button
                onClick={() => setShowGoalModal(true)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-primary">
                    {Math.round((studyGoal.current / studyGoal.target) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/10">
                <div
                  style={{ width: `${(studyGoal.current / studyGoal.target) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                />
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {studyGoal.current >= studyGoal.target ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Award className="w-4 h-4" />
                  Goal achieved! Great work!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Keep going, you're making progress!
                </div>
              )}
            </div>
          </div>
        </DashboardTile>

        {/* Weekly Summary */}
        <DashboardTile title="Weekly Summary" icon={BarChart}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Tasks Completed</div>
                <div className="text-2xl font-semibold text-gray-800">
                  {weeklyStats.tasksCompleted}/{weeklyStats.totalTasks}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Study Hours</div>
                <div className="text-2xl font-semibold text-gray-800">
                  {weeklyStats.studyHours}h
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Upcoming Deadlines</div>
              <div className="text-2xl font-semibold text-gray-800">
                {weeklyStats.upcomingDeadlines}
              </div>
            </div>
          </div>
        </DashboardTile>
      </div>

      {showGoalModal && (
        <GoalModal
          currentGoal={studyGoal}
          onSave={handleGoalSave}
          onClose={() => setShowGoalModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;