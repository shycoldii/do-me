package todo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import todo.model.Section;
import todo.model.User;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section,Long> {

}
