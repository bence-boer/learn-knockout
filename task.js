import ko from 'knockout';

export class Task {
    /**
     * The count of created task objects.
     * @type {number}
     */
    static count = 0;

    /**
     * The unique identifier of the task.
     * @type {number}
     */
    UID;

    /**
     * The title of the task.
     * @type {string}
     */
    title;

    /**
     * The description of the task.
     * @type {string}
     */
    description;

    /**
     * Constructs a new task.
     * @param {string | undefined} title Title of the task (an empty string by default).
     * @param {string | undefined} description Description of the task (an empty string by default).
     */
    constructor(
        title = '',
        description = ''
    ) {
        this.UID = Task.count++;
        this.title = new String(title);
        this.description = new String(description);
    }

    static mock_instance = () => new Task(
        `Test Task #${Task.count}`,
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, aut! Commodi, expedita optio! Aliquam beatae explicabo soluta iste obcaecati expedita illum perspiciatis animi ea, eos sapiente modi fugiat veniam dicta corrupti quibusdam, commodi porro eveniet at velit aperiam, in molestiae voluptatibus aliquid. Vitae hic aliquid reiciendis in, laborum cum modi!'
    )
}

export class TaskView {
    /**
     * The task represented by the view.
     * @type {Task}
     */
    task;

    /**
     * Whether the task is being edited.
     * @type {ko.Observable<boolean>}
     */
    edit;

    /**
     * Constructs a new task view.
     * @param {Task} task The task represented by the view.
     */
    constructor(task = new Task()){
        this.task = task;
        this.edit = ko.observable(false);
    }

    toggle = () => this.edit(!this.edit());

    static mock_instance = () => new TaskView(Task.mock_instance());
}