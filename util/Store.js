import ko from "knockout";
import { Task } from "../models/task";
import Category from "../models/Category";
import { save_categories } from "./IO";

/**
 * Categories available.
 * @type {ko.ObservableArray<Category>}
 */
const categories = ko.observableArray();

/**
  * Gets category object by its name.
  * @param {string} target_name Target category's name.
  * @returns Category object matching the name.
  */
const category_by_name = (target_name) => categories().find(category => target_name === category.name);

/**
 * Name of the currently selected category.
 * @type {ko.Observable<string>}
 */
export const selected_category_name = ko.observable('Uncategorized');

/**
 * The currently selected category.
 * @type {ko.Observable<Category>}
 */
const selected_category = ko.pureComputed(() => category_by_name(selected_category_name()));

/**
 * Names of categories available.
 * @type {ko.PureComputed<string>}
 */
export const category_names = ko.pureComputed(() => categories().map(category => category.name));

/**
  * Tasks of currently selected category.
  * @type {ko.pureComputed<Task[]>}
  */
export const selected_tasks = ko.pureComputed(() => selected_category().tasks());

/**
 * Adds a task to a category.
 * @param {Task} task Task to add.
 * @param {string} category Name of the category to add the task to.
 */
export function add_task(task, category = selected_category_name()) {
    category_by_name(category).add_task(task);
    save();
}

/**
 * Removes a task from a category.
 * @param {Task} task Task to remove.
 * @param {string} category Name of the category to remove the task from.
 */
export function remove_task(task, category = selected_category_name()) {
    category_by_name(category).remove_task(task);
    save();
}

/**
 * Moves a task from one category to another.
 * @param {Task} task Task to move.
 * @param {string} from Name of the category to remove the task from.
 * @param {string} to Name of the category to add the task to.
 */
export function move_task(task, from, to) {
    remove_task(task, from);
    add_task(task, to);
}

/**
 * Adds a category to the array of categories.
 * @param {string} name Name of the category.
 */
export function add_category(name) {
    if (category_by_name(name)) return;
    categories.push(new Category(name));
    save();
}

/**
 * Removes a category.
 * @param {string} name Name of the category to remove.
 */
export function remove_category(name = selected_category()) {
    const category_to_remove = category_by_name(name);
    const uncategorized = category_by_name('Uncategorized');
    if (!category_to_remove || category_to_remove === uncategorized) return;

    uncategorized.tasks.unshift(...category_to_remove.tasks());
    select_category('Uncategorized');
    categories.remove(category_to_remove);
    save();
}

/**
 * Selects a category.
 * @param {string} name Name of the category.
 */
export function select_category(name) {
    if (!category_by_name(name)) return;
    selected_category_name(name);
}

export function is_selected_category(name) {
    return selected_category_name === name;
}

/**
 * Loads categories into the store.
 * @param {Category[]} categories_to_load Categories to load.
 */
export function load_categories(categories_to_load) {
    categories(categories_to_load);
}

export function save() {
    save_categories(categories);
}