import ko from 'knockout';
import { Task, TaskView } from './task';

export function AppViewModel() {
    /**
     * The KO observable array of tasks.
     * @type {ko.ObservableArray<TaskView>}
     */
    this.task_views = ko.observableArray([new TaskView()]);

    /**
     * The KO observable for the new task to be added.
     * @type {ko.Observable<Task>}
     */
    this.new_task = ko.observable(new Task());

    this.fill_task = ko.observable(false);


    /**
     * Submits current this.new_task to this.tasks observable array.
     * @param {TaskView} task The task to add.
     */
    this.submit_task = () => {
        this.add_task(new TaskView(this.new_task()));
        this.new_task(this.create_new_task(this.fill_task()));
    }

    /**
     * Creates a new empty or pre-filled mock task.
     * @param {boolean} autofill Whether the task properties should be autofilled.
     * @returns The new task.
     */
    this.create_new_task = (autofill) => this.fill_task() ? Task.mock_instance() : new Task();

    /**
     * Adds a task view to the 'task_views' observable array.
     * @param {TaskView} task The task to add.
     */
    this.add_task = (task) => this.task_views.unshift(task);

    /**
     * Animates the given element into the view.
     * @param {HTMLElement} element Element added to the list.
     * @param {number} index Index of added element.
     * @param {TaskView} data The task inside the appeared element.
     */
    this.appear = (element, index, data) => {
        if (element instanceof Array) element = element[1];
        if (element.nodeType !== 1) return;
        setTimeout(() => element.style.height = `${element.scrollHeight}px`, 0);
    }

    /**
     * Animates the given element out of the view.
     * @param {HTMLElement} element Element removed from the list.
     * @param {number} index Index of removed element.
     * @param {TaskView} data The task inside the appeared element.
     */
    this.disappear = (element, index, data) => {
        if (element.nodeType !== 1) return;
        element.style.height = '0';
        element.style.margin = '0';
        setTimeout(() => element.remove(), 350);
    }

    /**
     * Removes a task from the 'tasks' observable array.
     * @param {TaskView} task_view The task to remove.
     */
    this.remove_task = (task_view) => this.task_views.remove(task_view);

    /**
     * Saves task.
     * @param {TaskView} task_view The task to remove.
     * @param {Event} event Event causing the save.
     */
    this.save_task = (task_view, event) => {
        task_view.toggle();
        if(task_view.edit()) return;

        const texts_elements = event.target.parentElement.parentElement.children[0].children;
        task_view.task.title = texts_elements[0].innerText;
        task_view.task.description = texts_elements[1].innerText;
        
        this.save();
    };

    this.save = () => {
        localStorage.setItem('task_id', JSON.stringify(Task.count));
        localStorage.setItem('tasks', JSON.stringify(this.task_views().map(task_view => task_view.task)));
    }

    // Constructor
    this.initialize = function () {
        const task_count = JSON.parse(localStorage.getItem('task_id') ?? '0');
        const tasks = JSON.parse(localStorage.getItem('tasks') ?? '[]');

        Task.count = task_count;
        this.task_views(tasks.map(task => new TaskView(task)));

        this.subscriptions = [];
        this.subscriptions.push(
            this.fill_task.subscribe(checked => this.new_task(this.create_new_task(checked)))
        );
    };

    // Clean-up logic
    this.dispose = () => {
        this.save();
        this.subscriptions.forEach(subscription => subscription.dispose());
    }

    // Initialize viewmodel
    this.initialize();

    // Attach dispose to browser close event
    window.addEventListener('beforeunload', this.dispose);
}