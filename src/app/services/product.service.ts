import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../product/product.model';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  createProduct(product: Product): Observable<Product> {
    const url = this.environmentService.getApiEndpoint('createProduct');
    return this.http.post<Product>(url, product);
  }
}
