const taskStatus = {
    ACTIVE: 'active',
    ARCHIVE: 'archive',
    COMPLETED: 'completed',
}

const taskStatusArray = [
    {name: taskStatus.ACTIVE, value: taskStatus.ACTIVE},
    {name: taskStatus.ARCHIVE, value: taskStatus.ARCHIVE},
    {name: taskStatus.COMPLETED, value: taskStatus.COMPLETED},
]

module.exports = {taskStatus, taskStatusArray};