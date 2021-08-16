package todo.model;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @NonNull private String name;

    @Enumerated(EnumType.STRING)
    private Status status;

    @NonNull private Integer orderNum;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    Date creationDateTime;


    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date modifyDate;

    private LocalDateTime deadline;

}
