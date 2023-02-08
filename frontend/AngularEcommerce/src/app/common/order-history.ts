export class OrderHistory {

  constructor(public id: string,
              public email: string,
              public trackingNumber: string,
              public totalPrice: number,
              public totalQuantity: number,
              public dateCreated: Date) {}
}

