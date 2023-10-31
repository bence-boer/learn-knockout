export class Task {
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
     * @param {string} [title = ''] Title of the task (an empty string by default).
     * @param {string} [description = ''] Description of the task (an empty string by default).
     */
    constructor(
        title = '',
        description = ''
    ) {
        this.title = title;
        this.description = description;
    }

    static mock_instance = () => new Task(
        'Test Task',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, aut! Commodi, expedita optio! Aliquam beatae explicabo soluta iste obcaecati expedita illum perspiciatis animi ea, eos sapiente modi fugiat veniam dicta corrupti quibusdam, commodi porro eveniet at velit aperiam, in molestiae voluptatibus aliquid. Vitae hic aliquid reiciendis in, laborum cum modi!'
    )
}