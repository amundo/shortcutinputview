class ShortcutInputView {
  constructor({el, rules}){
    this.el = el;
    this._rules = rules || [];
    this._aliases = [];
    this.sortRules();

    this.render();
    this.load();
    this.listen();
  }

  load(){
    fetch('../convert/js/subfile.json')
      .then(r => r.json())
      .then(aliases => this._aliases = aliases)
  }

  set aliases(aliases) {
    this._aliases = aliases;
  }

  get aliases() {
    return this._aliases;
  }

  set rules(rules) {
    this._rules = rules;
  }

  get rules() {
    return this._rules;
  }

  get input() {
    return this.el.querySelector('input') 
  }

  get controlsButton() {
    return this.el.querySelector('button.controls') 
  }

  sortRules(){
    this._rules.sort((a,b) => b[0].length - a[0].length)
  }

  render(){
    let input = this.el;

    let template = `
  <div class=shortcutInput>
    <button class=controls>⚙</button>
  </div>
  <div class="hidden overlay">
    <button class=closeOverlay>close</button>
    <table class=rules>
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
        </tr>
        <tr class=addRule>
          <th><input class=from></th>
          <th>
            <div style=display:flex; class=inputWithButton>
              <input class=to>
              <button class=addRule>+</button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>
`;

    let div = document.createElement('div');
    div.classList.add('shortcut');

    input.parentNode.insertBefore(div, input);
    div.innerHTML = template;
    div.querySelector('.shortcutInput').appendChild(input);
    this.el = div;
    this.renderRules();
  }

  renderRules(){
    let tbody = this.el.querySelector('tbody');
    tbody.innerHTML = '';
    this._rules
      .map(([before,after]) => `<tr><td>${before}</td><td>${after}</td></tr>`)
      .forEach(tr => tbody.insertAdjacentHTML('afterbegin', tr));
  }

  run(clickEvent){
    let value = this.input.value;
    this._rules.forEach(([before, after]) => {
      let beforeRE = new RegExp(before, 'g');
      value = value.replace(beforeRE, after)
    })
    this.input.value = value;
  }

  get addRuleButton(){
    return this.el.querySelector('button.addRule');
  }

  get fromInput(){
    return this.el.querySelector('input.from');
  }
  get toInput(){
    return this.el.querySelector('input.to');
  }

  addRule(){
    this._rules.push([this.fromInput.value, this.toInput.value]);
    [this.fromInput, this.toInput].forEach(input => input.value = '');
    this.renderRules();
    this.fromInput.focus();
  }

  toggleRules(){  
    this.el.querySelector('.overlay').classList.toggle('hidden');
  }

  listen(){
    this.addRuleButton.addEventListener('click', () => this.addRule())
    this.controlsButton.addEventListener('click', ev => this.toggleRules(ev))
    this.input.addEventListener('keyup', () => this.run())
    document.addEventListener('keyup', keyupEvent => this.toggleRules)
  }
}



