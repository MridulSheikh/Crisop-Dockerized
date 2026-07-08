export type TUser = {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: "admin" | "manager" | "user" | "super";
};

export type TImage = {
  url: string;
  public_id: string;
};

export type TUserBuilderQueries = {
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: TUser[];
  };
};

export type TWareHouse = {
  _id: string;
  name: string;
  location: string;
  capacity: number;
};

export type TWareHouseBuilderQueries = {
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: TWareHouse[];
  };
};

export type TStock = {
  _id: string;
  productName: string;
  sku: string;
  quantity: number;
  warehouse: TWareHouse;
  isDeleted?: boolean;
  unit: string;
};

export type TCategory = {
  _id: string;
  name: string;
  description: string;
  productsCount: number;
};

export type TStockBuilderQueries = {
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: TStock[];
  };
};

export type TCategoryQueryBuilder = {
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: TCategory[];
  };
};

export type TBrand = {
  _id: string;
  name: string;
  img?: TImage;
  productsCount?: number;
  isDeleted?: boolean;
};

export type TBrandQueryBuilder = {
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: TBrand[];
  };
};

export type TProductImage = {
  url: string;
  public_id: string;
};

export type TProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock: TStock;
  category: TCategory;
  tags?: string[];
  images: TProductImage[];
  isFeatured?: boolean;
  brand?: TBrand | string;
  isDeleted: boolean;
  isPublished: boolean;
};

export type TProductBuilderQueries = {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: TProduct[];
};
