import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { Product } from '../shared/Models/product';
import { Brand } from '../shared/Models/brand';
import { Type } from '../shared/Models/type';
import { ShopParams } from '../shared/Models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search') searchTerm? : ElementRef;
  products : Product[] = [];
  brands : Brand[] = [];
  types : Type[] = [];
  brandIdSelected = 0;
  typeIdSelected = 0;
  sortSelected = 'name';
  sortOptions = [
    {name: 'Alphabetical', value : 'name'},
    {name: 'Price: Low to High', value : 'priceAsc'},
    {name: 'Price: High to Low', value : 'priceDesc'}
  ]
  shopParams = new ShopParams();
  totalCount = 0;

  constructor(private shopService : ShopService){

  }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
      next : response => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        console.log(response.pageSize);
        console.log(this.shopParams.pageSize)
        this.totalCount = response.count;
      },
      error : error => console.log(error),
      complete : () => {}
    })
  }

  getBrands(){
    this.shopService.getBrand().subscribe({
      next : response => this.brands = [{id: 0, name: 'All'}, ...response],
      error : error => console.log(error),
      complete : () => {}
    })
  }

  getTypes(){
    this.shopService.getType().subscribe({
      next : response => this.types = [{id:0, name: 'All'}, ...response],
      error : error => console.log(error),
      complete : () => {}
    })
  }

  onBrandSelected(brandId : number){
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId : number){
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(event : any){
    this.shopParams.sort = event.target.value;
    this.getProducts();
  }

  onPageChanged(event : any){
    if (this.shopParams.pageNumber != event){
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch(){
    this.shopParams.search = this.searchTerm?.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams;
    this.getProducts();
  }

}
