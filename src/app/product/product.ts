import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Product as ProductModel } from './product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductComponent {
  products: ProductModel[] = [
    {
      productName: 'Sample Product',
      productCode: 'SP001',
      description: 'A sample product',
      category: 'Sample',
      price: 10.99,
      quantity: 100,
      imageUrl: 'https://via.placeholder.com/150',
      isActive: true,
    },
  ];

  showForm = false;
  productForm: FormGroup;
  pageSize = 10;
  pageIndex = 0;

  isSubmitting = false;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productCode: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.pattern(/^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/)],
      isActive: [true],
    });
  }

  get f() {
    return this.productForm.controls;
  }

  get totalPages() {
    return Math.max(Math.ceil(this.products.length / this.pageSize), 1);
  }

  get pagedProducts() {
    return this.products.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  get pageStart() {
    return this.products.length ? this.pageIndex * this.pageSize + 1 : 0;
  }

  get pageEnd() {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.products.length);
  }

  setPageSize(value: string) {
    this.pageSize = Number(value);
    this.pageIndex = 0;
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex -= 1;
    }
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex += 1;
    }
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.productForm.reset({ isActive: true, price: 0, quantity: 0 });
  }

  onSubmit() {
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;
    const newProduct: ProductModel = this.productForm.value;

    this.productService.createProduct(newProduct).subscribe({
      next: (createdProduct) => {
        this.products.push(createdProduct);
        this.closeForm();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('CreateProduct failed', err);
        this.submitError = 'Could not save product. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
