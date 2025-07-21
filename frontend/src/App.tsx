import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Plus, CheckCircle, Circle, Trash2, Sparkles, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from './config';

interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    time?: string;
    date: string; // 添加日期字段
}

interface AIAnalysis {
    summary: string;
    suggestions: string[];
}

const App: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([
        // 添加一些演示数据
        {
            id: '1',
            title: '完成项目报告',
            completed: true,
            priority: 'high',
            time: '09:00',
            date: format(new Date(), 'yyyy-MM-dd')
        },
        {
            id: '2',
            title: '团队会议',
            completed: false,
            priority: 'medium',
            time: '14:00',
            date: format(new Date(), 'yyyy-MM-dd')
        },
        {
            id: '3',
            title: '阅读技术文档',
            completed: false,
            priority: 'low',
            date: format(new Date(), 'yyyy-MM-dd')
        },
        {
            id: '4',
            title: '健身锻炼',
            completed: true,
            priority: 'medium',
            time: '18:00',
            date: format(addDays(new Date(), 1), 'yyyy-MM-dd')
        },
        {
            id: '5',
            title: '学习新技能',
            completed: false,
            priority: 'high',
            date: format(addDays(new Date(), 1), 'yyyy-MM-dd')
        }
    ]);
    const [newTask, setNewTask] = useState('');
    const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [selectedTime, setSelectedTime] = useState('');
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    // 生成日历数据
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // 获取选中日期的任务
    const selectedDateTasks = tasks.filter(task =>
        isSameDay(new Date(task.date), selectedDate)
    );

    // 获取某一天的任务数量
    const getTasksForDay = (date: Date) => {
        return tasks.filter(task => isSameDay(new Date(task.date), date));
    };

    // 获取某一天已完成的任务数量
    const getCompletedTasksForDay = (date: Date) => {
        return getTasksForDay(date).filter(task => task.completed).length;
    };

    const addTask = () => {
        if (newTask.trim()) {
            const task: Task = {
                id: Date.now().toString(),
                title: newTask.trim(),
                completed: false,
                priority: selectedPriority,
                time: selectedTime || undefined,
                date: format(selectedDate, 'yyyy-MM-dd'),
            };
            setTasks([...tasks, task]);
            setNewTask('');
            setSelectedTime('');
        }
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'high': return '高';
            case 'medium': return '中';
            case 'low': return '低';
            default: return '中';
        }
    };

    const analyzeWithAI = async () => {
        if (selectedDateTasks.length === 0) return;

        setIsLoadingAI(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/analyze`, {
                tasks: selectedDateTasks.map(task => ({
                    title: task.title,
                    completed: task.completed,
                    priority: task.priority,
                    time: task.time
                }))
            });
            setAiAnalysis(response.data);
        } catch (error) {
            console.error('AI分析失败:', error);
            // 模拟AI分析结果
            setAiAnalysis({
                summary: '基于您的计划，我建议您优先处理高优先级任务，并合理安排时间。',
                suggestions: [
                    '建议先完成高优先级任务',
                    '为每个任务预留充足时间',
                    '定期回顾和调整计划'
                ]
            });
        } finally {
            setIsLoadingAI(false);
        }
    };

    const changeMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    };

    const completedTasks = selectedDateTasks.filter(task => task.completed).length;
    const totalTasks = selectedDateTasks.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* 头部 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">每日计划助手</h1>
                    <p className="text-xl text-gray-600">智能规划您的每一天</p>
                </div>

                {/* 主要内容区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 左侧日历 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">日历</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => changeMonth('prev')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-lg font-medium text-gray-700 min-w-[120px]">
                                    {format(currentDate, 'yyyy年MM月', { locale: zhCN })}
                                </span>
                                <button
                                    onClick={() => changeMonth('next')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* 星期标题 */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* 日历网格 */}
                        <div className="grid grid-cols-7 gap-1">
                            {daysInMonth.map((day, index) => {
                                const dayTasks = getTasksForDay(day);
                                const completedCount = getCompletedTasksForDay(day);
                                const isSelected = isSameDay(day, selectedDate);
                                const isCurrentDay = isToday(day);
                                const isCurrentMonth = day.getMonth() === currentDate.getMonth();

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(day)}
                                        className={`
                      relative p-3 text-sm rounded-lg transition-all duration-200 min-h-[60px] flex flex-col items-center justify-center
                      ${isSelected
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : isCurrentDay
                                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                                                    : isCurrentMonth
                                                        ? 'hover:bg-gray-100 text-gray-700'
                                                        : 'text-gray-400'
                                            }
                    `}
                                    >
                                        <span className="font-medium">{format(day, 'd')}</span>
                                        {dayTasks.length > 0 && (
                                            <div className="mt-1 flex flex-col items-center">
                                                <div className="text-xs">
                                                    {completedCount}/{dayTasks.length}
                                                </div>
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 右侧计划管理 */}
                    <div className="space-y-6">
                        {/* 选中日期信息 */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                    <Calendar className="w-6 h-6" />
                                    {format(selectedDate, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
                                </h2>
                                {isToday(selectedDate) && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                        今天
                                    </span>
                                )}
                            </div>

                            {/* 进度统计 */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">任务进度</span>
                                    <span className="text-sm text-gray-500">
                                        {completedTasks} / {totalTasks} 已完成
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* 添加任务 */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">添加新任务</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        placeholder="输入任务内容..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                                    />
                                    <button
                                        onClick={addTask}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        添加
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <select
                                        value={selectedPriority}
                                        onChange={(e) => setSelectedPriority(e.target.value as 'low' | 'medium' | 'high')}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="low">低优先级</option>
                                        <option value="medium">中优先级</option>
                                        <option value="high">高优先级</option>
                                    </select>
                                    <input
                                        type="time"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 任务列表 */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">任务列表</h3>
                                <button
                                    onClick={analyzeWithAI}
                                    disabled={isLoadingAI || selectedDateTasks.length === 0}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {isLoadingAI ? '分析中...' : 'AI分析'}
                                </button>
                            </div>

                            {selectedDateTasks.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>这一天还没有任务，开始添加您的第一个任务吧！</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedDateTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${task.completed
                                                ? 'bg-gray-50 border-gray-200'
                                                : 'bg-white border-gray-300 hover:border-blue-300'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleTask(task.id)}
                                                className="flex-shrink-0"
                                            >
                                                {task.completed ? (
                                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                                ) : (
                                                    <Circle className="w-6 h-6 text-gray-400 hover:text-blue-500" />
                                                )}
                                            </button>

                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                    {task.title}
                                                </p>
                                                {task.time && (
                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                        <Clock className="w-3 h-3" />
                                                        {task.time}
                                                    </p>
                                                )}
                                            </div>

                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                {getPriorityText(task.priority)}
                                            </span>

                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* AI分析结果 */}
                        {aiAnalysis && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    AI智能分析
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">总结</h4>
                                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            {aiAnalysis.summary}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">建议</h4>
                                        <ul className="space-y-2">
                                            {aiAnalysis.suggestions.map((suggestion, index) => (
                                                <li key={index} className="flex items-start gap-2 text-gray-600">
                                                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App; 