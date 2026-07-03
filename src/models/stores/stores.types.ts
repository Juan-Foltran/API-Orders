export type DataRequest = {
  userId: number;
  nameStore: string;
  contactEmail: string;
  cnpj: string;
  storeAddress: string;
  category: string;
};

export type createProduct = {
  idStore: number;
  title: string;
  description: string;
  price: number;
};
