import { Component, OnInit } from '@angular/core';
import {OrderHistory} from "../../common/order-history";
import {OrderHistoryService} from "../../services/order-history.service";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {

    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    console.log("email:"+theEmail);

    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      }
    );
  }

}
