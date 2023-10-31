import ko from 'knockout';
import * as store from './util/Store'
import * as IO from './util/IO';
import CategoriesViewModel from './viewmodels/CategoriesViewModel';
import TaskCreatorViewModel from './viewmodels/TaskCreatorViewModel';
import TaskListViewModel from './viewmodels/TaskListViewModel';

store.load_categories(IO.load_categories());

const create_task = new TaskCreatorViewModel();
const categories = new CategoriesViewModel();
const task_list = new TaskListViewModel();

ko.applyBindings(create_task, document.querySelector('header'));
ko.applyBindings(categories, document.querySelector('.categories'));
ko.applyBindings(task_list, document.querySelector('.task-list'));