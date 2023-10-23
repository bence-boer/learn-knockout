import { Task } from './task';
import ko from 'knockout';

/**
 * Category, {@link Task} objects can be categorized into.
 * @param {string} [name='[category]'] Name of the category.
 * @param {Task[]} [tasks=[]] Tasks the category should be initialized with.
 */
export default function Category(name = '[category]', tasks = []) {
    /**
     * Name of the category.
     * @type {string}
     */
    this.name = name;

    /**
     * Array of tasks in the category.
     * @type {ko.ObservableArray<Task>}
     */
    this.tasks = ko.observableArray(tasks);

    /**
     * Adds a task to the category.
     * @param {Task} task The task view to add to the category.
     */
    this.add_task = (task) => {
        this.tasks.remove(task);
        this.tasks.unshift(task);
    };

    /**
     * Removes a task from the category.
     * @param {Task} taskThe task to add to the category.
     * @returns {Task[]} The tasks removed.
     */
    this.remove_task = (task) => this.tasks.remove(task);
}