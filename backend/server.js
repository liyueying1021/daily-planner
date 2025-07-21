const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 模拟AI分析功能（如果没有OpenAI API密钥）
const mockAIAnalysis = (tasks) => {
    const completedTasks = tasks.filter(task => task.completed);
    const highPriorityTasks = tasks.filter(task => task.priority === 'high');
    const totalTasks = tasks.length;

    let summary = '';
    let suggestions = [];

    if (totalTasks === 0) {
        summary = '您还没有添加任何任务。建议制定一个合理的计划来开始您的一天。';
        suggestions = [
            '添加一些具体的任务目标',
            '为任务设置合理的优先级',
            '考虑添加时间安排'
        ];
    } else {
        const completionRate = (completedTasks.length / totalTasks * 100).toFixed(1);

        if (completionRate >= 80) {
            summary = `太棒了！您已经完成了${completionRate}%的任务，效率很高！继续保持这种状态。`;
            suggestions = [
                '继续保持高效率的工作节奏',
                '考虑为明天制定更挑战性的目标',
                '适当奖励自己的优秀表现'
            ];
        } else if (completionRate >= 50) {
            summary = `您已经完成了${completionRate}%的任务，进度不错。还有提升空间。`;
            suggestions = [
                '优先处理剩余的高优先级任务',
                '检查是否有任务需要调整时间安排',
                '考虑将大任务分解为小任务'
            ];
        } else {
            summary = `目前完成了${completionRate}%的任务，建议重新审视计划安排。`;
            suggestions = [
                '重新评估任务优先级',
                '考虑减少任务数量或调整时间安排',
                '将复杂任务分解为更小的步骤'
            ];
        }

        if (highPriorityTasks.length > 0) {
            const highPriorityCompleted = highPriorityTasks.filter(task => task.completed).length;
            if (highPriorityCompleted < highPriorityTasks.length) {
                suggestions.push('建议优先完成剩余的高优先级任务');
            }
        }

        if (tasks.some(task => task.time)) {
            suggestions.push('注意检查时间安排是否合理');
        }
    }

    return {
        summary,
        suggestions
    };
};

// API路由
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: '服务器运行正常' });
});

app.post('/api/analyze', async (req, res) => {
    try {
        const { tasks } = req.body;

        if (!tasks || !Array.isArray(tasks)) {
            return res.status(400).json({ error: '无效的任务数据' });
        }

        // 如果有OpenAI API密钥，使用真实的AI分析
        if (process.env.OPENAI_API_KEY) {
            const OpenAI = require('openai');
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            const taskDescription = tasks.map(task =>
                `- ${task.title} (优先级: ${task.priority}, 状态: ${task.completed ? '已完成' : '未完成'}${task.time ? `, 时间: ${task.time}` : ''})`
            ).join('\n');

            const prompt = `请分析以下每日计划任务，并提供总结和建议：

任务列表：
${taskDescription}

请用中文回答，包含：
1. 总体总结（100字以内）
2. 3-5条具体建议

请以JSON格式返回：
{
  "summary": "总结内容",
  "suggestions": ["建议1", "建议2", "建议3"]
}`;

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            const response = completion.choices[0].message.content;
            let aiAnalysis;

            try {
                aiAnalysis = JSON.parse(response);
            } catch (e) {
                // 如果AI返回的不是有效JSON，使用模拟分析
                aiAnalysis = mockAIAnalysis(tasks);
            }

            res.json(aiAnalysis);
        } else {
            // 使用模拟AI分析
            const analysis = mockAIAnalysis(tasks);
            res.json(analysis);
        }
    } catch (error) {
        console.error('AI分析错误:', error);
        // 返回模拟分析作为后备
        const analysis = mockAIAnalysis(req.body.tasks || []);
        res.json(analysis);
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`健康检查: http://localhost:${PORT}/api/health`);
    if (!process.env.OPENAI_API_KEY) {
        console.log('注意: 未设置OPENAI_API_KEY，将使用模拟AI分析功能');
    }
}); 