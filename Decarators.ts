class Employee {
    @Trim
    name: string;
    constructor(name: string) {
      this.name = name;
    }
  };
  
  let c = new Employee('employee1                  ');
  console.log(c.name);
  
  c.name = 'emp1';
  
  console.log(c.name);
  
  
  let d = new Employee('employee2                       ');
  
  console.log(d.name);
  
  function Trim(target: any, key: string) {
      let val = target[key];
      const getter = () => val;
      const setter = (newVal: string) => { val = newVal.trim()};
      Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
      });
    }
  
  
  
  class Cart {
      items = ['item1', 'item2'];
      @ConfirmDecorator('Do you want to remove all?')
      removeAll() {
        this.items = [];
      }
  
      addItem(item: string) {
        this.items.push(item)
      }
  }
  
  function ConfirmDecorator(text: string) {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
      const originalVal = target[key];
      descriptor.value = function(...args: any[]) {
        const allow = confirm(text);
        if(allow) {
          originalVal.apply(this, args);
          return alert('deleted successfully');
        } else {
          return null;
        }
      }
    }
  }
  
  let cart1 = new Cart();
  console.log(cart1.items);
  cart1.removeAll();
  console.log(cart1.items);