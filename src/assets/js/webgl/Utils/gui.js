import GUI from 'lil-gui';

class SingletonGUI extends GUI {
  static get instance() {
    if (!this.gui)
      this.gui = new SingletonGUI();
      return this.gui;
  }

  static get hasInstance() {
    return !!this.gui;
  }

  constructor() {
    super();
  }

  destroy() {
    super.destroy();
    SingletonGUI.gui = undefined;
  }

}

export const { instance: gui, hasInstance } = SingletonGUI;
