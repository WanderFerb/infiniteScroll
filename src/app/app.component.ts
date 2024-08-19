import { Component, inject } from '@angular/core';
import { Observable, BehaviorSubject, tap, switchMap, scan } from 'rxjs';
import { ProductsPaginator } from './models/models';
import { ProductsApiService } from './services/products-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private api = inject(ProductsApiService);

  public paginator$: Observable<ProductsPaginator>;

  public loading$ = new BehaviorSubject(true);
  private page$ = new BehaviorSubject(1);

  constructor() {
    this.paginator$ = this.loadProducts$();
  }

  private loadProducts$(): Observable<ProductsPaginator> {
    return this.page$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.api.getProducts$(page)),
      scan(this.updatePaginator, {items: [], page: 0, hasMorePages: true} as ProductsPaginator),
      tap(() => this.loading$.next(false)),
    );
  }

  private updatePaginator(accumulator: ProductsPaginator, value: ProductsPaginator): ProductsPaginator {
    if (value.page === 1) {
      return value;
    }

    accumulator.items.push(...value.items);
    accumulator.page = value.page;
    accumulator.hasMorePages = value.hasMorePages;

    return accumulator;
  }

  public loadMoreProducts(paginator: ProductsPaginator) {
    if (!paginator.hasMorePages) {
      return;
    }
    this.page$.next(paginator.page + 1);
  }
}
