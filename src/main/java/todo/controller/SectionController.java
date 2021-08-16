package todo.controller;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import todo.model.Section;
import todo.model.Task;
import todo.service.SectionService;
import todo.service.TaskService;
import java.util.List;

@RestController
@RequestMapping("/api/section")
@CrossOrigin(origins = {"http://localhost:3000"})
public class SectionController {

    @Autowired
    private SectionService sectionService;

    @Autowired
    private TaskService taskService;

    @PostMapping
    @ResponseBody
    public ResponseEntity<String> addSection(@RequestBody Section section) throws JSONException {
        Section result = sectionService.addSection(section);
        JSONObject jsonObject = new JSONObject();
        if(result!=null){
            jsonObject.put("message", "Successful");
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
        }
        jsonObject.put("message", "There is already a section with that name!");
        return new ResponseEntity<>(jsonObject.toString(), HttpStatus.BAD_REQUEST);

    }
    @PutMapping
    @ResponseBody
    public ResponseEntity<String> editSection(@RequestBody Section section) throws JSONException {
        Section result = sectionService.putSection(section);
        JSONObject jsonObject = new JSONObject();
        if(result!=null){
            jsonObject.put("message", "Successful");
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
        }
        jsonObject.put("message", "Section not found");
        return new ResponseEntity<>(jsonObject.toString(), HttpStatus.BAD_REQUEST);

    }
    @GetMapping("/user")
    public ResponseEntity<List<Section>> findSectionsByLogin() {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        return new ResponseEntity<>(sectionService.findSectionsByLogin(login), HttpStatus.OK);
   }
    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> findTasksBySectionId(@RequestParam Long id) {
        return new ResponseEntity<>(sectionService.findTasksBySectionId(id), HttpStatus.OK);
    }
    @PostMapping("/tasks")
    public ResponseEntity<List<Task>> addTask(@RequestParam Long id,@RequestParam String name) {
        return new ResponseEntity<>(sectionService.addTask(id,name), HttpStatus.OK);
    }
    @DeleteMapping("/tasks")
    public ResponseEntity<List<Task>> deleteTaskById(@RequestParam Long id,@RequestParam Long sectionId) {
        return new ResponseEntity<>(sectionService.deleteTask(id,sectionId),HttpStatus.OK);
    }
    @PutMapping("/tasks")
    public ResponseEntity<List<Task>> changeStatus(@RequestParam Long id,@RequestParam Long sectionId,@RequestParam String status) {
        return new ResponseEntity<>(sectionService.changeStatus(id,sectionId,status),HttpStatus.OK);
    }
    @PutMapping("/tasks/all")
    @ResponseBody
    public ResponseEntity<List<Task>> changeStatus(@RequestBody List<Task> tasks,@RequestParam Long sectionId) {
        taskService.changeOrder(tasks);
        return new ResponseEntity<>(sectionService.findTasksBySectionId(sectionId),HttpStatus.OK);
    }
    @DeleteMapping
    @ResponseBody
    public ResponseEntity<String> deleteSectionById(@RequestParam Long id) {
        sectionService.deleteSection(id);
        return new ResponseEntity<>("Successful",HttpStatus.OK);
    }
    @GetMapping
    @ResponseBody
    public ResponseEntity<String> findSectionName(@RequestParam Long id) {
        return new ResponseEntity<>(sectionService.findSectionNameById(id),HttpStatus.OK);
    }
}
