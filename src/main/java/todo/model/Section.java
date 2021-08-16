package todo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Section {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String name;

    @CreationTimestamp
    @NonNull
    @Temporal(TemporalType.TIMESTAMP)
    Date creationDateTime;

    private String description;

    @UpdateTimestamp
    @NonNull
    @Temporal(TemporalType.TIMESTAMP)
    private Date modifyDate;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private List<Task> tasks;

}
