export class Product {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description || "No description available";
    this.category = data.category || "Uncategorized";
    this.price = data.price;
    this.stock = data.stock;
    this.thumbnail = data.thumbnail; 
  }
}
