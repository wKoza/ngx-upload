import 'jest-preset-angular/setup-jest';
Object.defineProperty(window, 'DragEvent', {
  value: class DragEvent {}
});
Object.defineProperty(window, 'DataTransfer', {
  value: class DataTransfer {}
});
