package todo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import todo.model.Section;
import todo.model.Status;
import todo.model.Task;
import todo.model.User;
import todo.repository.SectionRepository;
import todo.repository.TaskRepository;
import todo.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class SectionService {
    @Autowired
    private SectionRepository sectionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TaskRepository taskRepository;
    public Section addSection(Section section) {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByLogin(login);
        List<Section> sections = user.getSections();
        for(Section s:sections){
            if (s.getName().equals(section.getName())){
                return null;
            }
        }
        sections.add(section);
        user.setSections(sections);
        userRepository.save(user);
        return section;
    }
    public List<Section> findSectionsByLogin(String login){
        User user = userRepository.findUserByLogin(login);
        List<Section> sections;
        try{
            sections = user.getSections();
        }
        catch(NullPointerException nullPointerException){
           sections = new ArrayList<>();
        }
        return sections;
    }

    public void deleteSection(Long sectionId) {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByLogin(login);
        user.getSections().remove(sectionRepository.getOne(sectionId));
        userRepository.save(user);
        sectionRepository.deleteById(sectionId);
    }

    public Section putSection(Section section) {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findUserByLogin(login);
        List<Section> sections = user.getSections();
        for(Section s:sections){
            if(s.getId().equals(section.getId())){
                s.setName(section.getName());
                s.setDescription(section.getDescription());
                user.setSections(sections);
                userRepository.save(user);
                return s;
            }
        }
        return null;
    }

    public List<Task> findTasksBySectionId(Long id) {
        return sectionRepository.getOne(id).getTasks();
    }

    public String findSectionNameById(Long id) {
        return  sectionRepository.getOne(id).getName();
    }

    public List<Task> addTask(Long id, String taskName) {
        Section section = sectionRepository.getOne(id);
        List<Task> tasks =section.getTasks();
        for(Task task: tasks){
            if(task.getName().equals(taskName)){
                return tasks;
            }
        }
        Task newTask = new Task();
        newTask.setName(taskName);
        newTask.setOrderNum(tasks.size());
        newTask.setStatus(Status.NOTDONE);
        tasks.add(newTask);
        section.setTasks(tasks);
        sectionRepository.save(section);
        return tasks;
    }

    public List<Task> deleteTask(Long id, Long sectionId) {
        Section section = sectionRepository.getOne(sectionId);
        List<Task> tasks =section.getTasks();
        Task currentTask = taskRepository.getOne(id);
        for(Task task: tasks){
            if (task.getOrderNum()>currentTask.getOrderNum()){
                task.setOrderNum(task.getOrderNum()-1);
            }
        }
        tasks.removeIf(task -> task.getId().equals(id));
        section.setTasks(tasks);
        sectionRepository.save(section);
        return tasks;
    }

    public List<Task> changeStatus(Long id, Long sectionId,String status) {
        Section section = sectionRepository.getOne(sectionId);
        List<Task> tasks =section.getTasks();
        Task currentTask = taskRepository.getOne(id);
       for(Task task: tasks){
           if(status.equals(Status.NOTDONE.toString())&&task.getOrderNum()>currentTask.getOrderNum()){
               task.setOrderNum(task.getOrderNum()-1);
           }
           if(task.getId().equals(id)){
               if (status.equals(Status.NOTDONE.toString())){
                   task.setStatus(Status.DONE);
               }
               else{
                   task.setOrderNum(tasks.size()-1);
                   task.setStatus(Status.NOTDONE);
               }

           }
       }
        section.setTasks(tasks);
        sectionRepository.save(section);
        return tasks;
    }
}
