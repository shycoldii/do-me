package todo.model;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum Status {
    NOTDONE("Не сделано"), DONE("Сделано");
    private final String value;
}
