package todo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import todo.model.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    User findUserByLogin(String login);
}
