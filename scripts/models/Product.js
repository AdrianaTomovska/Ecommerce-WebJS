export class Product {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.price = data.price;
    this.stock = data.stock;
    this.thumbnail = data.thumbnail; 
  }
}
