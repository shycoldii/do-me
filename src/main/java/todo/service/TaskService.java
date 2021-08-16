package todo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import todo.model.Task;
import todo.repository.TaskRepository;

import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public void changeOrder(List<Task> tasks) {
        for(Task task: tasks){
            Task originalTask = taskRepository.getOne(task.getId());
            originalTask.setOrderNum(task.getOrderNum());
            taskRepository.save(originalTask);
        }
    }
}
