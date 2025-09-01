export type TokenStatus = 'Pending' | 'Served';

export interface Token {
  id: string;
  itemName: string;
  price: number;
  status: TokenStatus;
  createdAt: Date;
}
