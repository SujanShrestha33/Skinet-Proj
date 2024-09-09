import { Component, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';
import { Product } from 'src/app/shared/Models/product';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'xng-breadcrumb/lib/types/breadcrumb';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product? : Product;
  quantity = 1;
  quantityInBasket = 0;

  constructor(private shopService : ShopService, private activatedRoute : ActivatedRoute, private bcService : BreadcrumbService, private basketService : BasketService) {
    this.bcService.set('@productDetails', ' ');
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id) this.shopService.getProduct(+id).subscribe({
      next : response => {
        this.product = response;
        this.bcService.set('@productDetails', this.product.name);
        this.basketService.basketSource$.pipe(take(1)).subscribe({
          next: basket => {
            const item = basket?.items.find(x => x.id === +id);
            if(item) {
              this.quantity = item.quantity;
              this.quantityInBasket = item.quantity;
            }
          },
          error: error => console.log(error)
        })
      },
      error : error => console.log(error)
    })
  }

}
