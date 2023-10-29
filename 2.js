"use strict";

/*
###Задание 2
Вы управляете рестораном, в котором работают разные повара, специализирующиеся 
на определенных блюдах. Клиенты приходят и делают заказы на разные блюда.
Необходимо реализовать функцию newOrder. Создавать вспомогательные функции, 
коллекции, не запрещается. Старайтесь использовать коллекции Map/Set, где это 
актуально. Представленный ниже код должен работать.

Повара и их специализации:
Олег - специализация: Пицца.
Андрей - специализация: Суши.
Анна - специализация: Десерты.

Блюда, которые могут заказать посетители:
Пицца "Маргарита"
Пицца "Пепперони"
Пицца "Три сыра"
Суши "Филадельфия"
Суши "Калифорния"
Суши "Чизмаки"
Суши "Сеякемаки"
Десерт Тирамису
Десерт Чизкейк
*/

const cooksData = new Map().set('Пицца', 'Олег')
  .set('Суши', 'Андрей')
  .set('Десерт', 'Анна');


const dishesData = new Map().set('Маргарита', 'Пицца')
  .set('Пепперони', 'Пицца')
  .set('Три сыра', 'Пицца')
  .set('Филадельфия', 'Суши')
  .set('Калифорния', 'Суши')
  .set('Чизмаки', 'Суши')
  .set('Сеякемаки', 'Суши')
  .set('Тирамису', 'Десерт')
  .set('Чизкейк', 'Десерт');

// Посетитель ресторана.
class Client {
  constructor(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
}

// Вам необходимо реализовать класс, который управляет заказами и поварами.
class Manager {
  constructor(cooks, dishes) {
    this.cooks = cooks;
    this.dishes = dishes;
    this.orders = new Map();
  }
  newOrder(client, ...args){
      this.checkDishes(...args);
      this.createOrder(client, ...args);
      this.consoleOrder(client);
  }

  /**
   * Заносит заказ клиента в orders, суммирует с предыдущими заказами 
   * @param {Client} client 
   * @param  {...any} args 
   */
  createOrder(client, ...args){
    if (this.orders.has(client)){
      const order = this.orders.get(client);
      for (const iterator of args) {
        order.set(iterator.name, (+order.get(iterator.name) || 0) + iterator.quantity);      
      }
    }
    else{
      const order = new Map();
      for (const iterator of args) {
        order.set(iterator.name, iterator.quantity);
      }
      this.orders.set(client, order);
    } 
  }  

  /**
   * Проверка списка блюд на наличие в меню
   * @param  {...any} args 
   * @returns {boolean}
   */
  checkDishes(...args){
    for (const dish of args) {
      if (!this.dishes.has(dish.name)){
        throw new Error(`${dish.type} "${dish.name}" - такого блюда не существует.`)
      }
    } 
  }

  /**
   * Выводит в консоль весь заказ клиента
   * @param {Client} client 
   */
  consoleOrder(client){
    console.log(`Клиент ${client.firstname} заказал:`);
    const order = this.orders.get(client);
    for (const [name, quantity] of order.entries()) {
      const type = this.dishes.get(name);
      console.log(`${type} "${name}" - ${quantity}; готовит повар ${this.cooks.get(type)}`)
    }
  }
}

// Можно передать внутрь конструктора что-либо, если необходимо.
const manager = new Manager(cooksData, dishesData);

// Вызовы ниже должны работать верно, менять их нельзя, удалять тоже.
manager.newOrder(
  new Client("Иван", "Иванов"), 
  { name: "Маргарита", quantity: 1, type: "Пицца" },
  { name: "Пепперони", quantity: 2, type: "Пицца" },
  { name: "Чизкейк", quantity: 1, type: "Десерт" },
);
// Вывод:
// Клиент Иван заказал: 
// Пицца "Маргарита" - 1; готовит повар Олег
// Пицца "Пепперони" - 2; готовит повар Олег
// Десерт "Чизкейк" - 1; готовит повар Анна

// ---

const clientPavel = new Client("Павел", "Павлов");
manager.newOrder(
  clientPavel, 
  { name: "Филадельфия", quantity: 5, type: "Суши" },
  { name: "Калифорния", quantity: 3, type: "Суши" },
);
// Вывод:
// Клиент Павел заказал: 
// Суши "Филадельфия" - 5; готовит повар Андрей
// Суши "Калифорния" - 3; готовит повар Андрей

manager.newOrder(
  clientPavel, 
  { name: "Калифорния", quantity: 1, type: "Суши" },
  { name: "Тирамису", quantity: 2, type: "Десерт" },
);
// Вывод:
// Клиент Павел заказал: 
// Суши "Филадельфия" - 5; готовит повар Андрей
// Суши "Калифорния" - 4; готовит повар Андрей
// Десерт "Тирамису" - 2; готовит повар Анна

manager.newOrder(
  clientPavel, 
  { name: "Филадельфия", quantity: 1, type: "Суши" },
  { name: "Трубочка с вареной сгущенкой", quantity: 1, type: "Десерт" },
);
// Ничего не должно быть добавлено, должна быть выброшена ошибка:
// Десерт "Трубочка с вареной сгущенкой" - такого блюда не существует.