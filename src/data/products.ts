export interface Product {
  id: number;
  title: string;
  dataSize: string;
  price: number;
}

const products: Product[] = [
  {
    id: 1,
    title: "Kuota XL/AXIS 120GB",
    dataSize: "120GB",
    price: 85000,
  },
  {
    id: 2,
    title: "Kuota XL/AXIS 71GB",
    dataSize: "71GB",
    price: 65000,
  },
  {
    id: 3,
    title: "Kuota XL/AXIS 59GB",
    dataSize: "59GB",
    price: 60000,
  },
  {
    id: 4,
    title: "Kuota XL/AXIS 48GB",
    dataSize: "48GB",
    price: 55000,
  }
];

export default products;
