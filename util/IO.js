import ko from 'knockout';
import Category from '/models/Category';
import {Task} from '/models/Task';

/**
 * Loads locally saved categories into passed in observablearray.
 * @param {ko.ObservableArray<Category>} [categories=ko.observableArray()] Category observablearray to load categories into.
 */
export function load_categories() {
    const loaded_categories = JSON.parse(localStorage.getItem('categories') ?? '[]');

    return loaded_categories.map(
        ({ name, tasks }) => new Category(name, tasks.map(
            ({ title, description }) => new Task(title, description)
        ))
    );
}

/**
 * Saves passed in category observablearray into local storage.
 * @param {ko.ObservableArray<Category>} categories ObservableArray to save categories from.
 */
export function save_categories(categories) {
    const unwrapped = categories().map(category => (
        {
            name: category.name,
            tasks: category.tasks()
        }
    ));

    localStorage.setItem('categories', JSON.stringify(unwrapped));
}