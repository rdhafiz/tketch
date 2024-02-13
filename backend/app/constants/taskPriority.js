const taskPriority = {
    HIGHEST: 'highest',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
    LOWEST: 'lowest',
}

const taskPriorityArray = [
    {name: taskPriority.HIGHEST, value: taskPriority.HIGHEST},
    {name: taskPriority.HIGH, value: taskPriority.HIGH},
    {name: taskPriority.MEDIUM, value: taskPriority.MEDIUM},
    {name: taskPriority.LOW, value: taskPriority.LOW},
    {name: taskPriority.LOWEST, value: taskPriority.LOWEST},
]

module.exports = {taskPriority, taskPriorityArray};