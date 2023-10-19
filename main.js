import ko from 'knockout';

function AppViewModel() {
  this.name = ko.observable('World');
}

ko.applyBindings(new AppViewModel());