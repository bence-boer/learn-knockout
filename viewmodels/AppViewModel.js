import ko from 'knockout';
import { Task } from '/models/Task';
import Category from '/models/Category';

export default function AppViewModel() {
    /**
     * Array of categories of tasks.
     * @type {ko.ObservableArray<Category>}
     */
    this.categories = ko.observableArray([new Category('Uncategorized'), new Category('Work')]);

    /**
     * Name of the category the next new task is going to be put into.
     * @type {ko.Observable<string>}
     */
    this.next_category_name = ko.observable(this.categories()[0]);

    /**
     * Category the next new task is going to be put into.
     * @type {ko.Computed<Category>}
     */
    this.next_category = ko.pureComputed(() => this.category_by_name(this.next_category_name()));

    /**
     * Selected category to display.
     * @type {ko.Observable<Category>}
     */
    this.selected_category = ko.observable(this.categories()[0]);

    /**
     * Name of the selected category.
     * @type {ko.Observable<string>}
     */
    this.selected_category_name = ko.pureComputed(() => this.selected_category().name);

    /**
     * The new task to be added.
     * @type {ko.Observable<Task>}
     */
    this.next_task = ko.observable(new Task());

    /**
     * List of currently selected tasks.
     * @type {ko.PureComputed<Task[]>}
     */
    this.selected_tasks = ko.pureComputed(() => this.selected_category().tasks());

    /**
     * List of task currently being edited.
     * @type {ko.ObservableArray<Task>}
     */
    this.editable_tasks = ko.observableArray();

    /**
     * Toggles the editability of a task.
     * @param {Task} task Task to be toggled the editability of.
     */
    this.toggle_edit = (task) => {
        if (this.editable_tasks().includes(task)) this.editable_tasks.remove(task);
        else this.editable_tasks.push(task);
    };

    /**
     * Decides whether a task is editable.
     * @param {Task} task Task to be decided about if is editable.
     * @returns Whether the task is ediatable.
     */
    this.is_task_editable = (task) => this.editable_tasks().includes(task);

    /**
     * Whether the new task's content should be autofilled.
     * @type {ko.Observable<boolean>}
     */
    this.autofill = ko.observable(false);

    /**
     * Finds the category objects by it's name.
     * @param {string} category_name Name of the searched category.
     * @returns The category object with the given name.
     */
    this.category_by_name = (category_name) => this.categories().find(category => category_name === category.name);

    /**
     * Sets the displayed category.
     * @param {Category} category Category to be selected for display.
     */
    this.select_category = (category) => this.selected_category(category);

    /**
     * Decides whether the given category is the selected one.
     * @param {Category} category Category to be decided about if is the selected one.
     * @returns Whether the given category is the selected one.
     */
    this.is_selected_category = (category) => this.selected_category === category;

    /**
     * Submits current this.new_task to this.tasks observable array.
     * @param {Task} task The task to add.
     */
    this.submit_task = () => {
        this.register_task(this.next_task());
        this.select_category(this.next_category());
        this.next_task(this.create_new_task(this.autofill()));
        this.save();
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
    this.register_task = (task) => this.next_category().add_task(task);

    /**
     * Moves a task from one category to another.
     * @param {Task} task Task to be moved into a different category.
     * @param {Event} event Change event.
     */
    this.move_to_category = (task, event) => {
        this.selected_category().remove_task(task);
        this.category_by_name(event.target.value).add_task(task);
    }

    /**
     * Animates the given element into the view.
     * @param {HTMLElement} element Element containing the task added to the list.
     */
    this.appear = (element) => {
        if (element instanceof Array) element = element[1];
        if (element.nodeType !== 1) return;
        setTimeout(() => element.style.height = `${element.scrollHeight}px`, 0);
    };

    /**
     * Animates the given element out of the view.
     * @param {HTMLElement} element Element containing the task removed from the list.
     */
    this.disappear = (element) => {
        if (element.nodeType !== 1) return;
        element.style.height = '0';
        element.style.margin = '0';
        setTimeout(() => element.remove(), 350);
    };

    /**
     * Removes a task from it's containing category.
     * @param {Task} task The task to remove.
     */
    this.remove_task = (task) => this.selected_category().remove_task(task);

    /**
     * Saves task.
     * @param {Task} task The task to remove.
     * @param {Event} event Event causing the save.
     */
    this.save_task = (task, event) => {
        this.toggle_edit(task);
        if (this.is_task_editable(task)) return;

        const task_item = event.target.closest('.task-item');
        task.title = task_item.querySelector('.task-title').innerText;
        task.description = task_item.querySelector('.task-desc').innerText;

        this.save();
    };

    /**
     * Saves the current task list and last task ID to local storage.
     */
    this.save = () => {
        const unwrapped = this.categories().map(category => (
            {
                name: category.name,
                tasks: category.tasks()
            }
        ));
        
        localStorage.setItem('categories', JSON.stringify(unwrapped));
    } 

    /**
     * Loads task list, sets up subscriptions.
     */
    this.initialize = () => {
        const categories = JSON.parse(localStorage.getItem('categories') ?? '[]');

        if (categories.length > 0) this.categories(categories.map(
            ({ name, tasks }) => new Category(name, tasks.map(
                ({ title, description }) => new Task(title, description)
            ))
        ));
        // TODO: string név alapján bindolni a categoryt

        this.subscriptions = [
            this.autofill.subscribe(checked => this.next_task(this.create_new_task(checked))),
            this.selected_tasks.subscribe(console.log),
            this.selected_category.subscribe(console.log)
        ];
    };

    /**
     * Runs at the end of the user session.
     * Saves modifications. Disposes of subscriptions.
     */
    this.dispose = () => {
        this.save();
        this.subscriptions.forEach(subscription => subscription.dispose());
    }

    // Initialize viewmodel
    this.initialize();

    // Attach dispose to browser close event
    window.addEventListener('beforeunload', this.dispose);
}