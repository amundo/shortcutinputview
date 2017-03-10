class ShortcutInputView {
  constructor({el, rules}){
    this.el = el;
    this._rules = rules || [];
    this.sortRules();

    this.render();
    //this.update();
    this.listen();
  }

  load(url){
    fetch(url)
      .then(r => r.json())
      .then(rules => rules.forEach(rule => this._rules.push(rule)))
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
    <table class=rules>
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
        </tr>
        <tr class=addRule>
          <th><input class=from></th>
          <th><input class=to><button class=addRule>+</button></th>
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

  addRule(){
    let from = this.el.querySelector('input.from');
    let to   = this.el.querySelector('input.to');

    this._rules.push([from.value,to.value]);
    [from,to].forEach(input => input.value = '');
    this.renderRules();
    from.focus();
  }

  toggleRules(){  
    this.el.querySelector('.overlay').classList.toggle('hidden');
  }

  listen(){
    this.addRuleButton.addEventListener('click', () => this.addRule())
    this.controlsButton.addEventListener('click', ev => this.toggleRules(ev))
    this.input.addEventListener('keyup', () => this.run())
  }
}



