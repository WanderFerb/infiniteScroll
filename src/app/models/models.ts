export interface DummyJsonResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
  }
  
  export interface Product {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
  }
  
  export interface ProductsPaginator {
    items: Product[];
    page: number;
    hasMorePages: boolean;
  }