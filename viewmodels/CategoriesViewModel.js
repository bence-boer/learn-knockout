import ko from 'knockout';
import * as store from '../util/Store';

/**
 * ViewModel for the category picker and creator section.
 */
export default function CategoriesViewModel() {
    /**
     * Name of the currently displayed category.
     * @type {ko.Observable<string>}
     */
    this.category_names = store.category_names;

    /**
     * Name of the currently displayed category.
     * @type {ko.Observable<string>}
     */
    this.selected_category_name = store.selected_category_name;

    /**
     * Whether the new category input is focused.
     * @type {ko.Observable<boolean>}
     */
    this.input_focused = ko.observable(false);

    /**
     * Adds inputted category.
     * @param {HTMLFormElement} form Form element containing the name of the new category.
     */
    this.add_category = (form) => {
        store.add_category(form.category.value);
        this.focus_input();
    }

    /**
     * Removes currently selected category.
     */
    this.remove_selected_category = () => store.remove_category(this.selected_category_name());

    /**
     * Sets the displayed category.
     * @param {string} name Name of the category to be selected for display.
     */
    this.select_category = (name) => store.select_category(name);

    /**
     * Toggles whether the input is focused.
     */
    this.focus_input = () => this.input_focused(!this.input_focused());
}