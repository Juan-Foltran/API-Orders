//create new request
export type DataRequest = {
  userId: number;
  nameStore: string;
  contactEmail: string;
  cnpj: string;
  storeAddress: string;
  category: string;
};

//create product type
export type createProduct = {
  idStore: number;
  title: string;
  description: string;
  price: number;
};

//delete product type
export type deleteProduct = {
  storeId: number;
  poductId: number;
};

//update product type
export type updateProduct = {
  storeId: number;
  id: number;
  title?: string | undefined;
  description?: string | undefined;
  price?: number | undefined;
};
