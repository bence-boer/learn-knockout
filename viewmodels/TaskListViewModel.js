import ko from 'knockout';
import * as store from '../util/Store';


export default function TaskListViewModel() {
    /**
     * List of tasks to display.
     * @type {ko.PureComputed<Task[]>}
     */
    this.selected_tasks = store.selected_tasks;

    /**
     * List of task currently being edited.
     * @type {ko.ObservableArray<Task>}
     */
    this.editable_tasks = ko.observableArray();

    /**
     * List categories.
     * @type {ko.PureComputed<string[]>}
     */
    this.categories = store.category_names;

    /**
     * Name of the currently displayed category.
     * @type {ko.Observable<string>}
     */
    this.selected_category_name = store.selected_category_name;

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
     * Moves a task from one category to another.
     * @param {Task} task Task to be moved into a different category.
     * @param {Event} event Change event.
     */
    this.move_to_category = (task, event) => store.move_task(task, this.selected_category_name(), event.target.value);

    
    /**
     * Removes a task from it's containing category.
     * @param {Task} task The task to remove.
    */
   this.remove_task = (task) => store.remove_task(task);
   
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
      
      store.save();
    };
    
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
     * Loads task list, sets up subscriptions.
     */
    this.initialize = () => {
        this.subscriptions = [];
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