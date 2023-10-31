import ko from 'knockout';
import { Task } from '/models/Task';
import * as store from '../util/Store';

export default function TaskCreatorViewModel() {
    /**
     * Array of categories of tasks.
     * @type {ko.PureComputed<string>}
     */
    this.categories = store.category_names;

    /**
     * Name of the category the next new task is going to be put into.
     * @type {ko.Observable<string>}
     */
    this.next_category_name = ko.observable(this.categories()[0]);

    /**
     * The new task to be added.
     * @type {ko.Observable<Task>}
     */
    this.next_task = ko.observable(new Task());

    /**
     * Whether the new task's content should be autofilled.
     * @type {ko.Observable<boolean>}
     */
    this.autofill = ko.observable(false);

    /**
     * Submits current this.new_task to this.tasks observable array.
     * @param {Task} task The task to add.
     */
    this.submit_task = () => {
        this.register_task(this.next_task());
        this.next_task(this.create_new_task(this.autofill()));
    };

    /**
     * Creates a new empty or pre-filled mock task.
     * @param {boolean} autofill Whether the task properties should be autofilled.
     * @returns The new task.
     */
    this.create_new_task = (autofill) => autofill ? Task.mock_instance() : new Task();

    /**
     * Adds a task to the selected category observable array.
     * @param {Task} task The task to add.
     */
    this.register_task = (task) => store.add_task(task, this.next_category_name());

    /**
     * Loads task list, sets up subscriptions.
     */
    this.initialize = () => {
        this.subscriptions = [
            this.autofill.subscribe(checked => this.next_task(this.create_new_task(checked))),
            store.selected_category_name.subscribe(category => this.next_category_name(category))
        ];
    };

    /**
     * Runs at the end of the user session.
     * Saves modifications. Disposes of subscriptions.
     */
    this.dispose = () => {
        this.subscriptions.forEach(subscription => subscription.dispose());
    }

    // Initialize viewmodel
    this.initialize();

    // Attach dispose to browser close event
    window.addEventListener('beforeunload', this.dispose);
}